import { useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../TextField/TextField";
import Button from "../Button/Button";
import { login } from "../../api/authApi";
import "./LoginForm.css";

function LoginForm() {
	const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

	async function handleSubmit(e: SubmitEvent) {
  e.preventDefault();

  if (username.trim() === "" || password.trim() === "") return;

  setError("");
  setIsSubmitting(true);

  try {
    const auth = await login(username, password);
    localStorage.setItem("authToken", auth.token);
    navigate("/dashboard");
  } catch (err) {
    setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
	}

  function handleGoogleLogin() {
    console.log("Google login clicked");

    // TODO:
    // google login request
  }
  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="login-form-fields">
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
        >
        </TextField>
      </div>
      <div className="login-form-buttons">
        <Button
          type="submit"
          className="login-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
        <h4>OR</h4>
        <Button 
          type="button"
          className="google-login-button"
          variant="secondary"
        >
          Login using google
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;