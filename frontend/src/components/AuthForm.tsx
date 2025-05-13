import React from "react";
import "./AuthForm.css";

interface Props {
  email: string;
  password: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRegister: () => void;
  onLogin: () => void;
  loading: boolean;
  message: string;
}

const AuthForm: React.FC<Props> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onRegister,
  onLogin,
  loading,
  message,
}) => {
  return (
    <div className="auth-bg">
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div
          className="p-4 shadow rounded bg-white"
          style={{ width: "100%", maxWidth: 400 }}
        >
          <h4 className="text-center mb-4 fw-bold">Account Access</h4>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              value={email}
              onChange={onEmailChange}
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={onPasswordChange}
              disabled={loading}
            />
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-secondary w-50"
              onClick={onLogin}
              disabled={loading || !email || !password}
            >
              {loading ? "Loading..." : "Login"}
            </button>
            <button
              className="btn btn-primary w-50"
              onClick={onRegister}
              disabled={loading || !email || !password}
            >
              {loading ? "Loading..." : "Register"}
            </button>
          </div>

          {message && <div className="alert alert-danger mt-3">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
