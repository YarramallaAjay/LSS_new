import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PaymentFailed from "./PaymentFailed.jsx";

function renderPaymentFailed() {
  return render(
    <MemoryRouter>
      <PaymentFailed />
    </MemoryRouter>
  );
}

describe("PaymentFailed page", () => {
  it("renders the Payment Failed heading", () => {
    renderPaymentFailed();
    expect(screen.getByRole("heading", { name: /payment failed/i })).toBeInTheDocument();
  });

  it("renders descriptive error message", () => {
    renderPaymentFailed();
    expect(screen.getByText(/something went wrong while processing/i)).toBeInTheDocument();
  });

  it("has a link back to the cart", () => {
    renderPaymentFailed();
    const cartLink = screen.getByRole("link", { name: /back to cart/i });
    expect(cartLink).toHaveAttribute("href", "/cart");
  });

  it("has a link to continue shopping", () => {
    renderPaymentFailed();
    const shopLink = screen.getByRole("link", { name: /continue shopping/i });
    expect(shopLink).toHaveAttribute("href", "/");
  });
});
