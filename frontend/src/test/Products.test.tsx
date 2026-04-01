import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import Products from "../components/Products";
import { AuthContext } from "../components/AuthContext";
import { getAllProducts, buyProduct } from "../service/service";
import type { ReactNode } from "react";
import type { User } from "../types/types";

vi.mock("../service/service", () => ({
  getAllProducts: vi.fn(),
  buyProduct: vi.fn(),
}));

const mockedGetAllProducts = vi.mocked(getAllProducts);
const mockedBuyProduct = vi.mocked(buyProduct);

const refreshUserMock = vi.fn();

const defaultUser: User = {
  userid: 99,
  username: "tesztuser",
  email: "teszt@example.com",
  role: "USER",
  recoin_balance: 1000,
  profile_image: null,
};

function renderWithAuth(
  ui: ReactNode,
  {
    token = "fake-token",
    user = defaultUser,
    isAuthenticated = true,
    isAuthReady = true,
  }: {
    token?: string | null;
    user?: User | null;
    isAuthenticated?: boolean;
    isAuthReady?: boolean;
  } = {}
) {
  return render(
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isAuthReady,
        login: vi.fn(async () => {}),
        logout: vi.fn(),
        refreshUser: refreshUserMock,
      }}
    >
      {ui}
    </AuthContext.Provider>
  );
}

describe("Products komponens", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    refreshUserMock.mockReset();
    vi.stubGlobal("alert", vi.fn());
  });

  test("megjeleníti a betöltött terméket", async () => {
    mockedGetAllProducts.mockResolvedValue([
      {
        id: 1,
        title: "iPhone 12",
        description: "Szép állapotú telefon",
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

    renderWithAuth(<Products />);

    expect(await screen.findByText(/iphone 12/i)).toBeInTheDocument();
    expect(screen.getByText(/250 recoin/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /megveszem/i })).toBeInTheDocument();
  });

  test("üres lista esetén megjelenik a nincs termék üzenet", async () => {
    mockedGetAllProducts.mockResolvedValue([]);

    renderWithAuth(<Products />);

    expect(
      await screen.findByText(/jelenleg nincs elérhető termék/i)
    ).toBeInTheDocument();
  });

  test("a Megveszem gomb megnyitja a szállítási cím modalt", async () => {
    const user = userEvent.setup();

    mockedGetAllProducts.mockResolvedValue([
      {
        id: 2,
        title: "Samsung",
        description: "Eladó telefon",
        condition: "Használt",
        category: "Telefon",
        brand: "Samsung",
        model: "S21",
        price_recoin: 300,
        image_url: "/uploads/s21.jpg",
        seller_id: 1,
        status: "AVAILABLE",
      },
    ]);

    renderWithAuth(<Products />);

    await user.click(await screen.findByRole("button", { name: /megveszem/i }));

    expect(screen.getByText(/szállítási cím megadása/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /véglegesítés/i })).toBeInTheDocument();
  });

  test("sikeres vásárláskor meghívja a buyProduct függvényt", async () => {
    const user = userEvent.setup();

    mockedGetAllProducts.mockResolvedValue([
      {
        id: 3,
        title: "Monitor",
        description: "Full HD monitor",
        condition: "Használt",
        category: "Monitor",
        brand: "LG",
        model: "24MP",
        price_recoin: 150,
        image_url: "/uploads/monitor.jpg",
        seller_id: 1,
        status: "AVAILABLE",
      },
    ]);

    mockedBuyProduct.mockResolvedValue({});

    renderWithAuth(<Products />);

    await user.click(await screen.findByRole("button", { name: /megveszem/i }));

    await user.type(
      screen.getByPlaceholderText(/pl\.: 1234 budapest/i),
      "1234 Budapest, Példa utca 12."
    );

    await user.click(screen.getByRole("button", { name: /véglegesítés/i }));

    await waitFor(() => {
      expect(mockedBuyProduct).toHaveBeenCalledWith(
        {
          product_id: 3,
          shipping_address: "1234 Budapest, Példa utca 12.",
        },
        "fake-token"
      );
    });
  });
});