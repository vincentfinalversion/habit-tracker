import Header from './components/Header/Header.tsx';
import HabitForm from './components/HabitForm/HabitForm.tsx';
import HabitList, { type Habit } from './components/HabitList/HabitList.tsx';
import { useState } from 'react';

export default function App(){
  const [habits, setHabits] = useState<Habit[]>([])
  
  function addHabit(name: string){
    setHabits(curr => [...curr, { id: crypto.randomUUID(), name }])
  }

  function deleteHabit(id: string){
    setHabits(curr =>  curr.filter(h => h.id !== id))
  }

  return <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
    <Header />
    <HabitForm addHabit={addHabit}/>
    <HabitList deleteHabit={deleteHabit} habits={habits}/>
  </div>
}