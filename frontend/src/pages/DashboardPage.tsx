import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AuthGuard from "../components/AuthGuard";

const DashboardPage = () => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user?.email ?? null);
    };
    getSession();
  }, []);

  return (
    <AuthGuard>
      <div className="app-bg">
        <div className="vh-100 d-flex justify-content-center align-items-center">
          <div className="text-center">
            <h2>🎉 Welcome {email}</h2>
            <p>This is your dashboard</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;
