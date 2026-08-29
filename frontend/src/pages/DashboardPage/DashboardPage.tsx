import { useState, type SubmitEvent } from 'react';
import Header from '../../components/Header/Header.tsx';
import HabitList from '../../components/HabitList/HabitList.tsx';
import SingleFieldForm from '../../components/SingleFieldForm/SingleFieldForm.tsx';
import HabitProvider, { useHabits } from '../../context/HabitProvider.tsx';
import './DashboardPage.css';

function NewHabitForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createHabit } = useHabits();

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (name.trim() === "") return;

    setError("");
    setIsSubmitting(true);

    try {
      await createHabit(name);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SingleFieldForm
      className="new-habit-form"
      onSubmit={handleSubmit}
      buttonText="Create new Habit"
      buttonDisabled={isSubmitting}
      placeholder="Enter a habit name"
      value={name}
      error={error}
      maxLength={100}
      onChange={(e) => setName(e.target.value)}
    />
  );
}

function DashboardPage() {
  return( 
    <div className="dashboard-page">
      <HabitProvider>
        <Header />
        <main className="app-container">
          <NewHabitForm />
          <HabitList />
        </main>
      </HabitProvider>
    </div >
  )
};

export default DashboardPage;