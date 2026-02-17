import { createContext, useEffect, useState } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

useEffect(() => {
  const newSocket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  newSocket.on("connect", () => {
    console.log("Socket connected:", newSocket.id);
    setSocket(newSocket);
  });

  newSocket.on("disconnect", () => {
    console.log("Socket disconnected");
    setSocket(null);
  });

  return () => {
    newSocket.disconnect();
  };
}, []);


  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
