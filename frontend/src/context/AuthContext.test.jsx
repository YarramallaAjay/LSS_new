import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "./AuthContext.jsx";
import { STORAGE_KEYS } from "../lib/constants.js";

// Mock the admin API module
vi.mock("../api/admin", () => ({
  adminLogin: vi.fn(),
}));

import * as adminApi from "../api/admin";

function AuthConsumer() {
  const { isAuthenticated, username, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="auth-status">{isAuthenticated ? "authenticated" : "guest"}</p>
      <p data-testid="username">{username || "none"}</p>
      <button onClick={() => login("admin", "pass")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function renderAuth() {
  return render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("AuthContext", () => {
  it("is not authenticated when localStorage is empty", () => {
    renderAuth();
    expect(screen.getByTestId("auth-status")).toHaveTextContent("guest");
  });

  it("is authenticated when token is already in localStorage", () => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, "existing-token");
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERNAME, "admin");
    renderAuth();
    expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated");
    expect(screen.getByTestId("username")).toHaveTextContent("admin");
  });

  it("stores token and username in localStorage after login", async () => {
    adminApi.adminLogin.mockResolvedValue({ token: "tok123", username: "admin" });
    renderAuth();

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /login/i }));
    });

    expect(localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)).toBe("tok123");
    expect(localStorage.getItem(STORAGE_KEYS.ADMIN_USERNAME)).toBe("admin");
    expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated");
  });

  it("clears localStorage and state on logout", async () => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, "tok123");
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERNAME, "admin");
    renderAuth();

    await userEvent.click(screen.getByRole("button", { name: /logout/i }));

    expect(localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.ADMIN_USERNAME)).toBeNull();
    expect(screen.getByTestId("auth-status")).toHaveTextContent("guest");
  });

  it("throws when useAuth is used outside AuthProvider", () => {
    function BadConsumer() {
      useAuth();
      return null;
    }
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<BadConsumer />)).toThrow(
      "useAuth must be used within an AuthProvider"
    );
  });
});
