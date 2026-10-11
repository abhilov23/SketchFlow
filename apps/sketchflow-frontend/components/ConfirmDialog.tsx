"use client";

import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  subject?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function ConfirmDialog({
  open,
  title,
  description,
  subject,
  confirmLabel = "Cancel",
  cancelLabel = "Keep it",
  destructive = false,
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  const requestClose = useCallback(() => {
    if (!busy) onCancel();
  }, [busy, onCancel]);

  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    return () => restoreFocusRef.current?.focus?.();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;

    const first = panel.querySelector<HTMLElement>("[data-autofocus]") ?? panel;
    first.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        requestClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, requestClose]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-5">
      <div
        className="absolute inset-0 bg-[#17151f]/45 backdrop-blur-[2px]"
        onClick={requestClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        tabIndex={-1}
        className="relative w-full max-w-md rounded-[28px] border border-white bg-white p-7 shadow-[0_32px_90px_-45px_rgba(39,33,66,.45)] outline-none sm:p-8"
      >
        <div className="flex items-start gap-4">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
              destructive ? "bg-rose-50 text-rose-600" : "bg-violet-100 text-violet-700"
            }`}
          >
            <AlertTriangle size={20} />
          </span>

          <div className="min-w-0 flex-1">
            <h2 id="confirm-dialog-title" className="text-base font-semibold tracking-tight text-[#211f2b]">
              {title}
            </h2>
            <p id="confirm-dialog-description" className="mt-1.5 text-sm leading-6 text-[#777481]">
              {description}
              {subject && (
                <>
                  {" "}
                  <span className="font-semibold text-[#4a4654]">“{subject}”</span>.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            data-autofocus
            onClick={requestClose}
            disabled={busy}
            className="h-10 rounded-xl border border-[#e9e6ed] px-4 text-sm font-semibold text-[#5b5764] transition hover:bg-[#f7f6fa] disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`h-10 rounded-xl px-4 text-sm font-semibold text-white transition disabled:cursor-wait disabled:opacity-60 ${
              destructive ? "bg-rose-600 hover:bg-rose-700" : "bg-violet-700 hover:bg-violet-800"
            }`}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
