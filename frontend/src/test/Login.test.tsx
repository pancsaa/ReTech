import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi } from "vitest";
import Login from "../components/Login";
import { renderWithRouter } from "./test-utils";

vi.mock("@/service/service", () => ({
  loginUser: vi.fn(),
}));

describe("Login komponens", () => {
  test("megjelenik az email mező, jelszó mező és a bejelentkezés gomb", () => {
    renderWithRouter(<Login />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/jelszó/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /bejelentkez/i })
    ).toBeInTheDocument();
  });

  test("a felhasználó tud írni az input mezőkbe", async () => {
    const user = userEvent.setup();
    renderWithRouter(<Login />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/jelszó/i);

    await user.type(emailInput, "teszt@email.com");
    await user.type(passwordInput, "titok123");

    expect(emailInput).toHaveValue("teszt@email.com");
    expect(passwordInput).toHaveValue("titok123");
  });
});