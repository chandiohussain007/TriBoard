import io from "socket.io-client";

export const socket = io((import.meta as any).env?.VITE_APP_URL || "/", {
  autoConnect: false,
});
