"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { initDraw, type DrawInstance } from "@/app/draw";
import Link from "next/link";
import { AlertCircle, Check, Shapes } from "lucide-react";
import {
  Pencil,
  Minus,
  RectangleHorizontalIcon,
  Circle,
  Diamond,
  Type,
  Eraser,
  ZoomIn,
  ZoomOut,
  Undo,
  Sun,
  Moon,
  Download,
  Share2,
} from "lucide-react";

type Shape = "circle" | "rect" | "line" | "pencil" | "diamond" | "eraser" | "text";
type Theme = "dark" | "light";
type ShareState = "idle" | "copied" | "error";

function copyViaFallback(text: string): boolean {
  try {
    const scratch = document.createElement("textarea");
    scratch.value = text;
    scratch.setAttribute("readonly", "");
    scratch.style.position = "fixed";
    scratch.style.top = "-1000px";
    scratch.style.opacity = "0";
    document.body.appendChild(scratch);
    scratch.select();
    scratch.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(scratch);
    return ok;
  } catch {
    return false;
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  if (window.isSecureContext && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return copyViaFallback(text);
    }
  }

  return copyViaFallback(text);
}

const toolGroups = [
  {
    label: "Draw",
    tools: [{ id: "pencil" as Shape, icon: <Pencil size={18} />, label: "Pencil" }],
  },
  {
    label: "Shapes",
    tools: [
      { id: "line" as Shape, icon: <Minus size={18} />, label: "Line" },
      { id: "rect" as Shape, icon: <RectangleHorizontalIcon size={18} />, label: "Rectangle" },
      { id: "circle" as Shape, icon: <Circle size={18} />, label: "Circle" },
      { id: "diamond" as Shape, icon: <Diamond size={18} />, label: "Diamond" },
    ],
  },
  {
    label: "Tools",
    tools: [
      { id: "text" as Shape, icon: <Type size={18} />, label: "Text" },
      { id: "eraser" as Shape, icon: <Eraser size={18} />, label: "Eraser" },
    ],
  },
];

