import { createStore } from "zustand/vanilla";
import { IData } from "@/app/(protected)/dashboard/Component/Dashboard/Dashboard";
import { getAllData } from "@/actions/data";
export type MetricsState = {
  data: IData;
};

export type MetricsActions = {
  getData: (filter: any) => void;
};

export type MetricsStore = MetricsState & MetricsActions;

export const defaultInitState: MetricsState = {
  data: {
    total: 0,
    min: 0,
    max: 0,
    avg: 0,
    data: [],
    dataTable: [],
  },
};

export const createMetricsStore = (
  initState: MetricsState = defaultInitState,
) => {
  return createStore<MetricsStore>()((set) => ({
    ...initState,
    getData: async (filter: any) => {
      const data = await getAllData(filter);
      if (data) {
        set({ data });
      }
    },
  }));
};
