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
        navigate("/dashboard");
      } else {
        setChecking(false);
      }
    };
    checkSession();
  }, [navigate]);

  if (checking) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-lg font-medium text-gray-600">Checking access...</div>
      </div>
    );
  }

  return children;
};

export default GuestGuard;
