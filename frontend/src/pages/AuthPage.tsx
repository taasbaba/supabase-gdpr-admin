import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import AuthForm from "../components/AuthForm";
import GuestGuard from "../components/GuestGuard";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password) return;
  
    setStatus("loading");
    setMessage("");
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.REACT_APP_EMAIL_REDIRECT,
      },
    });
  
    console.log("handleRegister:", data, error);
  
    if (error) {
      // Known error when user is already confirmed
      if (
        error.message.includes("User already registered") ||
        error.message.includes("already exists")
      ) {
        setStatus("error");
        setMessage("This email is already registered. Please log in instead.");
      } else {
        setStatus("error");
        setMessage("Registration failed: " + error.message);
      }
      return;
    }
  
    // Additional check: user exists but no session => probably re-sending confirm
    if (data?.user && data.session === null) {
      setStatus("error");
      setMessage("This email is already registered. Please log in instead.");
      return;
    }
  
    // Real success case — new user
    navigate("/verify-pending");
  };
  

  const handleLogin = async () => {
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
      await supabase.auth.signOut();
      setStatus("error");
      setMessage("Email not verified. Please check your inbox.");
      return;
    }

    navigate("/dashboard");
  };

  return (
    <GuestGuard>
      <AuthForm
        email={email}
        password={password}
        onEmailChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        onPasswordChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        onRegister={handleRegister}
        onLogin={handleLogin}
        loading={status === "loading"}
        message={message}
      />
    </GuestGuard>
  );
};

export default AuthPage;
