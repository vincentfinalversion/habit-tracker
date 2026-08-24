import { useState, type SubmitEvent } from "react";
import TextField from "../TextField/TextField";
import Button from "../Button/Button";
import "./LoginForm.css";

function LoginForm() {
	const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (username.trim() === "" || password.trim() === "") return;
		setUsername("");
    setPassword("");
	}
  
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <TextField
        placeholder="Enter your username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}  
      >
      </TextField>
      <TextField
        placeholder="Enter your password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      >
      </TextField>
			<Button disabled={username.trim() === "" || password.trim() === ""} className="habit-form-button">
				Login Account
			</Button>
    </form>
  );
}

export default LoginForm;