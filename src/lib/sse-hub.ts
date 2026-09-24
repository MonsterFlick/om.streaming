type SSEClient = {
  id: string;
  controller: ReadableStreamDefaultController;
};

class SSEHub {
  private clients: Set<SSEClient> = new Set();

  public addClient(client: SSEClient) {
    this.clients.add(client);
  }

  public removeClient(client: SSEClient) {
    this.clients.delete(client);
  }

  public broadcast(type: string, payload: unknown = {}) {
    const data = `data: ${JSON.stringify({ type, payload, timestamp: Date.now() })}\n\n`;
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);

    this.clients.forEach((client) => {
      try {
        client.controller.enqueue(encoded);
      } catch (err) {
        this.clients.delete(client);
      }
    });
  }

  public getClientCount(): number {
    return this.clients.size;
  }
}

// Global singleton across API routes in Next.js dev/prod
const globalForSSE = globalThis as unknown as { sseHub: SSEHub };
export const sseHub = globalForSSE.sseHub || new SSEHub();
if (process.env.NODE_ENV !== "production") globalForSSE.sseHub = sseHub;
