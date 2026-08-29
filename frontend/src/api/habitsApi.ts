import { API_BASE_URL } from "./registerApi";

export type DailySummary = {
	totalHabits: number;
	completedCount: number;
	allCompleted: boolean;
};

export async function getDailySummary(token: string): Promise<DailySummary> {
	const response = await fetch(`${API_BASE_URL}/api/habits/summary`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!response.ok) {
		throw new Error("Unable to load today's habit summary.");
	}

	return response.json();
}
