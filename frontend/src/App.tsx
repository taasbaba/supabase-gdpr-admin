import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "./lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!email || !password) return;

    setStatus("loading");
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setMessage("Login failed: " + error.message);
      return;
    }

    const user = data.user;
    const isVerified = !!user?.email_confirmed_at;

    if (!isVerified) {
      await supabase.auth.signOut(); // 馬上登出
      setStatus("error");
      setMessage("Email not verified. Please check your inbox.");
      return;
    }

    navigate("/success");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#007BFF" }}
    >
      <div
        className="bg-white rounded p-4 shadow"
        style={{ width: "100%", maxWidth: 400 }}
      >
        <h3 className="text-center mb-4">Create Account</h3>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={status === "loading"}
          />
        </div>

        <button
          className="btn btn-primary w-100"
          onClick={handleSignUp}
          disabled={status === "loading" || !email || !password}
        >
          {status === "loading" ? "Registering..." : "Sign Up"}
        </button>

        {message && <div className="alert alert-danger mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default App;
