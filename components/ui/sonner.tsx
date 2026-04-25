"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      closeButton
      position="bottom-right"
      richColors
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:min-h-16 group-[.toaster]:w-[min(92vw,28rem)] group-[.toaster]:gap-3 group-[.toaster]:rounded-2xl group-[.toaster]:border-border group-[.toaster]:bg-background group-[.toaster]:px-5 group-[.toaster]:py-4 group-[.toaster]:text-base group-[.toaster]:text-foreground group-[.toaster]:shadow-xl group-[.toaster]:shadow-sky-950/15",
          title: "group-[.toast]:text-base group-[.toast]:font-semibold",
          description: "group-[.toast]:text-sm group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
