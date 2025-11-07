import React from "react";
import { useToast } from "../hooks/use-toast";
import { ToastItem } from "./ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((t) => (
        <ToastItem
          key={t.id}
          title={t.title}
          description={t.description}
          variant={t.variant === "destructive" ? "destructive" : t.variant === "success" ? "success" : "default"}
        />
      ))}
    </div>
  );
}
