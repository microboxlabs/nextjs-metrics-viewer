import { createStore } from "zustand/vanilla";
import GetSession from "@/app/actions/get-session";
export type SessionState = {
  session: any | null;
};

export type SessionActions = {
  setSession: () => void;
};

export type SessionStore = SessionState & SessionActions;

export const defaultInitState: SessionState = {
  session: null,
};

export const createSessionStore = (
  initState: SessionState = defaultInitState,
) => {
  return createStore<SessionStore>()((set) => ({
    ...initState,
    setSession: async () => {
      const session = await GetSession();
      if (session) {
        set({ session });
      }
    },
  }));
};
