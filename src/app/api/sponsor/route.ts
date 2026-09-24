import { NextResponse } from "next/server";
import { sseHub } from "@/lib/sse-hub";

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));
    sseHub.broadcast("CHANGE_SPONSOR", payload);
    return NextResponse.json({ success: true, message: "Sponsor broadcasted", payload });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
