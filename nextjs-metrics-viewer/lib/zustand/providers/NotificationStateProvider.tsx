"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type NotificationStore,
  createNotificationStore,
} from "@/lib/zustand/stores/notificationStore";

export type NotificationStoreApi = ReturnType<typeof createNotificationStore>;

export const NotificationStoreContext = createContext<
  NotificationStoreApi | undefined
>(undefined);

export interface NotificationStoreProviderProps {
  children: ReactNode;
}

export const NotificationStoreProvider = ({
  children,
}: NotificationStoreProviderProps) => {
  const storeRef = useRef<NotificationStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createNotificationStore();
  }

  return (
    <NotificationStoreContext.Provider value={storeRef.current}>
      {children}
    </NotificationStoreContext.Provider>
  );
};

export const useNotificationStore = <T,>(
  selector: (store: NotificationStore) => T,
): T => {
  const sidebarStoreContext = useContext(NotificationStoreContext);

  if (!sidebarStoreContext) {
    throw new Error(
      `useNotificationStore must be used within NotificationStoreProvider`,
    );
  }

  return useStore(sidebarStoreContext, selector);
};
