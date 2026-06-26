import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/lib/config";

export function useSocket(branchId?: string, orderId?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Establish client socket connection to Express server
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to Socket.IO backend: " + socket.id);
      
      if (branchId) {
        socket.emit("join-branch", branchId);
      }
      
      if (orderId) {
        socket.emit("join-order", orderId);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [branchId, orderId]);

  return socketRef.current;
}

export default useSocket;
