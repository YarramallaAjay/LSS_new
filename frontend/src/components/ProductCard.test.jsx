import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard.jsx";

// --- mocks ---
const mockAddItem = vi.fn();
const mockShowToast = vi.fn();

vi.mock("../context/CartContext.jsx", () => ({
  useCart: () => ({ addItem: mockAddItem }),
}));

vi.mock("../context/ToastContext.jsx", () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));

// --- helpers ---
const singlePriceProduct = {
  id: 1,
  name: "Kaju Katli",
  imageUrl: "/images/kaju.jpg",
  prices: [{ id: 101, label: "500g", price: 350 }],
};

const multiPriceProduct = {
  id: 2,
  name: "Mysore Pak",
  imageUrl: "/images/mysore.jpg",
  prices: [
    { id: 201, label: "250g", price: 150 },
    { id: 202, label: "500g", price: 280 },
  ],
};

const noPriceProduct = {
  id: 3,
  name: "Mystery Sweet",
  imageUrl: "/images/mystery.jpg",
  prices: [],
};

function renderCard(product) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ProductCard", () => {
  it("renders the product name", () => {
    renderCard(singlePriceProduct);
    expect(screen.getByText("Kaju Katli")).toBeInTheDocument();
  });

  it("renders the product image with alt text", () => {
    renderCard(singlePriceProduct);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Kaju Katli");
    expect(img).toHaveAttribute("src", "/images/kaju.jpg");
  });

  it("renders all weight/price buttons", () => {
    renderCard(multiPriceProduct);
    expect(screen.getByText(/250g/)).toBeInTheDocument();
    expect(screen.getByText(/500g/)).toBeInTheDocument();
  });

  it("first price is selected by default", () => {
    renderCard(multiPriceProduct);
    // The first weight button should have the active (green) class
    const buttons = screen.getAllByRole("button");
    // First weight button is index 0 (submit button is last)
    expect(buttons[0].className).toContain("bg-green-500");
  });

  it("clicking a weight button selects it", async () => {
    renderCard(multiPriceProduct);
    const weightButtons = screen
      .getAllByRole("button")
      .filter((b) => b.type !== "submit");

    // Click the second weight button
    await userEvent.click(weightButtons[1]);

    // Second button should now be active
    expect(weightButtons[1].className).toContain("bg-green-500");
    // First should no longer be active
    expect(weightButtons[0].className).not.toContain("bg-green-500");
  });

  it("calls addItem with correct productId and priceId on submit", async () => {
    mockAddItem.mockResolvedValue(undefined);
    renderCard(singlePriceProduct);

    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(mockAddItem).toHaveBeenCalledWith(1, 101, 1);
  });

  it("shows warning toast when no price is selected", async () => {
    renderCard(noPriceProduct);
    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.stringContaining("select"),
      "warning"
    );
    expect(mockAddItem).not.toHaveBeenCalled();
  });

  it("shows error toast when addItem throws", async () => {
    mockAddItem.mockRejectedValue(new Error("Network error"));
    renderCard(singlePriceProduct);

    await userEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith(
        expect.stringContaining("Failed"),
        "error"
      );
    });
  });

  it("disables the Add button while adding", async () => {
    // addItem never resolves — keep the button in disabled state
    mockAddItem.mockReturnValue(new Promise(() => {}));
    renderCard(singlePriceProduct);

    const button = screen.getByRole("button", { name: /add to cart/i });
    await userEvent.click(button);

    expect(button).toBeDisabled();
  });
});
