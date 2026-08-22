import { useState, type SubmitEvent } from "react";
import Button from "../Button/Button.tsx";
import { useHabits } from "../../context/HabitProvider.tsx";
import "./HabitForm.css";

function HabitForm() {
	const [name, setName] = useState("");
	const { addHabit } = useHabits();

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (name.trim() === "") return;
		setName("");
		addHabit(name);
	}

	return (
		<form className="habit-form" onSubmit={handleSubmit}>
			<input
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="habit-form-input"
				placeholder="New Habit"
			/>
			<Button disabled={name.trim() === ""} className="habit-form-button">
				Add Habit
			</Button>
		</form>
	);
}

export default HabitForm;