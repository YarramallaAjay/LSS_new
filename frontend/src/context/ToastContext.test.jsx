import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, act, fireEvent, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider, useToast } from "./ToastContext.jsx";

function ToastTrigger({ message, type }) {
  const { showToast } = useToast();
  return (
    <button onClick={() => showToast(message, type)}>Show Toast</button>
  );
}

function renderWithProvider(message = "Hello toast", type = "success") {
  return render(
    <ToastProvider>
      <ToastTrigger message={message} type={type} />
    </ToastProvider>
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ToastContext", () => {
  it("renders children without any toasts initially", () => {
    renderWithProvider();
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.queryByText("Hello toast")).not.toBeInTheDocument();
  });

  it("shows a success toast when showToast is called", async () => {
    renderWithProvider("Great job!", "success");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Great job!")).toBeInTheDocument();
  });

  it("shows an error toast with the correct message", async () => {
    renderWithProvider("Something failed", "error");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Something failed")).toBeInTheDocument();
  });

  it("shows a warning toast", async () => {
    renderWithProvider("Please select weight", "warning");
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Please select weight")).toBeInTheDocument();
  });

  it("removes the toast after 3.5 seconds", () => {
    // fireEvent is synchronous and works reliably with fake timers
    vi.useFakeTimers();

    renderWithProvider("Temporary message");

    act(() => {
      fireEvent.click(screen.getByRole("button"));
    });

    expect(screen.getByText("Temporary message")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3600);
    });

    expect(screen.queryByText("Temporary message")).not.toBeInTheDocument();

    vi.useRealTimers();
  });

  it("throws when useToast is used outside a ToastProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useToast())).toThrow(
      "useToast must be used within a ToastProvider"
    );
  });
});
