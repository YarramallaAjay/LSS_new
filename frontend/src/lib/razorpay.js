let scriptLoading = false;
let scriptLoaded = false;
const callbacks = [];

/**
 * Dynamically loads the Razorpay checkout SDK on demand.
 * Safe to call multiple times — the script is only injected once.
 */
export function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    callbacks.push({ resolve, reject });

    if (scriptLoading || scriptLoaded) return;
    scriptLoading = true;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      callbacks.forEach((cb) => cb.resolve());
      callbacks.length = 0;
    };

    script.onerror = () => {
      scriptLoading = false;
      const err = new Error("Payment SDK failed to load. Check your connection and try again.");
      callbacks.forEach((cb) => cb.reject(err));
      callbacks.length = 0;
    };

    document.head.appendChild(script);
  });
}
