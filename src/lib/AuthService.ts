import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface LoginResponse {
  id: number;
  username: string;
  role: "ADMIN" | "ESTOQUE";
}

interface UserCredentials {
  username: string;
  password: string;
}

const TOKEN_COOKIE_NAME = "user_auth";

export const AuthService = {
  async login(credentials: UserCredentials): Promise<LoginResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao fazer login.");
      }

      const userData: LoginResponse = await response.json();

      Cookies.set(TOKEN_COOKIE_NAME, JSON.stringify(userData), { expires: 1 });

      return userData;
    } catch (error) {
      console.error("Erro de login:", error);
      throw error;
    }
  },

  logout(): void {
    Cookies.remove(TOKEN_COOKIE_NAME);
  },

  getCurrentUser(): LoginResponse | null {
    const userCookie = Cookies.get(TOKEN_COOKIE_NAME);
    if (userCookie) {
      try {
        return JSON.parse(userCookie) as LoginResponse;
      } catch (e) {
        console.error("Erro ao parsear cookie de usuário:", e);
        Cookies.remove(TOKEN_COOKIE_NAME);
        return null;
      }
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!AuthService.getCurrentUser();
  },

  isAdmin(): boolean {
    const user = AuthService.getCurrentUser();
    return user?.role === "ADMIN";
  },

  isEstoque(): boolean {
    const user = AuthService.getCurrentUser();
    return user?.role === "ESTOQUE";
  },
};
