import { NextResponse } from "next/server";
import { sseHub } from "@/lib/sse-hub";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    sseHub.broadcast("TRIGGER_ALERT", payload);
    return NextResponse.json({ success: true, message: "Alert triggered", payload });
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
