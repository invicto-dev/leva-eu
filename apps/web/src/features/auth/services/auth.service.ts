import api from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export const authService = {
  /**
   * Performs login and returns token and user data
   */
  async login(credentials: Record<string, unknown>): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },
};
