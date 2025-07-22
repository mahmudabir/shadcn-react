import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

// Singleton state

type ConfirmationPopupOptions = {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};
let showDialog: ((options: ConfirmationPopupOptions) => void);

export function confirmPopup(options: ConfirmationPopupOptions) {
  if (!showDialog) throw new Error("ConfirmationPopup is not mounted");
  return showDialog(options);
}

export function ConfirmationPopupContainer() {
  const [state, setState] = useState<ConfirmationPopupOptions & { open: boolean }>({ open: false });

  useEffect(() => {
    showDialog = (options) => {
      setState({ ...options, open: true });
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
    setState((s) => ({ ...s, open: false }));
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