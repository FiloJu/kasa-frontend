import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("apiFetch", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_API_URL", "http://localhost:3001");
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("accepts successful responses without a body", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    );
    const { apiFetch } = await import("./api");

    await expect(
      apiFetch<void>("/api/properties/1/favorite", { method: "POST" })
    ).resolves.toBeUndefined();
  });

  it("parses JSON responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true }), { status: 200 })
      )
    );
    const { apiFetch } = await import("./api");

    await expect(apiFetch<{ success: boolean }>("/api/properties")).resolves.toEqual({
      success: true,
    });
  });
});
