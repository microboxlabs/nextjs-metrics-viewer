"use client";
import { Toast } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNotificationStore } from "@/lib/zustand/providers/NotificationStateProvider";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

const ToastComponent = () => {
  const { isOpen, message, type, hideToast } = useNotificationStore(
    (store) => store,
  );
  const [color, setColor] = useState<string>("green");
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000); // Oculta el toast automáticamente después de 3 segundos
      return () => clearTimeout(timer);
    }
  }, [isOpen, hideToast]);

  useEffect(() => {
    setColor(
      type === "success" ? "green" : type === "error" ? "red" : "orange",
    );
  }, [color, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 z-50 flex w-full flex-row items-center justify-center">
      <Toast>
        <div
          className={`bg-${color}-100 text-${color}-500 dark:bg-${color}-800 dark:text-${color}-200 inline-flex size-8 shrink-0 items-center justify-center rounded-lg`}
        >
          {type == "success" ? (
            <HiCheck className="size-5" />
          ) : type == "error" ? (
            <HiX className="size-5" />
          ) : (
            <HiExclamation className="size-5" />
          )}
        </div>
        <div className="ml-3 text-sm font-normal">{message}</div>
        <Toast.Toggle />
      </Toast>
    </div>
  );
};

export default ToastComponent;
