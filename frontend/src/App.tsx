import Button from './components/Button/Button.tsx';

export default function App(){
  return <div className="max-w-2xl mx-auto p-4 flex-col gap-4">
    <Header/>
  </div>
}

function Header(){
  return <header className="flex items-center justify-between">
    <div className="flex flex-col gap-1">
      <h1 className="text-3xl font-bold">Habit Tracker</h1>
      <span className="text-zinc-400 text-sm">1 / 1 done today</span>
    </div>
    <div className="flex flex-col gap-1 items-end">
      <span className="text-zinc-400 text-sm">Aug 10 - Aug 16</span>
      <div className="flex items-center gap-3">
        <Button>Prev</Button>
        <Button>Next</Button>
      </div>
    </div>
  </header>
}