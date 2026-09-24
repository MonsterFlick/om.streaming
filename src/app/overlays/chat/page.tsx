"use client";

import { ChatWidget } from "@/components/overlays/ChatWidget";

export default function StandaloneChatPage() {
  return (
    <div className="w-full h-full bg-transparent p-4 overflow-hidden flex flex-col justify-end">
      <ChatWidget maxMessages={25} />
    </div>
  );
}
