"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type SessionStore,
  createSessionStore,
} from "@/lib/zustand/stores/sessionStore";

export type SessionStoreApi = ReturnType<typeof createSessionStore>;

export const SessionStoreContext = createContext<SessionStoreApi | undefined>(
  undefined,
);

export interface SessionStoreProviderProps {
  children: ReactNode;
}

export const SessionStoreProvider = ({
  children,
}: SessionStoreProviderProps) => {
  const storeRef = useRef<SessionStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createSessionStore();
  }

  return (
    <SessionStoreContext.Provider value={storeRef.current}>
      {children}
    </SessionStoreContext.Provider>
  );
};

export const useSessionStore = <T,>(
  selector: (store: SessionStore) => T,
): T => {
  const sidebarStoreContext = useContext(SessionStoreContext);

  if (!sidebarStoreContext) {
    throw new Error(`useSessionStore must be used within SessionStoreProvider`);
  }

  return useStore(sidebarStoreContext, selector);
};
