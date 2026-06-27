import React, { createContext, useContext, useMemo, useState } from 'react';

type Toast = { id: number; title: string; message?: string; tone?: 'success' | 'error' | 'info' };

type ToastState = {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => void;
};

const ToastContext = createContext<ToastState | null>(null);
let nextId = 1;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (toast: Omit<Toast, 'id'>) => {
    const id = nextId++;
    setToasts((current) => [...current, { id, ...toast }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3200);
  };

  const value = useMemo(() => ({ toasts, push }), [toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 flex w-[min(90vw,360px)] flex-col gap-3">
        {toasts.map((toast) => (
          <div key={toast.id} className="glass-card rounded-2xl px-4 py-3">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.message ? <p className="mt-1 text-sm text-muted">{toast.message}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
