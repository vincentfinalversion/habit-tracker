import Header from '../../components/Header/Header.tsx';
import HabitList from '../../components/HabitList/HabitList.tsx';
import HabitProvider from '../../context/HabitProvider.tsx';
import './DashboardPage.css';

function DashboardPage() {
  return( 
    <div className="dashboard-page">
      <HabitProvider>
        <Header />
        <main className="app-container">
          <HabitList />
        </main>
      </HabitProvider>
    </div >
  )
};

export default DashboardPage;
