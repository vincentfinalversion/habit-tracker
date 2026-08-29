import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDailySummary, type DailySummary } from "../../api/habitsApi";
import Button from "../Button/Button";
import "./Header.css";

function Header() {
	const [summary, setSummary] = useState<DailySummary | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (!token) return;

		void getDailySummary(token)
			.then(setSummary)
			.catch(() => setSummary(null));
	}, []);

	function handleLogout() {
		localStorage.removeItem("authToken");
		navigate("/auth", { replace: true });
	}

	return (
		<header className="header">
      <div className="header-title-container">
			  <h1 className="header-title">myHabits</h1>
      </div>
      <div className="habits-completed-container">
        <span className="habits-completed">
          {summary ? `${summary.completedCount} / ${summary.totalHabits} done today` : "Loading summary..."}
        </span>
      </div>
      <div className="logout-button-container">
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
		</header>
	);
}

export default Header;
