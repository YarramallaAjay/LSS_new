import { describe, it, expect, vi, beforeEach } from "vitest";

// We test the module's behaviour by resetting modules between tests so the
// module-level state (scriptLoading / scriptLoaded) is fresh each time.
describe("loadRazorpay", () => {
  beforeEach(() => {
    // Remove any previous window.Razorpay
    delete window.Razorpay;

    // Remove any injected scripts
    document.querySelectorAll('script[src*="razorpay"]').forEach((s) => s.remove());

    // Reset the module so the internal flags reset between tests
    vi.resetModules();
  });

  it("resolves immediately if window.Razorpay already exists", async () => {
    window.Razorpay = vi.fn();
    const { loadRazorpay } = await import("./razorpay.js");

    await expect(loadRazorpay()).resolves.toBeUndefined();
  });

  it("injects a <script> tag with the correct src when Razorpay is absent", async () => {
    const { loadRazorpay } = await import("./razorpay.js");

    const promise = loadRazorpay();

    const script = document.querySelector('script[src*="razorpay"]');
    expect(script).not.toBeNull();
    expect(script.src).toContain("checkout.razorpay.com");

    // Simulate successful load
    window.Razorpay = vi.fn();
    script.dispatchEvent(new Event("load"));

    await expect(promise).resolves.toBeUndefined();
  });

  it("rejects with a descriptive error when the script fails to load", async () => {
    const { loadRazorpay } = await import("./razorpay.js");

    const promise = loadRazorpay();

    const script = document.querySelector('script[src*="razorpay"]');
    script.dispatchEvent(new Event("error"));

    await expect(promise).rejects.toThrow("Payment SDK failed to load");
  });

  it("does not inject duplicate scripts on concurrent calls", async () => {
    const { loadRazorpay } = await import("./razorpay.js");

    const p1 = loadRazorpay();
    const p2 = loadRazorpay();

    const scripts = document.querySelectorAll('script[src*="razorpay"]');
    expect(scripts).toHaveLength(1);

    const script = scripts[0];
    window.Razorpay = vi.fn();
    script.dispatchEvent(new Event("load"));

    await expect(Promise.all([p1, p2])).resolves.toBeDefined();
  });
});
