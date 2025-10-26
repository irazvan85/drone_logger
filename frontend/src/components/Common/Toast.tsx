import React, { useEffect, useState } from "react";

/**
 * Toast type
 */
export type ToastType = "success" | "error" | "warning" | "info";

/**
 * Toast message structure
 */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

/**
 * Context for toast notifications
 */
interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => string;
  removeToast: (id: string) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

/**
 * Toast Provider component
 *
 * Provides toast notification functionality to the app.
 * Wrap your app with this component to enable toast notifications.
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType, duration = 4000): string => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

/**
 * Hook to use toast notifications
 *
 * @example
 * ```tsx
 * const { addToast } = useToast();
 * addToast("Photo uploaded successfully", "success");
 * ```
 */
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

/**
 * Toast Container component (renders all active toasts)
 */
const ToastContainer: React.FC<{
  toasts: Toast[];
  onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

/**
 * Individual Toast Item component
 */
const ToastItem: React.FC<{
  toast: Toast;
  onRemove: () => void;
}> = ({ toast, onRemove }) => {
  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(onRemove, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, onRemove]);

  const typeClasses = {
    success: "toast-success",
    error: "toast-error",
    warning: "toast-warning",
    info: "toast-info",
  };

  return (
    <div className={`toast-item ${typeClasses[toast.type]}`}>
      <div className="toast-content">
        <span className="toast-message">{toast.message}</span>
        <button
          onClick={onRemove}
          className="toast-close"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ToastProvider;
