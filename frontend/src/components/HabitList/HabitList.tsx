import { useHabits } from "../../context/HabitProvider.tsx";
import HabitCard from "../HabitCard/HabitCard.tsx";
import "./HabitList.css";

function HabitList(){
	const { habits } = useHabits()
	if (habits.length === 0) {
    return <p className="empty">
      No habits yet. Add one above to get started!
    </p>
  }

	return (
		<div className="list">
			{habits.map(habit => (
				<HabitCard 
					key={habit.id} 
					habit={habit}
				/>
			))}
    </div>
	)
}

export default HabitList;