import Header from './components/Header/Header.tsx';
import HabitForm from './components/HabitForm/HabitForm.tsx';
import HabitList from './components/HabitList/HabitList.tsx';
import HabitProvider from './context/HabitProvider.tsx';

export default function App(){
  return( 
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <HabitProvider>
        <Header />
        <HabitForm />
        <HabitList />
      </HabitProvider>
    </div>
  )
}