import { assertEquals } from "@std/assert";
import { describe, it, beforeEach, afterEach } from "@std/testing/bdd";
import { corsHeaders } from "../_shared/cors.ts";
import { handler } from "../chat-api/index.ts";

describe("Chat API", () => {
  const originalEnv = Deno.env.toObject();

  beforeEach(() => {
    // Mock environment variables
    Deno.env.set("OPENAI_API_KEY", "test-key");
    Deno.env.set("SITE_URL", "http://localhost:3000");
  });

  afterEach(() => {
    // Restore original environment
    for (const key in Deno.env.toObject()) {
      Deno.env.delete(key);
    }
    for (const [key, value] of Object.entries(originalEnv)) {
      Deno.env.set(key, value);
    }
  });

  it("should handle CORS preflight requests", async () => {
    const req = new Request("http://localhost:8000/chat-api", {
      method: "OPTIONS",
    });

    const response = await handler(req);
    assertEquals(response.status, 200);
    assertEquals(response.headers.get("Access-Control-Allow-Origin"), corsHeaders["Access-Control-Allow-Origin"]);
  });

  it("should validate request method", async () => {
    const req = new Request("http://localhost:8000/chat-api", {
      method: "GET",
    });

    const response = await handler(req);
    assertEquals(response.status, 405);
  });

  it("should validate content type", async () => {
    const req = new Request("http://localhost:8000/chat-api", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
    });

    const response = await handler(req);
    assertEquals(response.status, 400);
  });

  it("should validate request body", async () => {
    const req = new Request("http://localhost:8000/chat-api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const response = await handler(req);
    assertEquals(response.status, 400);
  });

  it("should handle missing API key", async () => {
    Deno.env.delete("OPENAI_API_KEY");
    
    const req = new Request("http://localhost:8000/chat-api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hello" }],
      }),
    });

    const response = await handler(req);
    assertEquals(response.status, 500);
    const body = await response.json();
    assertEquals(body.error, "Internal server error");
  });
}); 