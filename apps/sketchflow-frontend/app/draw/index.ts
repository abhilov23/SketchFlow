import axios from 'axios';
import { HTTP_BACKEND } from '../config';

// Define tool types
const VALID_TOOLS = ['rect', 'circle', 'line', 'pencil', 'diamond', 'eraser', 'text'] as const;
type DrawingTool = typeof VALID_TOOLS[number];

type Shape = 
  | { type: 'rect'; x: number; y: number; width: number; height: number; id?: string; }
  | { type: 'circle'; centerX: number; centerY: number; radius: number; id?: string; }
  | { type: 'line'; startX: number; startY: number; endX: number; endY: number; id?: string; }
  | { type: 'pencil'; points: { x: number; y: number }[]; id?: string; }
  | { type: 'diamond'; centerX: number; centerY: number; width: number; height: number; id?: string; }
  | { type: 'text'; x: number; y: number; content: string; fontSize?: number; id?: string; };

// Extend Window interface for custom-Window
interface CustomWindow extends Window {
  selectedTool?: DrawingTool;
}
declare const window: CustomWindow;

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let existingShapes: Shape[] = [];
  try {
    existingShapes = await getExistingDShapes(roomId);
    // Assign IDs to existing shapes if they don't have them
    existingShapes = existingShapes.map((shape, index) => {
      if (!shape.id) {
        return { ...shape, id: `existing-${index}` };
      }
      return shape;
    });
  } catch (error) {
    console.error('Failed to initialize shapes:', error);
  }

  // WebSocket handling
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === 'chat') {
        const parsedData = JSON.parse(message.message);
        
        if (parsedData.shape) {
          // Add new shape
          existingShapes.push(parsedData.shape);
          clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
        } else if (parsedData.eraseId) {
          // Remove erased shape
          existingShapes = existingShapes.filter(shape => shape.id !== parsedData.eraseId);
          clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
        }
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  };

  socket.onerror = (error) => console.error('WebSocket error:', error);
  socket.onclose = () => console.log('WebSocket connection closed');

  // Drawing state
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let pencilPoints: { x: number; y: number }[] = [];
  let isPanning = false;
  let panStartX = 0;
  let panStartY = 0;
  let offsetX = 0; 
  let offsetY = 0;
  let zoom = 1.0; 
  let textInput: HTMLTextAreaElement | null = null;

  // Function to generate a unique ID for shapes
  const generateShapeId = () => {
    return `shape-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  // Function to create text input element
  const createTextInput = (x: number, y: number) => {
    // Remove existing text input if any
    removeTextInput();
    
    textInput = document.createElement('textarea');
    textInput.style.position = 'absolute';
    textInput.style.left = `${x + offsetX}px`;
    textInput.style.top = `${y + offsetY}px`;
    textInput.style.background = 'transparent';
    textInput.style.color = 'white';
    textInput.style.border = '1px dashed white';
    textInput.style.padding = '4px';
    textInput.style.minWidth = '100px';
    textInput.style.minHeight = '30px';
    textInput.style.resize = 'both';
    textInput.style.outline = 'none';
    textInput.style.zIndex = '1000';
    textInput.style.fontFamily = 'sans-serif';
    textInput.style.fontSize = '16px';
    textInput.style.transform = `scale(${zoom})`;
    textInput.style.transformOrigin = 'top left';
    
    document.body.appendChild(textInput);
    setTimeout(() => textInput?.focus(), 0);
    
    // Handle text submission with Enter key (Shift+Enter for new line)
    textInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitText();
      } else if (e.key === 'Escape') {
        removeTextInput();
      }
    });
    
    // Handle blur event to submit text
    textInput.addEventListener('blur', submitText);
    
    return textInput;
  };
  
  // Function to submit text and add it as a shape
  const submitText = () => {
    if (textInput && textInput.value.trim()) {
      const rect = textInput.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();
      
      // Calculate position relative to canvas and zoom
      const x = (rect.left - canvasRect.left - offsetX) / zoom;
      const y = (rect.top - canvasRect.top - offsetY) / zoom;
      
      const shapeId = generateShapeId();
      const fontSize = parseInt(window.getComputedStyle(textInput).fontSize) / zoom;
      
      const shape: Shape = {
        type: 'text',
        x,
        y,
        content: textInput.value.trim(),
        fontSize,
        id: shapeId
      };
      
      existingShapes.push(shape);
      
      socket.send(JSON.stringify({
        type: 'chat',
        roomId,
        message: JSON.stringify({ shape })
      }));
      
      removeTextInput();
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
    } else if (textInput) {
      removeTextInput();
    }
  };
  
  // Function to remove text input
  const removeTextInput = () => {
    if (textInput && textInput.parentNode) {
      textInput.parentNode.removeChild(textInput);
      textInput = null;
    }
  };

  // Function to find a shape at a specific position
  const findShapeAtPosition = (x: number, y: number): { shape: Shape, index: number } | null => {
    // Check in reverse order to find the topmost shape first
    for (let i = existingShapes.length - 1; i >= 0; i--) {
      const shape = existingShapes[i];
      
      switch (shape.type) {
        case 'rect':
          if (x >= shape.x && x <= shape.x + shape.width &&
              y >= shape.y && y <= shape.y + shape.height) {
            return { shape, index: i };
          }
          break;
        case 'circle':
          const distSquared = Math.pow(x - shape.centerX, 2) + Math.pow(y - shape.centerY, 2);
          if (distSquared <= Math.pow(shape.radius, 2)) {
            return { shape, index: i };
          }
          break;
        case 'line':
          // Check if point is near the line (rough approximation)
          const lineDistThreshold = 5; // Pixels tolerance
          const dx = shape.endX - shape.startX;
          const dy = shape.endY - shape.startY;
          const length = Math.sqrt(dx * dx + dy * dy);
          
          if (length === 0) {
            const distToPoint = Math.sqrt(Math.pow(x - shape.startX, 2) + Math.pow(y - shape.startY, 2));
            if (distToPoint <= lineDistThreshold) {
              return { shape, index: i };
            }
          } else {
            const t = ((x - shape.startX) * dx + (y - shape.startY) * dy) / (length * length);
            if (t >= 0 && t <= 1) {
              const projX = shape.startX + t * dx;
              const projY = shape.startY + t * dy;
              const distToLine = Math.sqrt(Math.pow(x - projX, 2) + Math.pow(y - projY, 2));
              if (distToLine <= lineDistThreshold / zoom) {
                return { shape, index: i };
              }
            }
          }
          break;
        case 'pencil':
          // Check if near any segment of the pencil line
          for (let j = 1; j < shape.points.length; j++) {
            const p1 = shape.points[j-1];
            const p2 = shape.points[j];
            
            const segmentDx = p2.x - p1.x;
            const segmentDy = p2.y - p1.y;
            const segmentLength = Math.sqrt(segmentDx * segmentDx + segmentDy * segmentDy);
            
            if (segmentLength === 0) continue;
            
            const t = ((x - p1.x) * segmentDx + (y - p1.y) * segmentDy) / (segmentLength * segmentLength);
            if (t >= 0 && t <= 1) {
              const projX = p1.x + t * segmentDx;
              const projY = p1.y + t * segmentDy;
              const distToSegment = Math.sqrt(Math.pow(x - projX, 2) + Math.pow(y - projY, 2));
              if (distToSegment <= 5 / zoom) {
                return { shape, index: i };
              }
            }
          }
          break;
        case 'diamond':
          // Check if point is inside diamond
          const halfWidth = shape.width / 2;
          const halfHeight = shape.height / 2;
          const pointRelX = Math.abs(x - shape.centerX);
          const pointRelY = Math.abs(y - shape.centerY);
          
          if (pointRelX / halfWidth + pointRelY / halfHeight <= 1) {
            return { shape, index: i };
          }
          break;
        case 'text':
          // Approximate text bounding box (would need refinement based on font metrics)
          const textWidth = ctx.measureText(shape.content).width;
          const textHeight = shape.fontSize || 16;
          
          if (x >= shape.x && x <= shape.x + textWidth &&
              y >= shape.y - textHeight && y <= shape.y) {
            return { shape, index: i };
          }
          break;
      }
    }
    return null;
  };
 
  const getCanvasPos = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offsetX) / zoom,
      y: (e.clientY - rect.top - offsetY) / zoom
    };
  };

  canvas.addEventListener('mousedown', (e) => {
    const pos = getCanvasPos(e);
    startX = pos.x;
    startY = pos.y;

    if (e.button === 1 || (e.shiftKey && e.button === 0)) { 
      isPanning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      return;
    }

    // Handle text tool click
    if (window.selectedTool === 'text') {
      createTextInput(startX * zoom, startY * zoom);
      return;
    }
    
    isDrawing = true;
    
    // Handle eraser tool
    if (window.selectedTool === 'eraser') {
      const foundShape = findShapeAtPosition(pos.x, pos.y);
      if (foundShape) {
        const { shape } = foundShape;
        // Remove the shape locally
        existingShapes = existingShapes.filter(s => s.id !== shape.id);
        // Notify other clients
        socket.send(JSON.stringify({
          type: 'chat',
          roomId,
          message: JSON.stringify({ eraseId: shape.id })
        }));
        clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
      }
      isDrawing = false;
      return;
    }
    
    if (window.selectedTool === 'pencil') {
      pencilPoints = [{ x: startX, y: startY }];
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isPanning) {
      const dx = e.clientX - panStartX;
      const dy = e.clientY - panStartY;
      offsetX += dx;
      offsetY += dy;
      panStartX = e.clientX;
      panStartY = e.clientY;
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
      return;
    }

    const pos = getCanvasPos(e);
    
    // Handle eraser hover effect
    if (window.selectedTool === 'eraser') {
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
      
      // Draw eraser cursor
      applyTransform(ctx, offsetX, offsetY, zoom);
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
      ctx.lineWidth = 2;
      const eraserSize = 10;
      ctx.strokeRect(pos.x - eraserSize/2, pos.y - eraserSize/2, eraserSize, eraserSize);
      ctx.lineWidth = 1;
      
      // Highlight shape under cursor
      const foundShape = findShapeAtPosition(pos.x, pos.y);
      if (foundShape) {
        const { shape } = foundShape;
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
        
        switch (shape.type) {
          case 'rect':
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            break;
          case 'circle':
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
            ctx.stroke();
            break;
          case 'line':
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.stroke();
            break;
          case 'pencil':
            if (shape.points.length > 1) {
              ctx.beginPath();
              ctx.moveTo(shape.points[0].x, shape.points[0].y);
              for (let i = 1; i < shape.points.length; i++) {
                ctx.lineTo(shape.points[i].x, shape.points[i].y);
              }
              ctx.stroke();
            }
            break;
          case 'diamond':
            ctx.beginPath();
            const halfWidth = shape.width / 2;
            const halfHeight = shape.height / 2;
            ctx.moveTo(shape.centerX, shape.centerY - halfHeight);
            ctx.lineTo(shape.centerX + halfWidth, shape.centerY);
            ctx.lineTo(shape.centerX, shape.centerY + halfHeight);
            ctx.lineTo(shape.centerX - halfWidth, shape.centerY);
            ctx.closePath();
            ctx.stroke();
            break;
          case 'text':
            // Highlight text bounding box
            const textWidth = ctx.measureText(shape.content).width;
            const textHeight = shape.fontSize || 16;
            ctx.strokeRect(shape.x, shape.y - textHeight, textWidth, textHeight);
            break;
        }
      }
      return;
    }

    if (!isDrawing) return;
    
    const width = pos.x - startX;
    const height = pos.y - startY;
    const selectedTool = window.selectedTool || 'rect';

    // Don't preview for text tool
    if (selectedTool === 'text') return;

    // Preview drawing
    clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    applyTransform(ctx, offsetX, offsetY, zoom);

    switch (selectedTool) {
      case 'rect':
        ctx.strokeRect(startX, startY, width, height);
        break;
      case 'circle':
        ctx.beginPath();
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        break;
      case 'pencil':
        pencilPoints.push({ x: pos.x, y: pos.y });
        ctx.beginPath();
        ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);
        for (let i = 1; i < pencilPoints.length; i++) {
          ctx.lineTo(pencilPoints[i].x, pencilPoints[i].y);
        }
        ctx.stroke();
        break;
      case 'diamond':
        ctx.beginPath();
        const midX = startX + width / 2;
        const midY = startY + height / 2;
        ctx.moveTo(midX, startY);
        ctx.lineTo(startX + width, midY);
        ctx.lineTo(midX, startY + height);
        ctx.lineTo(startX, midY);
        ctx.closePath();
        ctx.stroke();
        break;
    }
  });

  canvas.addEventListener('mouseup', (e) => {
    if (isPanning) {
      isPanning = false;
      return;
    }

    if (!isDrawing) return;
    isDrawing = false;

    const pos = getCanvasPos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    const selectedTool = window.selectedTool || 'rect';
    
    // Don't create shapes with eraser or text
    if (selectedTool === 'eraser' || selectedTool === 'text') return;

    // Generate a unique ID for the shape
    const shapeId = generateShapeId();

    let shape: Shape;
    switch (selectedTool) {
      case 'rect':
        shape = { type: 'rect', x: startX, y: startY, width, height, id: shapeId };
        break;
      case 'circle':
        shape = {
          type: 'circle',
          centerX: startX + width / 2,
          centerY: startY + height / 2,
          radius: Math.max(Math.abs(width), Math.abs(height)) / 2,
          id: shapeId
        };
        break;
      case 'line':
        shape = { type: 'line', startX, startY, endX: pos.x, endY: pos.y, id: shapeId };
        break;
      case 'pencil':
        pencilPoints.push({ x: pos.x, y: pos.y });
        shape = { type: 'pencil', points: [...pencilPoints], id: shapeId };
        pencilPoints = [];
        break;
      case 'diamond':
        shape = {
          type: 'diamond',
          centerX: startX + width / 2,
          centerY: startY + height / 2,
          width,
          height,
          id: shapeId
        };
        break;
      default:
        return;
    }

    existingShapes.push(shape);
    socket.send(JSON.stringify({
      type: 'chat',
      roomId,
      message: JSON.stringify({ shape })
    }));
    clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
  });

  
  canvas.addEventListener('mouseleave', () => {
    if (isDrawing && window.selectedTool === 'pencil') {
      isDrawing = false;
      const shapeId = generateShapeId();
      const shape: Shape = { type: 'pencil', points: [...pencilPoints], id: shapeId };
      existingShapes.push(shape);
      socket.send(JSON.stringify({
        type: 'chat',
        roomId,
        message: JSON.stringify({ shape })
      }));
      pencilPoints = [];
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
    }
    isPanning = false;
  });

  // Zoom handling
  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const zoomFactor = 0.1;
      const mouseX = e.clientX - canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - canvas.getBoundingClientRect().top;
      
      const oldZoom = zoom;
      zoom += e.deltaY < 0 ? zoomFactor : -zoomFactor;
      zoom = Math.max(0.1, Math.min(zoom, 5.0)); 

      // Adjust offset to zoom towards mouse
      offsetX = mouseX - (mouseX - offsetX) * (zoom / oldZoom);
      offsetY = mouseY - (mouseY - offsetY) * (zoom / oldZoom);

      // Update text input position if it exists
      if (textInput) {
        const rect = textInput.getBoundingClientRect();
        const x = (rect.left - canvas.getBoundingClientRect().left - offsetX) / oldZoom * zoom + offsetX;
        const y = (rect.top - canvas.getBoundingClientRect().top - offsetY) / oldZoom * zoom + offsetY;
        
        textInput.style.left = `${x}px`;
        textInput.style.top = `${y}px`;
        textInput.style.transform = `scale(${zoom})`;
      }

      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
    } else { 
      offsetX -= e.deltaX;
      offsetY -= e.deltaY;
      
      // Update text input position if it exists
      if (textInput) {
        const rect = textInput.getBoundingClientRect();
        textInput.style.left = `${rect.left - e.deltaX}px`;
        textInput.style.top = `${rect.top - e.deltaY}px`;
      }
      
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
    }
  });

  // Cleanup event listener when component unmounts
  const handleBeforeUnload = () => {
    removeTextInput();
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
  
  // Return utility functions for use by parent component
  return {
    redraw: () => clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom),
    cleanup: () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      removeTextInput();
    }
  };
}

// Moved applyTransform outside initDraw
function applyTransform(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, zoom: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); 
  ctx.translate(offsetX, offsetY);
  ctx.scale(zoom, zoom);
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, zoom: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); 
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
  applyTransform(ctx, offsetX, offsetY, zoom);
  ctx.font = '16px sans-serif'; // Set default font

  existingShapes.forEach((shape) => {
    switch (shape.type) {
      case 'rect':
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.stroke();
        break;
      case 'pencil':
        if (shape.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          for (let i = 1; i < shape.points.length; i++) {
            ctx.lineTo(shape.points[i].x, shape.points[i].y);
          }
          ctx.stroke();
        }
        break;
      case 'diamond':
        ctx.beginPath();
        const halfWidth = shape.width / 2;
        const halfHeight = shape.height / 2;
        ctx.moveTo(shape.centerX, shape.centerY - halfHeight);
        ctx.lineTo(shape.centerX + halfWidth, shape.centerY);
        ctx.lineTo(shape.centerX, shape.centerY + halfHeight);
        ctx.lineTo(shape.centerX - halfWidth, shape.centerY);
        ctx.closePath();
        ctx.stroke();
        break;
      case 'text':
        // Set font size if specified
        if (shape.fontSize) {
          ctx.font = `${shape.fontSize}px sans-serif`;
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.fillText(shape.content, shape.x, shape.y);
        ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Reset fill style
        break;
    }
  });
}

async function getExistingDShapes(roomId: string): Promise<Shape[]> {
  try {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages || [];
    
    return messages
      .map((x: { message: string }) => {
        try {
          const parsed = x.message.startsWith('{') ? JSON.parse(x.message) : {};
          return parsed.shape;
        } catch (e) {
          console.warn('Invalid shape message:', x.message);
          return null;
        }
      })
      .filter((shape): shape is Shape => shape !== null && VALID_TOOLS.includes(shape.type));
  } catch (error) {
    console.error('Failed to fetch shapes:', error);
    return [];
  }
}