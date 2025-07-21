import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";

// Singleton state

type ConfirmationPopupOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};
let showDialog: ((options: ConfirmationPopupOptions) => Promise<boolean>) | null = null;

export function confirmPopup(options: ConfirmationPopupOptions) {
  if (!showDialog) throw new Error("ConfirmationPopup is not mounted");
  return showDialog(options);
}

export function ConfirmationPopupContainer() {
  const [state, setState] = useState<ConfirmationPopupOptions & { open: boolean; resolve?: (result: boolean) => void }>({ open: false });
  const resolveRef = useRef<((result: boolean) => void) | null>(null);

  useEffect(() => {
    showDialog = (options) => {
      return new Promise<boolean>((resolve) => {
        setState({ ...options, open: true, resolve });
        resolveRef.current = resolve;
      });
    };
    return () => {
      showDialog = null;
    };
  }, []);

  const handleClose = async (result: boolean) => {
    if (result && state.onConfirm) {
      await state.onConfirm();
    } else if (!result && state.onCancel) {
      await state.onCancel();
    }
    resolveRef.current?.(result);
    setState((s) => ({ ...s, open: false, resolve: undefined }));
  };

  return (
    <Dialog open={state.open} onOpenChange={(open) => !open && handleClose(false)}>
      <DialogPrimitive.Overlay className="fixed inset-0 z-[50] bg-white/60 dark:bg-black/60 backdrop-blur-sm" />
      <DialogContent className="z-[1000]">
        <DialogHeader>
          <DialogTitle>{state.title || "Are you sure?"}</DialogTitle>
          {state.description && <DialogDescription>{state.description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            {state.cancelText || "Cancel"}
          </Button>
          <Button onClick={() => handleClose(true)}>
            {state.confirmText || "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Mount the singleton dialog at the end of body
export function mountConfirmationPopup() {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const root = createRoot(div);
  root.render(<ConfirmationPopupContainer />);
}

// Usage:
// 1. Call mountConfirmationPopup() once in your app entry (e.g. main.tsx)
// 2. Use confirmPopup({ title, description }) anywhere, returns a promise
