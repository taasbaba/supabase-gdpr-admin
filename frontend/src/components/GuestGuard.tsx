import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const GuestGuard = ({ children }: { children: JSX.Element }) => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const isLoggedIn = !!data.session;
      if (isLoggedIn) {
        navigate("/dashboard"); // redirect logged-in users away
      } else {
        setChecking(false); // allow guest to see content
      }
    };
    checkSession();
  }, []);

  if (checking) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div>Checking access...</div>
      </div>
    );
  }

  return children;
};

export default GuestGuard;
