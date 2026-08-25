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

  console.log("Login attempt:", {
    username,
    password,
  });

  // TODO:
  // await login(username, password);

  setUsername("");
  setPassword("");
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        >
        </TextField>
      </div>
      <div className="login-form-buttons">
        <Button
          type="submit"
          className="login-button" 
          disabled={username.trim() === "" || password.trim() === ""}
        >
          Login
        </Button>
        <h4>OR</h4>
        <Button 
          type="button"
          className="google-login-button"
          variant="secondary"
          disabled={username.trim() === "" || password.trim() === ""} 
        >
          Login using google
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;