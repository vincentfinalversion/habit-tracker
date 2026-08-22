import { useState } from "react";
import { useHabits, type Habit } from "../../context/HabitProvider.tsx";
import Button from "../Button/Button.tsx";
import { addWeeks, eachDayOfInterval, endOfWeek, format, isFuture, isSameDay, startOfWeek, subDays } from "date-fns";
import "./HabitCard.css";

function getStreak(completions: Date[]) {
	let streak = 0
	let date = new Date()

	while(completions.some(c => isSameDay(c, date))) {
		streak ++
		date = subDays(date, 1)
	}

	return streak
}

function getVisibleDates(weekOffset: number) {
	const anchor = addWeeks(new Date(), weekOffset)
	return eachDayOfInterval({
		start: startOfWeek(anchor, { weekStartsOn: 1 }),
		end: endOfWeek(anchor, { weekStartsOn: 1 }),
	})
}

type HabitCardProps = {
	habit: Habit
}

function HabitCard({ habit }: HabitCardProps){
	const { deleteHabit, toggleHabit } = useHabits()
	const [weekOffset, setWeekOffset] = useState(0)

	const streak = getStreak(habit.completions)
	const visibleDates = getVisibleDates(weekOffset)

	return (
	<div className="card">
		<div className="habit-card-header">
			<div className="habit-info">
				<span className="habit-name">{habit.name}</span>
				{streak !== 0 && ( // if streak is 0, returns false making the span not render
					<span className="streak">🔥{streak}</span>				
				)}
			</div>
      <div className="delete-button-container">
        <Button 
          onClick={() => deleteHabit(habit.id)} 
          variant="ghost-destructive" 
        >
          Delete
        </Button>
      </div>
		</div>
		<div className="week-row">
			<Button
				onClick={() => setWeekOffset(w => w - 1)}
				variant="primary"
				className="nav-button"
			>
				{"<"}
			</Button>
			<div className="day-list">
				{visibleDates.map(date => (
					<Button 
						className="day-button"
						key={date.toISOString()} 
						disabled={isFuture(date)}
						onClick={() => toggleHabit(habit.id, date)}
						variant={
							habit.completions.some(d => isSameDay(date, d))
								? "primary"
								: "secondary"
						}
					>
						<span className="day-name">{format(date, "EEE")}</span>
						<span>{format(date, "d")}</span>
					</Button>
				))}
			</div>
			<Button
				onClick={() => setWeekOffset(w => w + 1)}
				variant="primary"
				className="nav-button"
			>
				{">"}
			</Button>
		</div>
	</div>
	)
}

export default HabitCard;