import { NextResponse } from "next/server";
import { sseHub } from "@/lib/sse-hub";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const clientId = Math.random().toString(36).substring(2, 9);
  let clientRef: { id: string; controller: ReadableStreamDefaultController } | null = null;

  const stream = new ReadableStream({
    start(controller) {
      clientRef = { id: clientId, controller };
      sseHub.addClient(clientRef);

      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "CONNECTED", payload: { clientId } })}\n\n`)
      );

      const interval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: heartbeat\n\n`));
        } catch (e) {
          clearInterval(interval);
          if (clientRef) sseHub.removeClient(clientRef);
        }
      }, 15000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        if (clientRef) sseHub.removeClient(clientRef);
      });
    },
    cancel() {
      if (clientRef) sseHub.removeClient(clientRef);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform, no-store",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body && body.type) {
      sseHub.broadcast(body.type, body.payload);
      return NextResponse.json({ success: true, clients: sseHub.getClientCount() });
    }
    return NextResponse.json({ error: "Missing event type" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
