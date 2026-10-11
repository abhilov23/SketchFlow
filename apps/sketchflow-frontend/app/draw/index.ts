import { HTTP_BACKEND, authHeaders } from "../config";

const VALID_TOOLS = ["rect", "circle", "line", "pencil", "diamond", "eraser", "text"] as const;
type DrawingTool = (typeof VALID_TOOLS)[number];

type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number; id?: string }
  | { type: "circle"; centerX: number; centerY: number; radius: number; id?: string }
  | { type: "line"; startX: number; startY: number; endX: number; endY: number; id?: string }
  | { type: "pencil"; points: { x: number; y: number }[]; id?: string }
  | { type: "diamond"; centerX: number; centerY: number; width: number; height: number; id?: string }
  | { type: "text"; x: number; y: number; content: string; fontSize?: number; id?: string };

function getSelectedTool(): DrawingTool {
  const value = (window as Window & { selectedTool?: DrawingTool }).selectedTool;
  return value && VALID_TOOLS.includes(value) ? value : "rect";
}

export interface DrawInstance {
  redraw(): void;
  cleanup(): void;
  performUndo(): void;
  setTheme(theme: string): void;
  changeZoom(delta: number): number;
  exportPNG(): void;
}

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  options?: {
    onZoomChange?: (zoom: number) => void;
    theme?: string;
  },
): Promise<DrawInstance | null> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let existingShapes: Shape[] = [];

  const pendingSocketEvents: MessageEvent[] = [];
  socket.onmessage = (event) => pendingSocketEvents.push(event);
  socket.send(JSON.stringify({ type: "join_room", roomId }));
  try {
    existingShapes = await getExistingDShapes(roomId);
    existingShapes = existingShapes.map((shape, index) => {
      if (!shape.id) {
        return { ...shape, id: `existing-${index}` };
      }
      return shape;
    });
  } catch (error) {
    console.error("Failed to initialize shapes:", error);
  }

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
  let panModeEnabled = false;
  const undoStack: Array<{ type: "add" | "remove"; shape?: Shape; erasedShape?: Shape }> = [];
  let canvasTheme = options?.theme || "dark";

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" && textInput === null) {
      e.preventDefault();
      panModeEnabled = true;
    }
  };
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === "Space") {
      panModeEnabled = false;
    }
  };
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  const generateShapeId = () => {
    return `shape-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const createTextInput = (x: number, y: number) => {
    removeTextInput();

    textInput = document.createElement("textarea");
    textInput.style.position = "absolute";
    textInput.style.left = `${x + offsetX}px`;
    textInput.style.top = `${y + offsetY}px`;
    textInput.style.background = "transparent";
    textInput.style.color = canvasTheme === "light" ? "#252331" : "white";
    textInput.style.border = `1px dashed ${canvasTheme === "light" ? "#817d89" : "white"}`;
    textInput.style.padding = "4px";
    textInput.style.minWidth = "100px";
    textInput.style.minHeight = "30px";
    textInput.style.resize = "both";
    textInput.style.outline = "none";
    textInput.style.zIndex = "1000";
    textInput.style.fontFamily = "sans-serif";
    textInput.style.fontSize = "16px";
    textInput.style.transform = `scale(${zoom})`;
    textInput.style.transformOrigin = "top left";

    document.body.appendChild(textInput);
    setTimeout(() => textInput?.focus(), 0);

    textInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitText();
      } else if (e.key === "Escape") {
        removeTextInput();
      }
    });

    textInput.addEventListener("blur", submitText);

    return textInput;
  };

  const submitText = () => {
    if (textInput && textInput.value.trim()) {
      const rect = textInput.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();

      const x = (rect.left - canvasRect.left - offsetX) / zoom;
      const y = (rect.top - canvasRect.top - offsetY) / zoom;

      const shapeId = generateShapeId();
      const fontSize = parseInt(window.getComputedStyle(textInput).fontSize) / zoom;

      const shape: Shape = {
        type: "text",
        x,
        y,
        content: textInput.value.trim(),
        fontSize,
        id: shapeId,
      };

      existingShapes.push(shape);

      socket.send(
        JSON.stringify({
          type: "chat",
          roomId,
          message: JSON.stringify({ shape }),
        }),
      );

      removeTextInput();
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);
    } else if (textInput) {
      removeTextInput();
    }
  };

  const removeTextInput = () => {
    if (textInput && textInput.parentNode) {
      textInput.parentNode.removeChild(textInput);
      textInput = null;
    }
  };

  const findShapeAtPosition = (x: number, y: number): { shape: Shape; index: number } | null => {
    for (let i = existingShapes.length - 1; i >= 0; i--) {
      const shape = existingShapes[i];

      switch (shape.type) {
        case "rect":
          if (x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height) {
            return { shape, index: i };
          }
          break;
        case "circle": {
          const distSquared = Math.pow(x - shape.centerX, 2) + Math.pow(y - shape.centerY, 2);
          if (distSquared <= Math.pow(shape.radius, 2)) {
            return { shape, index: i };
          }
          break;
        }
        case "line": {
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
        }
        case "pencil":
          for (let j = 1; j < shape.points.length; j++) {
            const p1 = shape.points[j - 1];
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
        case "diamond": {
          const halfWidth = shape.width / 2;
          const halfHeight = shape.height / 2;
          const pointRelX = Math.abs(x - shape.centerX);
          const pointRelY = Math.abs(y - shape.centerY);

          if (pointRelX / halfWidth + pointRelY / halfHeight <= 1) {
            return { shape, index: i };
          }
          break;
        }
        case "text": {
          const fontSize = shape.fontSize || 16;
          const previousFont = ctx.font;
          ctx.font = `${fontSize}px sans-serif`;
          const textWidth = ctx.measureText(shape.content).width;
          ctx.font = previousFont;

          if (x >= shape.x && x <= shape.x + textWidth && y >= shape.y - fontSize && y <= shape.y) {
            return { shape, index: i };
          }
          break;
        }
      }
    }
    return null;
  };

  const getCanvasPos = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - offsetX) / zoom,
      y: (e.clientY - rect.top - offsetY) / zoom,
    };
  };

  const handleMouseDown = (e: MouseEvent) => {
    const pos = getCanvasPos(e);
    startX = pos.x;
    startY = pos.y;

    if (panModeEnabled || e.button === 1 || (e.shiftKey && e.button === 0)) {
      isPanning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      return;
    }

    if (getSelectedTool() === "text") {
      createTextInput(startX, startY);
      return;
    }

    isDrawing = true;

    if (getSelectedTool() === "eraser") {
      const foundShape = findShapeAtPosition(pos.x, pos.y);
      if (foundShape) {
        const { shape } = foundShape;
        undoStack.push({ type: "remove", erasedShape: shape });
        existingShapes = existingShapes.filter((s) => s.id !== shape.id);
        socket.send(
          JSON.stringify({
            type: "chat",
            roomId,
            message: JSON.stringify({ eraseId: shape.id }),
          }),
        );
        clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);
      }
      isDrawing = false;
      return;
    }

    if (getSelectedTool() === "pencil") {
      pencilPoints = [{ x: startX, y: startY }];
    }
  };

  canvas.addEventListener("mousedown", handleMouseDown);

  const handleMouseMove = (e: MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStartX;
      const dy = e.clientY - panStartY;
      offsetX += dx;
      offsetY += dy;
      panStartX = e.clientX;
      panStartY = e.clientY;
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);
      return;
    }

    const pos = getCanvasPos(e);

    if (getSelectedTool() === "eraser") {
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);

      applyTransform(ctx, offsetX, offsetY, zoom);
      ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
      ctx.lineWidth = 2;
      const eraserSize = 10;
      ctx.strokeRect(pos.x - eraserSize / 2, pos.y - eraserSize / 2, eraserSize, eraserSize);
      ctx.lineWidth = 1;

      const foundShape = findShapeAtPosition(pos.x, pos.y);
      if (foundShape) {
        const { shape } = foundShape;
        ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";

        switch (shape.type) {
          case "rect":
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            break;
          case "circle":
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
            ctx.stroke();
            break;
          case "line":
            ctx.beginPath();
            ctx.moveTo(shape.startX, shape.startY);
            ctx.lineTo(shape.endX, shape.endY);
            ctx.stroke();
            break;
          case "pencil":
            if (shape.points.length > 1) {
              ctx.beginPath();
              ctx.moveTo(shape.points[0].x, shape.points[0].y);
              for (let i = 1; i < shape.points.length; i++) {
                ctx.lineTo(shape.points[i].x, shape.points[i].y);
              }
              ctx.stroke();
            }
            break;
          case "diamond": {
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
          case "text": {
            const fontSize = shape.fontSize || 16;
            const previousFont = ctx.font;
            ctx.font = `${fontSize}px sans-serif`;
            const textWidth = ctx.measureText(shape.content).width;
            ctx.font = previousFont;
            ctx.strokeRect(shape.x, shape.y - fontSize, textWidth, fontSize);
            break;
          }
        }
      }
      return;
    }

    if (!isDrawing) return;

    const width = pos.x - startX;
    const height = pos.y - startY;
    const selectedTool = getSelectedTool();

    if (selectedTool === "text") return;

    clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);
    ctx.strokeStyle = canvasTheme === "light" ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
    applyTransform(ctx, offsetX, offsetY, zoom);
    ctx.lineWidth = 1 / zoom;

    switch (selectedTool) {
      case "rect":
        ctx.strokeRect(startX, startY, width, height);
        break;
      case "circle": {
        ctx.beginPath();
        const centerX = startX + width / 2;
        const centerY = startY + height / 2;
        const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }
      case "line":
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        break;
      case "pencil":
        pencilPoints.push({ x: pos.x, y: pos.y });
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(pencilPoints[0].x, pencilPoints[0].y);
        for (let i = 1; i < pencilPoints.length; i++) {
          ctx.lineTo(pencilPoints[i].x, pencilPoints[i].y);
        }
        ctx.stroke();
        break;
      case "diamond": {
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
    }
  };
  canvas.addEventListener("mousemove", handleMouseMove);

  const handleMouseUp = (e: MouseEvent) => {
    if (isPanning) {
      isPanning = false;
      return;
    }

    if (!isDrawing) return;
    isDrawing = false;

    const pos = getCanvasPos(e);
    const width = pos.x - startX;
    const height = pos.y - startY;
    const selectedTool = getSelectedTool();

    if (selectedTool === "eraser" || selectedTool === "text") return;

    const shapeId = generateShapeId();

    let shape: Shape;
    switch (selectedTool) {
      case "rect":
        shape = { type: "rect", x: startX, y: startY, width, height, id: shapeId };
        break;
      case "circle":
        shape = {
          type: "circle",
          centerX: startX + width / 2,
          centerY: startY + height / 2,
          radius: Math.max(Math.abs(width), Math.abs(height)) / 2,
          id: shapeId,
        };
        break;
      case "line":
        shape = { type: "line", startX, startY, endX: pos.x, endY: pos.y, id: shapeId };
        break;
      case "pencil":
        pencilPoints.push({ x: pos.x, y: pos.y });
        shape = { type: "pencil", points: [...pencilPoints], id: shapeId };
        pencilPoints = [];
        break;
      case "diamond":
        shape = {
          type: "diamond",
          centerX: startX + width / 2,
          centerY: startY + height / 2,
          width,
          height,
          id: shapeId,
        };
        break;
      default:
        return;
    }

    existingShapes.push(shape);
    undoStack.push({ type: "add", shape });
    socket.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify({ shape }),
      }),
    );
    clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);
  };
  canvas.addEventListener("mouseup", handleMouseUp);

  const handleMouseLeave = () => {
    if (isDrawing && getSelectedTool() === "pencil") {
      isDrawing = false;
      const shapeId = generateShapeId();
      const shape: Shape = { type: "pencil", points: [...pencilPoints], id: shapeId };
      existingShapes.push(shape);
      socket.send(
        JSON.stringify({
          type: "chat",
          roomId,
          message: JSON.stringify({ shape }),
        }),
      );
      pencilPoints = [];
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);
    }
    isPanning = false;
  };
  canvas.addEventListener("mouseleave", handleMouseLeave);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const zoomFactor = 0.1;
      const mouseX = e.clientX - canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - canvas.getBoundingClientRect().top;

      const oldZoom = zoom;
      zoom += e.deltaY < 0 ? zoomFactor : -zoomFactor;
      zoom = Math.max(0.1, Math.min(zoom, 5.0));

      options?.onZoomChange?.(zoom);

      offsetX = mouseX - (mouseX - offsetX) * (zoom / oldZoom);
      offsetY = mouseY - (mouseY - offsetY) * (zoom / oldZoom);

      if (textInput) {
        const rect = textInput.getBoundingClientRect();
        const x = ((rect.left - canvas.getBoundingClientRect().left - offsetX) / oldZoom) * zoom + offsetX;
        const y = ((rect.top - canvas.getBoundingClientRect().top - offsetY) / oldZoom) * zoom + offsetY;

        textInput.style.left = `${x}px`;
        textInput.style.top = `${y}px`;
        textInput.style.transform = `scale(${zoom})`;
      }

      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);
    } else {
      offsetX -= e.deltaX;
      offsetY -= e.deltaY;

      if (textInput) {
        const rect = textInput.getBoundingClientRect();
        textInput.style.left = `${rect.left - e.deltaX}px`;
        textInput.style.top = `${rect.top - e.deltaY}px`;
      }

      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);
    }
  };
  canvas.addEventListener("wheel", handleWheel, { passive: false });

  const handleBeforeUnload = () => {
    removeTextInput();
  };
  window.addEventListener("beforeunload", handleBeforeUnload);

  clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);

  const handleSocketMessage = (event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type !== "chat") return;
      const parsedData = JSON.parse(message.message);
      if (
        parsedData.shape &&
        VALID_TOOLS.filter((tool) => tool !== "eraser").includes(parsedData.shape.type)
      ) {
        const newShape = parsedData.shape as Shape;
        if (!existingShapes.some((shape) => shape.id && shape.id === newShape.id))
          existingShapes.push(newShape);
      } else if (parsedData.eraseId) {
        existingShapes = existingShapes.filter((shape) => shape.id !== parsedData.eraseId);
      }
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);
    } catch (error) {
      console.error("WebSocket message error:", error);
    }
  };
  socket.onmessage = handleSocketMessage;
  socket.onerror = (error) => console.error("WebSocket error:", error);
  socket.onclose = () => console.log("WebSocket connection closed");
  pendingSocketEvents.forEach(handleSocketMessage);
  pendingSocketEvents.length = 0;

  return {
    redraw: () => clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme),
    cleanup: () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("wheel", handleWheel);
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      removeTextInput();
    },
    performUndo: () => {
      const action = undoStack.pop();
      if (!action) return;
      if (action.type === "add" && action.shape) {
        existingShapes = existingShapes.filter((s) => s.id !== action.shape!.id);
        socket.send(
          JSON.stringify({
            type: "chat",
            roomId,
            message: JSON.stringify({ eraseId: action.shape.id }),
          }),
        );
      } else if (action.type === "remove" && action.erasedShape) {
        existingShapes.push(action.erasedShape);
        socket.send(
          JSON.stringify({
            type: "chat",
            roomId,
            message: JSON.stringify({ shape: action.erasedShape }),
          }),
        );
      }
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);
    },
    setTheme: (newTheme: string) => {
      canvasTheme = newTheme;
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);
    },
    changeZoom: (delta: number) => {
      const oldZoom = zoom;
      zoom = Math.max(0.1, Math.min(zoom + delta, 5.0));
      const rect = canvas.getBoundingClientRect();
      const mouseX = rect.width / 2;
      const mouseY = rect.height / 2;
      offsetX = mouseX - (mouseX - offsetX) * (zoom / oldZoom);
      offsetY = mouseY - (mouseY - offsetY) * (zoom / oldZoom);
      options?.onZoomChange?.(zoom);
      clearCanvas(existingShapes, canvas, ctx, offsetX, offsetY, zoom, canvasTheme);
      return zoom;
    },
    exportPNG: () => {
      const link = document.createElement("a");
      link.download = `sketchflow-${roomId}.png`;
      link.href = canvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  };
}

function applyTransform(ctx: CanvasRenderingContext2D, offsetX: number, offsetY: number, zoom: number) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(offsetX, offsetY);
  ctx.scale(zoom, zoom);
}

function getBackgroundPattern(ctx: CanvasRenderingContext2D, theme: string): CanvasPattern | string {
  const isLight = theme === "light";
  const key = isLight ? "light" : "dark";

  const cached = backgroundPatterns.get(key);
  if (cached) return cached;

  const tile = document.createElement("canvas");
  tile.width = 18;
  tile.height = 18;

  const tileCtx = tile.getContext("2d");
  if (!tileCtx) return isLight ? "rgba(252, 251, 253, 1)" : "rgba(17, 16, 23, 1)";

  tileCtx.fillStyle = isLight ? "rgba(252, 251, 253, 1)" : "rgba(17, 16, 23, 1)";
  tileCtx.fillRect(0, 0, tile.width, tile.height);

  if (isLight) {
    tileCtx.fillStyle = "rgba(217, 212, 226, 0.72)";
    tileCtx.beginPath();
    tileCtx.arc(9, 9, 0.8, 0, 2 * Math.PI);
    tileCtx.fill();
  }

  const pattern = ctx.createPattern(tile, "repeat");
  const value: CanvasPattern | string =
    pattern ?? (isLight ? "rgba(252, 251, 253, 1)" : "rgba(17, 16, 23, 1)");
  backgroundPatterns.set(key, value);
  return value;
}

const backgroundPatterns = new Map<string, CanvasPattern | string>();

function clearCanvas(
  existingShapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  offsetX: number,
  offsetY: number,
  zoom: number,
  theme?: string,
) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const isLight = theme === "light";
  ctx.fillStyle = getBackgroundPattern(ctx, theme ?? "dark");
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = isLight ? "rgba(80, 75, 90, 1)" : "rgba(255, 255, 255, 1)";
  applyTransform(ctx, offsetX, offsetY, zoom);
  ctx.lineWidth = 1 / zoom;
  ctx.font = "16px sans-serif"; // Set default font

  existingShapes.forEach((shape) => {
    switch (shape.type) {
      case "rect":
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(shape.startX, shape.startY);
        ctx.lineTo(shape.endX, shape.endY);
        ctx.stroke();
        break;
      case "pencil":
        if (shape.points.length > 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(shape.points[0].x, shape.points[0].y);
          for (let i = 1; i < shape.points.length; i++) {
            ctx.lineTo(shape.points[i].x, shape.points[i].y);
          }
          ctx.stroke();
        }
        break;
      case "diamond": {
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
      case "text": {
        if (shape.fontSize) {
          ctx.font = `${shape.fontSize}px sans-serif`;
        }
        ctx.fillStyle = isLight ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 1)";
        ctx.fillText(shape.content, shape.x, shape.y);
        ctx.font = "16px sans-serif";
        ctx.fillStyle = isLight ? "rgba(80, 75, 90, 1)" : "rgba(255, 255, 255, 1)";
        break;
      }
    }
  });
}

async function getExistingDShapes(roomId: string): Promise<Shape[]> {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${HTTP_BACKEND}/chats/${roomId}`, {
      headers: token ? authHeaders(token) : {},
    });

    if (response.status === 401) return [];

    const data: { messages?: { id: number; message: string }[] } = await response.json();
    if (!response.ok) return [];

    const messages = data.messages ?? [];
    const shapes: Shape[] = [];

    for (const chat of messages) {
      try {
        const parsed = JSON.parse(chat.message);
        if (parsed.shape && VALID_TOOLS.filter((tool) => tool !== "eraser").includes(parsed.shape.type)) {
          const shape = parsed.shape as Shape;
          if (!shape.id) shape.id = `chat-${chat.id}`;
          if (!shapes.some((entry) => entry.id === shape.id)) shapes.push(shape);
        } else if (parsed.eraseId) {
          const index = shapes.findIndex((shape) => shape.id === parsed.eraseId);
          if (index !== -1) shapes.splice(index, 1);
        }
      } catch {
        console.warn("Invalid board event:", chat.id);
      }
    }
    return shapes;
  } catch (error) {
    console.error("Failed to fetch shapes:", error);
    return [];
  }
}
