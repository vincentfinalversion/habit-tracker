import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "../TextField/TextField";
import Button from "../Button/Button";
import { login, loginWithGoogle } from "../../api/authApi";
import "./LoginForm.css";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: { type: string }) => void;
        };
      };
    };
  }
}
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

  const hiddenGoogleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google || !hiddenGoogleButtonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        setError("");
        setIsSubmitting(true);
        try {
          const auth = await loginWithGoogle(response.credential);
          localStorage.setItem("authToken", auth.token);
          navigate("/dashboard");
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      },
    });

    window.google.accounts.id.renderButton(hiddenGoogleButtonRef.current, {
      type: "standard",
    });
  }, [navigate]);

  function handleGoogleLogin() {
    const hiddenButton = hiddenGoogleButtonRef.current?.querySelector<HTMLElement>(
      "div[role=button]"
    );
    hiddenButton?.click();
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
          onClick={handleGoogleLogin}
          disabled={isSubmitting}
        >
          Login using google
        </Button>
        <div ref={hiddenGoogleButtonRef} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
      </div>
    </form>
  );
}

export default LoginForm;