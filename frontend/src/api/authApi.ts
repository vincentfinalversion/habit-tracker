const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://localhost:5235";

export type AuthResponse = {
  token: string;
  username: string;
  email: string;
  expiresAt: string;
};

type ErrorResponse = {
  message?: string;
};

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorBody: ErrorResponse | null = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Something went wrong. Please try again.");
  }

  return response.json();
}

export async function loginWithGoogle(idToken: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
 
  if (!response.ok) {
    const errorBody: ErrorResponse | null = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Something went wrong. Please try again.");
  }
 
  return response.json();
}