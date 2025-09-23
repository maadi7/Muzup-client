"use client";

import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "";

let socketInstance: Socket | null = null;

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  // Get or initialize socket
  const getSocket = useCallback((): Socket => {
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        autoConnect: false,
      });
    }
    return socketInstance;
  }, []);

  // Connect
  const connect = useCallback(
    (id: string) => {
      const socket = getSocket();
      if (!socket.connected) {
        socket.connect();
        socket.emit("register", id);
      }
    },
    [getSocket]
  );

  // Disconnect
  const disconnect = useCallback(() => {
    if (socketInstance) {
      socketInstance.disconnect();
      socketInstance = null;
    }
  }, []);

  // Listen to events
  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      const socket = getSocket();
      socket.on(event, callback);
      return () => socket.off(event, callback); // cleanup
    },
    [getSocket]
  );

  // Emit events
  const emit = useCallback(
    (event: string, ...args: any[]) => {
      const socket = getSocket();
      socket.emit(event, ...args);
    },
    [getSocket]
  );

  // Track connection status
  useEffect(() => {
    const socket = getSocket();

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on("connect", handleConnect);

    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [getSocket]);

  return { socket: getSocket(), connect, disconnect, on, emit, isConnected };
};

export default useSocket;
