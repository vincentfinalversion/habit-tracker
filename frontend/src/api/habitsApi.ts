const API_BASE_URL = import.meta.env.VITE_API_URL ?? "https://localhost:5235";

export type HabitDayStatus = {
  date: string;
  completed: boolean;
  isFuture: boolean;
};

export type Habit = {
  id: number;
  name: string;
  createdAt: string;
  streak: number;
  days: HabitDayStatus[];
};

export type DailySummary = {
	totalHabits: number;
	completedCount: number;
	allCompleted: boolean;
};

async function request<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.message ?? "Unable to complete the habit request.");
  }
  return response.status === 204 ? undefined as T : response.json();
}

export function getHabits(token: string): Promise<Habit[]> {
  return request<Habit[]>("/api/habits", token);
}

export function createHabit(token: string, name: string): Promise<Habit> {
  return request<Habit>("/api/habits", token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
}

export function getHabitWeek(token: string, habitId: number, startDate: string): Promise<Habit> {
  return request<Habit>(`/api/habits/${habitId}/week?startDate=${encodeURIComponent(startDate)}`, token);
}

export function toggleHabitCompletion(token: string, habitId: number, date: string): Promise<Habit> {
  return request<Habit>(`/api/habits/${habitId}/toggle`, token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date }),
  });
}

export function deleteHabitRequest(token: string, habitId: number): Promise<void> {
  return request<void>(`/api/habits/${habitId}`, token, { method: "DELETE" });
}

export function getDailySummary(token: string): Promise<DailySummary> {
  return request<DailySummary>("/api/habits/summary", token);
}
