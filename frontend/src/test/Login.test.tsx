import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import Login from "../components/Login";
import { AuthProvider } from "../components/AuthContext";

vi.mock("../service/service", () => ({
  getMe: vi.fn(),
}));

describe("Login komponens", () => {
  test("megjelenik az email mező, jelszó mező és a bejelentkezés gomb", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/email cím/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/jelszó/i)).toBeInTheDocument();

    const form = document.querySelector("form");
    expect(form).not.toBeNull();

    const submitButton = within(form as HTMLFormElement).getByRole("button", {
      name: /bejelentkezés/i,
    });

    expect(submitButton).toBeInTheDocument();
  });

  test("a felhasználó tud írni az input mezőkbe", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email cím/i);
    const passwordInput = screen.getByPlaceholderText(/jelszó/i);

    await user.type(emailInput, "teszt@email.com");
    await user.type(passwordInput, "123456");

    expect(emailInput).toHaveValue("teszt@email.com");
    expect(passwordInput).toHaveValue("123456");
  });
});