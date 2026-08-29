import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../TextField/TextField";
import Button from "../Button/Button";
import { register } from "../../api/registerApi";
import "./RegisterForm.css";

type FormErrors = {
	username?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
};

const USERNAME_PATTERN = /^[a-zA-Z0-9_-]+$/;

function RegisterForm() {
	const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const trimmedUsername = username.trim();
		const trimmedEmail = email.trim();

		const newErrors: FormErrors = {};

		if (trimmedUsername === "") {
			newErrors.username = "Username is required";
		} else if (trimmedUsername.length > 50) {
			newErrors.username = "Username must be 50 characters or fewer";
		} else if (!USERNAME_PATTERN.test(trimmedUsername)) {
			newErrors.username = "Username can only contain letters, numbers, underscores, and dashes";
		}

		if (trimmedEmail === "") {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@gmail\.com$/i.test(trimmedEmail)) {
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

		setIsSubmitting(true);

		try {
			await register(trimmedUsername, trimmedEmail, password);

			setUsername("");
			setEmail("");
			setPassword("");
			setConfirmPassword("");
			setErrors({});

			navigate("/verify-email", { state: { email: trimmedEmail } });
		} catch (err) {
			const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";

			if (message.toLowerCase().includes("username")) {
				setErrors({ username: message });
			} else if (message.toLowerCase().includes("email")) {
				setErrors({ email: message });
			} else {
				setErrors({ username: message });
			}
		} finally {
			setIsSubmitting(false);
		}
	}
  
  return (
    <form className="register-form" onSubmit={handleSubmit}>
      <div className="register-form-fields">
        <TextField
          placeholder="Enter your username"
          label="Username"
          value={username}
          error={errors.username}
          maxLength={50}
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
          type="password"
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
        >
        </TextField>
        <TextField
          placeholder="Enter your password again"
          label="Re-enter Password"
          type="password"
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        >
        </TextField>
      </div>
      <div className="register-form-buttons">
        <Button
          type="submit"
          className="register-form-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register Account"}
        </Button>
      </div>
    </form>
  );
}

export default RegisterForm;