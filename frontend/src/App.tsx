import Header from './components/Header/Header.tsx';
import HabitForm from './components/HabitForm/HabitForm.tsx';
import HabitList from './components/HabitList/HabitList.tsx';
import HabitProvider from './context/HabitProvider.tsx';
import { addWeeks, eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns';
import { useState } from 'react';

export default function App(){
  const [weekOffset, setWeekOffset] = useState(0)

  const week = addWeeks(new Date(), weekOffset)

  const visibleDates = eachDayOfInterval({ 
    start: startOfWeek(week, { weekStartsOn: 1 }), 
    end: endOfWeek(week, { weekStartsOn: 1 }),
  })

  return( 
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <HabitProvider>
        <Header 
          visibleDates={visibleDates}          
          onPrevious={() => setWeekOffset(offset => offset - 1)}
          onNext={() => setWeekOffset(offset => offset + 1)}
        />
        <HabitForm />
        <HabitList />
      </HabitProvider>
    </div>
  )
}