export function Canvas({
  roomId,
  boardName,
  socket,
}: {
  roomId: string;
  boardName: string;
  socket: WebSocket;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Shape>("pencil");
  const [zoom, setZoom] = useState(1);
  const drawInstanceRef = useRef<DrawInstance | null>(null);
  const themeRef = useRef<Theme>("light");
  const [theme, setTheme] = useState<Theme>("light");
  const [shareState, setShareState] = useState<ShareState>("idle");
  const shareResetRef = useRef<number | null>(null);

  useEffect(() => {
    (window as Window & { selectedTool?: Shape }).selectedTool = selectedTool;
  }, [selectedTool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    initDraw(canvas, roomId, socket, {
      theme: themeRef.current,
      onZoomChange: (z) => setZoom(z),
    }).then((instance) => {
      if (cancelled) {
        instance?.cleanup();
      } else {
        drawInstanceRef.current = instance;
      }
    });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawInstanceRef.current?.redraw();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      drawInstanceRef.current?.cleanup();
      drawInstanceRef.current = null;
    };
  }, [canvasRef, roomId, socket]);

  useEffect(() => {
    themeRef.current = theme;
    drawInstanceRef.current?.setTheme(theme);
  }, [theme]);

  const handleZoom = (zoomIn: boolean) => {
    drawInstanceRef.current?.changeZoom(zoomIn ? 0.1 : -0.1);
  };

  const cursorMap: Record<string, string> = {
    eraser: "cell",
    text: "text",
  };

  const cursor = cursorMap[selectedTool] || "crosshair";

  const toolbarBg = theme === "dark" ? "bg-[#211f2b]/95 border-white/10" : "bg-white/90 border-[#e8e6ed]";
  const canvasBg = theme === "dark" ? "bg-[#111017]" : "bg-[#f7f6fa]";
  const separatorColor = theme === "dark" ? "bg-white/10" : "bg-[#eeebf1]";

  const shareBoard = async () => {
    const ok = await copyToClipboard(window.location.href);
    setShareState(ok ? "copied" : "error");
    shareResetRef.current = window.setTimeout(() => setShareState("idle"), 2200);
  };

  useEffect(() => {
    return () => {
      if (shareResetRef.current) window.clearTimeout(shareResetRef.current);
    };
  }, []);

  return (
    <div className={`relative h-screen w-full overflow-hidden ${canvasBg}`}>
      <canvas
        ref={canvasRef}
        width={typeof window !== "undefined" ? window.innerWidth : 1920}
        height={typeof window !== "undefined" ? window.innerHeight : 1080}
        className="block"
        style={{ cursor }}
      />

      <header
        className={`fixed left-3 right-3 top-3 z-50 flex h-12 items-center justify-between rounded-2xl border px-3 shadow-[0_10px_35px_-20px_rgba(20,17,32,.4)] backdrop-blur-xl sm:left-6 sm:right-6 sm:top-5 sm:px-5 ${toolbarBg}`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            href="/dashboard"
            aria-label="Back to all boards"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700"
          >
            <Shapes className="h-4 w-4" />
          </Link>
          <span
            className={`truncate text-xs font-semibold ${theme === "dark" ? "text-white" : "text-[#34313f]"}`}
          >
            {boardName}
          </span>
          <span
            className={`hidden rounded-md px-2 py-1 text-[10px] sm:inline ${theme === "dark" ? "bg-white/5 text-white/45" : "bg-[#f5f3f8] text-[#898591]"}`}
          >
            Collaborative board
          </span>
        </div>
        <div className="relative flex shrink-0 items-center">
          <button
            type="button"
            onClick={shareBoard}
            aria-label="Copy a link to this board"
            className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold text-white transition ${
              shareState === "error" ? "bg-rose-600 hover:bg-rose-700" : "bg-violet-700 hover:bg-violet-800"
            }`}
          >
            {shareState === "copied" ? (
              <Check size={13} />
            ) : shareState === "error" ? (
              <AlertCircle size={13} />
            ) : (
              <Share2 size={13} />
            )}
            {shareState === "copied" ? "Copied" : shareState === "error" ? "Failed" : "Share"}
          </button>

          {shareState !== "idle" && (
            <span
              role="status"
              aria-live="polite"
              className={`pointer-events-none absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-[11px] font-medium shadow-lg ${
                theme === "dark"
                  ? "border-white/10 bg-[#2b2935] text-white"
                  : "border-[#ebe9ef] bg-white text-[#514d5a]"
              }`}
            >
              {shareState === "copied"
                ? "Link copied to clipboard"
                : "Couldn't copy — copy the URL from the address bar"}
            </span>
          )}
        </div>
      </header>

      <div
        className={`pointer-events-auto fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-2xl border px-2 py-2 shadow-lg backdrop-blur-xl sm:bottom-6 ${toolbarBg}`}
      >
        {/* Wraps to a second row on narrow viewports instead of overflowing and
            clipping the trailing controls behind a scrollbar. */}
        <div className="flex max-w-[calc(100vw-2rem)] flex-wrap items-center justify-center gap-y-1 sm:max-w-none sm:flex-nowrap sm:justify-start sm:gap-y-0">
          {toolGroups.map((group, gi) => (
            <Fragment key={group.label}>
              {gi > 0 && (
                <span aria-hidden="true" className={`mx-1 hidden h-6 w-px sm:block ${separatorColor}`} />
              )}
              <div className="flex items-center gap-0.5">
                {group.tools.map((t) => (
                  <ToolButton
                    key={t.id}
                    active={selectedTool === t.id}
                    icon={t.icon}
                    label={t.label}
                    onClick={() => setSelectedTool(t.id)}
                    theme={theme}
                  />
                ))}
              </div>
            </Fragment>
          ))}

          <span aria-hidden="true" className={`mx-1 hidden h-6 w-px sm:block ${separatorColor}`} />
          <div className="flex items-center gap-0.5">
            <ToolButton
              icon={<ZoomIn size={18} />}
              label="Zoom in"
              onClick={() => handleZoom(true)}
              theme={theme}
            />
            <ToolButton
              icon={<ZoomOut size={18} />}
              label="Zoom out"
              onClick={() => handleZoom(false)}
              theme={theme}
            />
          </div>

          <span aria-hidden="true" className={`mx-1 hidden h-6 w-px sm:block ${separatorColor}`} />
          <div className="flex items-center gap-0.5">
            <ToolButton
              icon={<Undo size={18} />}
              label="Undo"
              onClick={() => drawInstanceRef.current?.performUndo()}
              theme={theme}
            />
            <ToolButton
              icon={<Download size={18} />}
              label="Export PNG"
              onClick={() => drawInstanceRef.current?.exportPNG()}
              theme={theme}
            />
            <ToolButton
              icon={theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              label="Toggle theme"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              theme={theme}
            />
          </div>
        </div>
      </div>

      <div
        className={`fixed right-4 top-[4.25rem] z-40 flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-[11px] shadow-sm backdrop-blur-md sm:right-6 sm:top-[4.75rem] ${toolbarBg} ${theme === "dark" ? "text-zinc-300" : "text-[#777481]"}`}
      >
        <ZoomIn className="h-3.5 w-3.5" />
        <span>{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}

function ToolButton({
  active,
  icon,
  label,
  onClick,
  disabled,
  theme,
}: {
  active?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  theme: Theme;
}) {
  return (
    <div className="relative group">
      <button
        className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm transition-all ${
          disabled
            ? "opacity-25 cursor-not-allowed"
            : active
              ? theme === "dark"
                ? "bg-violet-500/20 text-violet-200 shadow-sm shadow-violet-500/20"
                : "bg-violet-100 text-violet-700"
              : theme === "dark"
                ? "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                : "text-[#817d89] hover:text-violet-700 hover:bg-[#f5f2fa]"
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
      </button>
      <div
        className={`absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs opacity-0 shadow-md transition-opacity pointer-events-none group-hover:opacity-100 ${theme === "dark" ? "border-white/10 bg-[#2b2935] text-white" : "border-[#ebe9ef] bg-white text-[#514d5a]"}`}
      >
        {label}
      </div>
    </div>
  );
}
