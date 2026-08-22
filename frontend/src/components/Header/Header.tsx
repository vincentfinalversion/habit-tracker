import { isToday } from "date-fns";
import { useHabits } from "../../context/HabitProvider";
import "./Header.css";

function Header() {
	const { habits } = useHabits();

	const doneToday = habits.filter((h) =>
		h.completions.some((c) => isToday(c)),
	).length;

	return (
		<header className="header">
			<h1 className="header-title">myHabits</h1>
			<span className="habits-completed">
				{doneToday} / {habits.length} done today
			</span>
		</header>
	);
}

export default Header;