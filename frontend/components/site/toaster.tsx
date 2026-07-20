'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function ToastProvider() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: 'rounded-lg border border-border bg-card text-card-foreground',
        },
      }}
    />
  );
}
