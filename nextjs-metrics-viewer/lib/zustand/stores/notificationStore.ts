import { createStore } from "zustand/vanilla";

export type NotificationState = {
  isOpen: boolean;
  message: string;
  type: string;
};

export type NotificationActions = {
  showToast: (message: string, type: string) => void;
  hideToast: () => void;
};

export type NotificationStore = NotificationState & NotificationActions;

export const defaultInitState: NotificationState = {
  isOpen: false,
  message: "",
  type: "success",
};

export const createNotificationStore = (
  initState: NotificationState = defaultInitState,
) => {
  return createStore<NotificationStore>()((set) => ({
    ...initState,
    showToast: (message: string, type = "success") =>
      set({ isOpen: true, message, type }),
    hideToast: () => set({ isOpen: false }),
  }));
};
