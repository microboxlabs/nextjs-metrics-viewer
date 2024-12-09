import { createStore } from "zustand/vanilla";
import { IData } from "@/app/(protected)/dashboard/Component/Dashboard/Dashboard";
import {
  getAllData,
  getTableData,
  updateTableData,
  deleteTableData,
  getCategories,
} from "@/app/actions/data";
import { Prisma } from "@prisma/client";
export type MetricsState = {
  data: IData;
  tableData: { id: number; date: string; category: string; value: number }[];
  categories: (Prisma.PickEnumerable<
    Prisma.MetricsGroupByOutputType,
    "category"[]
  > & {})[];
};

export type MetricsActions = {
  getData: (filter: any) => void;
  getTableData: () => void;
  updateTableData: (data: {
    id: number;
    date: string;
    category: string;
    value: number;
  }) => Promise<
    | { error: string; success: undefined }
    | { error: undefined; success: boolean }
  >;
  deleteTableData: (
    id: number,
  ) => Promise<
    | { error: string; success: undefined }
    | { error: undefined; success: boolean }
  >;
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
  tableData: [],
  categories: [],
};

export const createMetricsStore = (
  initState: MetricsState = defaultInitState,
) => {
  return createStore<MetricsStore>()((set) => ({
    ...initState,
    getData: async (filter: any) => {
      const data = await getAllData(filter);
      if (data) {
        const categories = await getCategories().then((data) => data);
        if (categories) {
          set({ categories });
        }
        set({ data });
      }
    },
    getTableData: async () => {
      const { data } = await getTableData();
      if (data) {
        set({ tableData: data });
      }
    },
    updateTableData: async (data: {
      id: number;
      date: string;
      category: string;
      value: number;
    }) => {
      const { success } = await updateTableData(data);
      if (success) {
        const { data } = await getTableData();
        if (data) {
          set({ tableData: data });
          return { success: true };
        }
        return { error: "Error trying get table data. Please try again" };
      }
      return { error: "Error trying update table data. Please try again" };
    },
    deleteTableData: async (id: number) => {
      const { success } = await deleteTableData(id);
      if (success) {
        const { data } = await getTableData();
        if (data) {
          set({ tableData: data });
          return { success: true };
        }
        return { error: "Error trying get table data. Please try again" };
      }
      return { error: "Error trying delete table item. Please try again" };
    },
  }));
};
