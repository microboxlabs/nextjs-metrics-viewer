import { Server } from "socket.io";

let io: any;

export const initializeSocket = (server: any) => {
  if (!io) {
    io = new Server(server, {
      path: "/api/socket",
      cors: {
        origin: "*", // Configura según tus necesidades
      },
    });

    io.on("connection", (socket: any) => {
      console.log(`Cliente conectado: ${socket.id}`);

      socket.on("message", (msg: any) => {
        console.log("Mensaje recibido:", msg);
        socket.broadcast.emit("message", msg);
      });

      socket.on("ping", (msg: string) => {
        console.log("msg:", msg);
      });
      socket.on("disconnect", () => {
        console.log(`Cliente desconectado: ${socket.id}`);
      });
    });

    console.log("Socket.IO inicializado");
  }
};
