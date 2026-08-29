import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { deleteHabitRequest, getHabits, toggleHabitCompletion, type Habit } from "../api/habitsApi";

type Context = {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
	deleteHabit: (id: number) => Promise<void>;
	toggleHabit: (id: number, date: string) => Promise<Habit>;
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

	return (
		<HabitContext value={{ habits, isLoading, error, deleteHabit, toggleHabit }}>
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
