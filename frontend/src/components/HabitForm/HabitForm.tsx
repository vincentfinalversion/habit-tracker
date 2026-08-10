import Button from "../Button/Button.tsx";

function HabitForm(){
	return <form className="flex gap-2">
		<input className="flex-1 rounded-lg bg-zinc-800 px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-violet-500" placeholder="New Habit"></input>
		<Button className="rounded-lg px-4 py-2 font-medium">Add Habit</Button>
	</form>;
}

export default HabitForm;