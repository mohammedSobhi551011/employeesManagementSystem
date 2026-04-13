import { useEffect, useState } from "react";

type TToastType = "success" | "error" | "info" | "warning";

interface IToastProps {
  message: string;
  type?: TToastType;
  duration?: number;
  onClose?: () => void;
}

export const Toast = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: IToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in`}
    >
      {message}
    </div>
  );
};

interface IToast {
  id: number;
  message: string;
  type: TToastType;
  duration: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const addToast = (
    message: string,
    type: TToastType = "info",
    duration: number = 3000,
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};
