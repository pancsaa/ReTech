import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import Home from "../components/Home";
import { getAllProducts } from "../service/service";

vi.mock("../service/service", () => ({
  getAllProducts: vi.fn(),
}));

const mockedGetAllProducts = vi.mocked(getAllProducts);

describe("Home komponens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("megjeleníti a betöltött terméket", async () => {
    mockedGetAllProducts.mockResolvedValue([
      {
        id: 1,
        title: "iPhone 12",
        description: "Szép állapot",
        condition: "Használt",
        category: "Telefon",
        brand: "Apple",
        model: "12",
        price_recoin: 250,
        image_url: "/uploads/iphone12.jpg",
        seller_id: 1,
        status: "AVAILABLE",
      },
    ]);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(await screen.findByText(/iphone 12/i)).toBeInTheDocument();
  });

  test("nem omlik össze üres lista esetén", async () => {
    mockedGetAllProducts.mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    expect(await screen.findByText(/retech|termék|hirdetés/i)).toBeInTheDocument();
  });
});