import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createHabit as createHabitRequest, deleteHabitRequest, getHabits, toggleHabitCompletion, type Habit } from "../api/habitsApi";

type Context = {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
	deleteHabit: (id: number) => Promise<void>;
	toggleHabit: (id: number, date: string) => Promise<Habit>;
	createHabit: (name: string) => Promise<Habit>;
}

type HabitProviderProps = {
  children: ReactNode
}

export const HabitContext = createContext<null | Context>(null) 

export type { Habit } from "../api/habitsApi";

function HabitProvider({children}: HabitProviderProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setIsLoading(false);
      return;
    }

    void getHabits(token)
      .then(setHabits)
      .catch(() => setError("Unable to load habits."))
      .finally(() => setIsLoading(false));
  }, []);

  async function deleteHabit(id: number) {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("You are not authenticated.");
    await deleteHabitRequest(token, id);
    setHabits(current => current.filter(habit => habit.id !== id));
  }

  async function toggleHabit(id: number, date: string) {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("You are not authenticated.");
    return toggleHabitCompletion(token, id, date);
  }

  async function createHabit(name: string) {
    const trimmedName = name.trim();

    const isDuplicate = habits.some(
      habit => habit.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) throw new Error("A habit with this name already exists.");

    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("You are not authenticated.");

    const habit = await createHabitRequest(token, trimmedName);
    setHabits(current => [...current, habit]);
    return habit;
  }

	return (
		<HabitContext value={{ habits, isLoading, error, deleteHabit, toggleHabit, createHabit }}>
			{children}
		</HabitContext>
	)
}

export default HabitProvider;

export function useHabits(){
	const habitContext = useContext(HabitContext)
	if (habitContext == null) throw new Error("Null context")

	return habitContext
}