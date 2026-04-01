import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AuthProvider, useAuth } from "../components/AuthContext";
import { getMe } from "../service/service";

vi.mock("../service/service", () => ({
  getMe: vi.fn(),
}));

const mockedGetMe = vi.mocked(getMe);

function TestComponent() {
  const { user, token, isAuthenticated, isAuthReady, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="token">{token ?? "no-token"}</div>
      <div data-testid="auth">{isAuthenticated ? "igen" : "nem"}</div>
      <div data-testid="ready">{isAuthReady ? "ready" : "loading"}</div>
      <div data-testid="username">{user?.username ?? "nincs-user"}</div>

      <button onClick={() => login("fake-token")}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test("kezdetben nincs bejelentkezett user", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("ready")).toHaveTextContent("ready");
    });

    expect(screen.getByTestId("auth")).toHaveTextContent("nem");
    expect(screen.getByTestId("username")).toHaveTextContent("nincs-user");
    expect(screen.getByTestId("token")).toHaveTextContent("no-token");
  });

  test("login után betölti a felhasználót", async () => {
    const user = userEvent.setup();

    mockedGetMe.mockResolvedValue({
      id: 1,
      username: "dorina",
      email: "dorina@email.com",
      profile_image: null,
      role: "USER",
      recoin_balance: 250,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByTestId("auth")).toHaveTextContent("igen");
    });

    expect(screen.getByTestId("username")).toHaveTextContent("dorina");
    expect(screen.getByTestId("token")).toHaveTextContent("fake-token");
    expect(localStorage.getItem("accessToken")).toBe("fake-token");
    expect(mockedGetMe).toHaveBeenCalledWith("fake-token");
  });

  test("logout után törli a usert és a tokent", async () => {
    const user = userEvent.setup();

    mockedGetMe.mockResolvedValue({
      id: 1,
      username: "dorina",
      email: "dorina@email.com",
      profile_image: null,
      role: "USER",
      recoin_balance: 250,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByTestId("auth")).toHaveTextContent("igen");
    });

    await user.click(screen.getByRole("button", { name: /logout/i }));

    expect(screen.getByTestId("auth")).toHaveTextContent("nem");
    expect(screen.getByTestId("username")).toHaveTextContent("nincs-user");
    expect(screen.getByTestId("token")).toHaveTextContent("no-token");
    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});