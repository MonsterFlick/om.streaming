import { NextResponse } from "next/server";
import { sseHub } from "@/lib/sse-hub";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, scene, payload } = body;
    sseHub.broadcast("DECK_ACTION", body);

    return NextResponse.json({
      success: true,
      actionExecuted: action,
      scene,
      payload,
      timestamp: Date.now(),
    });
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
