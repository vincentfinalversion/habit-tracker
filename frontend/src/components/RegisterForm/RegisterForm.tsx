import { useState, type SubmitEvent } from "react";
import TextField from "../TextField/TextField";
import Button from "../Button/Button";
import "./RegisterForm.css";

function RegisterForm() {
	const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (username.trim() === "" || password.trim() === "") return;
		setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
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
        placeholder="Enter your email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      >
      </TextField>
      <TextField
        placeholder="Enter your password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      >
      </TextField>
      <TextField
        placeholder="Enter your password again"
        label="Re-enter Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      >
      </TextField>
			<Button disabled={username.trim() === "" || password.trim() === ""} className="habit-form-button">
				Register Account
			</Button>
    </form>
  );
}

export default RegisterForm;