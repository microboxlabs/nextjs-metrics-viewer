import { createStore } from "zustand/vanilla";

export type SidebarState = {
  open: boolean;
};

export type SidebarActions = {
  setOpen: (value: boolean) => void;
};

export type SidebarStore = SidebarState & SidebarActions;

export const defaultInitState: SidebarState = {
  open: false,
};

export const createSidebarStore = (
  initState: SidebarState = defaultInitState,
) => {
  return createStore<SidebarStore>()((set) => ({
    ...initState,
    setOpen: (value: boolean) => set(() => ({ open: value })),
  }));
};
