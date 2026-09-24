"use client";

import { useEffect, useState } from "react";
import { streamBus } from "@/lib/stream-bus";
import { StreamState } from "@/lib/types";
import { EventTicker } from "@/components/overlays/EventTicker";
import { ChatWidget } from "@/components/overlays/ChatWidget";
import { SponsorCard } from "@/components/overlays/SponsorCard";
import { WebcamFrame } from "@/components/overlays/WebcamFrame";

export default function GameOverlayPage() {
  const [state, setState] = useState<StreamState>(streamBus.getState());

  useEffect(() => {
    return streamBus.on("STATE_UPDATED", (newState) => {
      setState(newState as StreamState);
    });
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden pointer-events-none">
      {/* Top Event Ticker */}
      <div className="absolute top-6 inset-x-0 flex justify-center z-20 pointer-events-auto">
        <EventTicker />
      </div>

      {/* Left In-Game Floating Chat */}
      <div className="absolute bottom-36 left-8 w-[360px] h-[400px] z-20 pointer-events-auto flex flex-col justify-end">
        <ChatWidget autoFade maxMessages={8} />
      </div>

      {/* Bottom-Left Sponsor Lower Third */}
      <div className="absolute bottom-8 left-8 z-20 pointer-events-auto">
        <SponsorCard />
      </div>

      {/* Bottom-Right Integrated Webcam Frame (Rendered if integrated mode is selected) */}
      {state.webcamConfig.mode === "integrated" && (
        <div className="absolute bottom-8 right-8 w-[380px] z-20 pointer-events-auto">
          <WebcamFrame />
        </div>
      )}
    </div>
  );
}
