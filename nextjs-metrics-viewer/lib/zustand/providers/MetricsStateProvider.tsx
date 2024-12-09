"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";
import {
  type MetricsStore,
  createMetricsStore,
} from "@/lib/zustand/stores/metricsDataStore";

export type MetricsStoreApi = ReturnType<typeof createMetricsStore>;

export const MetricsStoreContext = createContext<MetricsStoreApi | undefined>(
  undefined,
);

export interface MetricsStoreProviderProps {
  children: ReactNode;
}

export const MetricsStoreProvider = ({
  children,
}: MetricsStoreProviderProps) => {
  const storeRef = useRef<MetricsStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createMetricsStore();
  }

  return (
    <MetricsStoreContext.Provider value={storeRef.current}>
      {children}
    </MetricsStoreContext.Provider>
  );
};

export const useMetricsStore = <T,>(
  selector: (store: MetricsStore) => T,
): T => {
  const metricsStoreContext = useContext(MetricsStoreContext);

  if (!metricsStoreContext) {
    throw new Error(`useMetricsStore must be used within MetricsStoreProvider`);
  }

  return useStore(metricsStoreContext, selector);
};
