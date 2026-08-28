import Header from '../../components/Header/Header.tsx';
import HabitList from '../../components/HabitList/HabitList.tsx';
import HabitProvider from '../../context/HabitProvider.tsx';
import { addWeeks, eachDayOfInterval, endOfWeek, startOfWeek } from 'date-fns';
import { useState } from 'react';

function DashboardPage() {
  const [weekOffset, setWeekOffset] = useState(0)

  const week = addWeeks(new Date(), weekOffset)

  const visibleDates = eachDayOfInterval({ 
    start: startOfWeek(week, { weekStartsOn: 1 }), 
    end: endOfWeek(week, { weekStartsOn: 1 }),
  })

  return( 
    <HabitProvider>
      <Header />
      <div className="app-container">
          <HabitForm />
          <HabitList visibleDates={visibleDates}/>
      </div>
    </HabitProvider >
  )
};

export default DashboardPage;