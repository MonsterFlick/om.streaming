import { NextResponse } from "next/server";
import { sseHub } from "@/lib/sse-hub";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    sseHub.broadcast("NEW_CHAT_MESSAGE", payload);
    return NextResponse.json({ success: true, message: "Chat message received", payload });
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
