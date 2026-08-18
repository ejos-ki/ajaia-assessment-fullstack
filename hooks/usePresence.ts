"use client";

import { useEffect, useState } from "react";

export interface PresenceViewer {
  userId: string;
  userName: string;
}

const HEARTBEAT_INTERVAL_MS = 5000;

// Sends a heartbeat and polls for other current viewers on a fixed
// interval while mounted. Not real-time (no WebSockets) — simple
// polling, sufficient for a lightweight "who's here" indicator.
export function usePresence(documentId: string, currentUserName: string) {
  const [viewers, setViewers] = useState<PresenceViewer[]>([]);

  useEffect(() => {
    let isActive = true;

    async function sendHeartbeatAndFetchViewers() {
      try {
        await fetch(`/api/documents/${documentId}/presence`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName: currentUserName }),
        });

        const response = await fetch(`/api/documents/${documentId}/presence`);
        if (!response.ok || !isActive) return;

        const data = await response.json();
        setViewers(data.viewers);
      } catch {
        // Presence is a soft feature — silently skip a failed beat
        // rather than surfacing an error toast for something non-critical.
      }
    }

    sendHeartbeatAndFetchViewers();
    const intervalId = setInterval(sendHeartbeatAndFetchViewers, HEARTBEAT_INTERVAL_MS);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [documentId, currentUserName]);

  return viewers;
}