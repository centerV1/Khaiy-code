"use client";

import { useEffect, useEffectEvent } from "react";

import { getRealtimeSocket } from "@/lib/realtime/socket";

type RealtimeEventName = "categoryUpdate" | "productUpdate";

export function useRealtimeEvents(
  eventNames: RealtimeEventName[],
  onEvent: () => void,
) {
  const handleEvent = useEffectEvent(onEvent);
  const eventNamesKey = eventNames.join("|");

  useEffect(() => {
    const socket = getRealtimeSocket();
    const subscribedEvents = eventNamesKey
      ? (eventNamesKey.split("|") as RealtimeEventName[])
      : [];

    if (!socket || subscribedEvents.length === 0) {
      return;
    }

    const listener = () => {
      handleEvent();
    };

    subscribedEvents.forEach((eventName) => {
      socket.on(eventName, listener);
    });

    return () => {
      subscribedEvents.forEach((eventName) => {
        socket.off(eventName, listener);
      });
    };
  }, [eventNamesKey]);
}
