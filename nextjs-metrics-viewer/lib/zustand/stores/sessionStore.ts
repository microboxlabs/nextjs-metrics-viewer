import { createStore } from "zustand/vanilla";
import GetSession from "@/app/actions/get-session";
import { Socket } from "socket.io-client";
import io from "socket.io-client";
import { Session } from "next-auth";
export type SessionState = {
  socket: typeof Socket | null;
};

export type SessionActions = {
  setSession: () => Promise<Session | null>;
  connect: (url?: string) => void;
  disconnect: () => void;
  emit: (event: string, data: any) => void;
  on: (event: string, callback: (data: any) => void) => void;
};

export type SessionStore = SessionState & SessionActions;

export const defaultInitState: SessionState = {
  socket: null,
};

export const createSessionStore = (
  initState: SessionState = defaultInitState,
) => {
  return createStore<SessionStore>()((set, get) => ({
    ...initState,
    setSession: async () => {
      const session = await GetSession();
      return session;
    },
    connect: (url: string = "http://localhost:3000") => {
      const socket = io(url);
      set({ socket });
    },
    disconnect: () => {
      const { socket } = get();
      if (socket) {
        socket.disconnect();
        set({ socket: null });
      }
    },
    emit: (event: string, data: any) => {
      const { socket } = get();
      if (socket) {
        socket.emit(event, data);
      }
    },
    on: (event: string, callback: (data: any) => void) => {
      const { socket } = get();
      if (socket) {
        socket.on(event, callback);
      }
    },
  }));
};
