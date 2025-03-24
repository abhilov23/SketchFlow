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

// Extend Window interface
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
          clearCanvas(existingShapes, canvas, ctx);
        }
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  };

  socket.onerror = (error) => console.error('WebSocket error:', error);
  socket.onclose = () => console.log('WebSocket connection closed');

  // Initial render
  clearCanvas(existingShapes, canvas, ctx);

  // Drawing state
  let isDrawing = false;
  let startX = 0;
  let startY = 0;
  let pencilPoints: { x: number; y: number }[] = []; //for storing pencil points

  // Get canvas-adjusted coordinates
  const getCanvasPos = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const pos = getCanvasPos(e);
    startX = pos.x;
    startY = pos.y;
    if (window.selectedTool === 'pencil') {
      pencilPoints = [{ x: startX, y: startY }]; // Initialize pencil points
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    
    const pos = getCanvasPos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    const selectedTool = window.selectedTool || 'rect';

    // Preview drawing
    clearCanvas(existingShapes, canvas, ctx);
    ctx.strokeStyle = 'rgba(255, 255, 255, 1)';

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
        pencilPoints = []; // Reset pencil points
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
  });

  // Handle case when mouse leaves canvas while drawing
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
      clearCanvas(existingShapes, canvas, ctx);
    }
  });
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
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
          ctx.moveTo(shape.centerX, shape.centerY - halfHeight);           // Top
          ctx.lineTo(shape.centerX + halfWidth, shape.centerY);           // Right
          ctx.lineTo(shape.centerX, shape.centerY + halfHeight);          // Bottom
          ctx.lineTo(shape.centerX - halfWidth, shape.centerY);           // Left
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