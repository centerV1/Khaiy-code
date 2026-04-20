"use client";

import { io, type Socket } from "socket.io-client";

import { getApiBaseUrl } from "@/lib/api/fetcher";

let realtimeSocket: Socket | null = null;

export function getRealtimeSocket() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!realtimeSocket) {
    realtimeSocket = io(getApiBaseUrl(), {
      autoConnect: true,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
  }

  if (!realtimeSocket.connected) {
    realtimeSocket.connect();
  }

  return realtimeSocket;
}
