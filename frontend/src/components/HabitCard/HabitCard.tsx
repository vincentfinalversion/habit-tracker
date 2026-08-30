import { useEffect, useMemo, useState } from "react";
import { addDays, addWeeks, format, isBefore, parseISO, startOfWeek, subWeeks } from "date-fns";
import { getHabitWeek, type Habit } from "../../api/habitsApi";
import { useHabits } from "../../context/HabitProvider.tsx";
import Button from "../Button/Button.tsx";
import "./HabitCard.css";

const mondayOptions = { weekStartsOn: 1 as const };
type HabitCardProps = { habit: Habit };

function HabitCard({ habit }: HabitCardProps) {
  const { deleteHabit, toggleHabit } = useHabits();
  const currentWeekStart = useMemo(() => startOfWeek(getUtcNow(), mondayOptions), []);
  const [weekStart, setWeekStart] = useState(currentWeekStart);
  const [weekData, setWeekData] = useState(habit);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createdWeekStart = startOfWeek(parseISO(weekData.createdAt), mondayOptions);
  const canGoPrevious = isBefore(createdWeekStart, weekStart);
  const canGoNext = isBefore(weekStart, currentWeekStart);

  useEffect(() => { setWeekData(habit); }, [habit.id]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    void getHabitWeek(token, habit.id, format(weekStart, "yyyy-MM-dd"))
      .then(data => { if (!cancelled) setWeekData(data); })
      .catch(() => { if (!cancelled) setError("Unable to load this week."); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [habit.id, weekStart]);

  async function handleToggle(date: string) {
    try {
      setError(null);
      setWeekData(await toggleHabit(habit.id, date));
    } catch {
      setError("Unable to update this day.");
    }
  }

  async function handleDelete() {
    try { await deleteHabit(habit.id); }
    catch { setError("Unable to delete this habit."); }
  }

  function getUtcNow() {
    const now = new Date();
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  }

  return <div className="card">
    <div className="habit-card-header">
      <div className="habit-info">
        <span className="habit-name">{weekData.name}</span>
        {weekData.streak >= 2 && <span className="streak">🔥{weekData.streak}</span>}
      </div>
      <div className="delete-button-container">
        <Button 
          onClick={() => void handleDelete()} 
          variant="ghost-destructive"
        >
          Delete
        </Button></div>
    </div>
    <div className="week-navigation">
      <Button 
        disabled={!canGoPrevious || isLoading} onClick={() => setWeekStart(value => subWeeks(value, 1))} 
        variant="primary" 
        className="nav-button"
      >
        {"<"}
      </Button>
      <span className="week-range">
        {format(weekStart, "MMM d")} – {format(addDays(weekStart, 6), "MMM d")}
      </span>
      <Button 
        disabled={!canGoNext || isLoading} 
        onClick={() => setWeekStart(value => addWeeks(value, 1))} 
        variant="primary" 
        className="nav-button"
      >
        {">"}
      </Button>
    </div>
    <div className="week-row"><div className="day-list">
      {weekData.days.map(day => {
        const date = parseISO(day.date);
        const beforeHabitCreation = isBefore(date, parseISO(weekData.createdAt));
        return <Button className="day-button" key={day.date} disabled={isLoading || day.isFuture || beforeHabitCreation}
          onClick={() => void handleToggle(day.date)} variant={day.completed ? "primary" : "secondary"}>
          <span className="day-name">{format(date, "EEE")}</span><span>{format(date, "d")}</span>
        </Button>;
      })}
    </div></div>
    {error && <p className="habit-card-error">{error}</p>}
  </div>;
}

export default HabitCard;
