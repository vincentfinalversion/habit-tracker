import { useState, type SubmitEvent } from "react";
import TextField from "../TextField/TextField";
import Button from "../Button/Button";
import "./RegisterForm.css";

type FormErrors = {
	username?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
};

function RegisterForm() {
	const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const newErrors: FormErrors = {};

		if (username.trim() === "") {
			newErrors.username = "Username is required";
		}

		if (email.trim() === "") {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@gmail\.com$/.test(email)) {
			newErrors.email = "Email must be a Gmail address";
		}

		if (password.length < 8) {
			newErrors.password = "Password must be at least 8 characters";
		} else if (!/[A-Z]/.test(password)) {
			newErrors.password = "Password must contain at least 1 uppercase letter";
		} else if (!/[a-z]/.test(password)) {
			newErrors.password = "Password must contain at least 1 lowercase letter";
		} else if (!/[0-9]/.test(password)) {
			newErrors.password = "Password must contain at least 1 number";
		}

		if (confirmPassword !== password) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) return;

		setUsername("");
		setEmail("");
		setPassword("");
		setConfirmPassword("");
		setErrors({});
	}
  
  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <TextField
        placeholder="Enter your username"
        label="Username"
        value={username}
        error={errors.username}
        onChange={(e) => setUsername(e.target.value)}  
      >
      </TextField>
      <TextField
        placeholder="Enter your email"
        label="Email"
        value={email}
        error={errors.email}
        onChange={(e) => setEmail(e.target.value)}
      >
      </TextField>
      <TextField
        placeholder="Enter your password"
        label="Password"
        value={password}
        error={errors.password}
        onChange={(e) => setPassword(e.target.value)}
      >
      </TextField>
      <TextField
        placeholder="Enter your password again"
        label="Re-enter Password"
        value={confirmPassword}
        error={errors.confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      >
      </TextField>input validation
			<Button className="habit-form-button">
				Register Account
			</Button>
    </form>
  );
}

export default RegisterForm;