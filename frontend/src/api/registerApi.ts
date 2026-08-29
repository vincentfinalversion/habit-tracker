export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://localhost:5235";

type ErrorResponse = {
  message?: string;
};

export async function register(username: string, email: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorBody: ErrorResponse | null = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Something went wrong. Please try again.");
  }
}

export async function verifyEmail(email: string, otpCode: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otpCode }),
  });

  if (!response.ok) {
    const errorBody: ErrorResponse | null = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? "Something went wrong. Please try again.");
  }
}