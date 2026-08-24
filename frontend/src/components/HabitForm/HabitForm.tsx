import { useState, type SubmitEvent } from "react";
import { useHabits } from "../../context/HabitProvider.tsx";
import Button from "../Button/Button.tsx";
import TextField from "../TextField/TextField.tsx";
import "./HabitForm.css";

function HabitForm() {
	const [habitName, setHabitName] = useState("");
	const { addHabit } = useHabits();

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (habitName.trim() === "") return;
		setHabitName("");
		addHabit(habitName);
	}

	return (
		<form className="habit-form" onSubmit={handleSubmit}>
      <TextField 
        placeholder="Enter Habit Name..."
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}  
      />
			<Button disabled={habitName.trim() === ""} className="habit-form-button">
				Add Habit
			</Button>
		</form>
	);
}

export default HabitForm;