import { describe, it, expect } from "vitest";
import { STORAGE_KEYS } from "./constants.js";

describe("STORAGE_KEYS", () => {
  it("has ADMIN_TOKEN key", () => {
    expect(STORAGE_KEYS.ADMIN_TOKEN).toBe("adminToken");
  });

  it("has ADMIN_USERNAME key", () => {
    expect(STORAGE_KEYS.ADMIN_USERNAME).toBe("adminUsername");
  });

  it("exports exactly two keys", () => {
    expect(Object.keys(STORAGE_KEYS)).toHaveLength(2);
  });

  it("key values are non-empty strings", () => {
    Object.values(STORAGE_KEYS).forEach((v) => {
      expect(typeof v).toBe("string");
      expect(v.length).toBeGreaterThan(0);
    });
  });
});
