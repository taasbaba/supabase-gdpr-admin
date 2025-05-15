// components/AuthGuard.tsx
import { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/"); // 未登入就導出
      }
      setChecking(false);
    };

    checkSession();
  }, [navigate]);

  if (checking) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div>Checking session...</div>
      </div>
    );
  }

  return children;
};

export default AuthGuard;
