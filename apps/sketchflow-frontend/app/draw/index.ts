import axios from 'axios';
import { HTTP_BACKEND } from '../config';

// Define tool types
const VALID_TOOLS = ['rect', 'circle', 'line', 'pencil', 'diamond'] as const;
type DrawingTool = typeof VALID_TOOLS[number];

type Shape = 
  | { type: 'rect'; x: number; y: number; width: number; height: number; }
  | { type: 'circle'; centerX: number; centerY: number; radius: number; }
  | { type: 'line'; startX: number; startY: number; endX: number; endY: number; }
  | { type: 'pencil'; points: { x: number; y: number }[] }
  | { type: 'diamond'; centerX: number; centerY: number; width: number; height: number };

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
  } catch (error) {
    console.error('Failed to initialize shapes:', error);
  }

  // WebSocket handling
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === 'chat') {
        const parsedShape = JSON.parse(message.message);
        if (parsedShape.shape) {
          existingShapes.push(parsedShape.shape);
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

    isDrawing = true;
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

    if (!isDrawing) return;
    
    const pos = getCanvasPos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    const selectedTool = window.selectedTool || 'rect';

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

    let shape: Shape;
    switch (selectedTool) {
      case 'rect':
        shape = { type: 'rect', x: startX, y: startY, width, height };
        break;
      case 'circle':
        shape = {
          type: 'circle',
          centerX: startX + width / 2,
          centerY: startY + height / 2,
          radius: Math.max(Math.abs(width), Math.abs(height)) / 2
        };
        break;
      case 'line':
        shape = { type: 'line', startX, startY, endX: pos.x, endY: pos.y };
        break;
      case 'pencil':
        pencilPoints.push({ x: pos.x, y: pos.y });
        shape = { type: 'pencil', points: [...pencilPoints] };
        pencilPoints = [];
        break;
      case 'diamond':
        shape = {
          type: 'diamond',
          centerX: startX + width / 2,
          centerY: startY + height / 2,
          width,
          height
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
      const shape: Shape = { type: 'pencil', points: [...pencilPoints] };
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

      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
    } else { 
      offsetX -= e.deltaX;
      offsetY -= e.deltaY;
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
    }
  });

  
  clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom);
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