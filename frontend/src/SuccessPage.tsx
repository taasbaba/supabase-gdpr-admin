import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // 已登入，自動跳轉至 dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000); // 可改成 10 秒
      } else {
        // 尚未登入，可能是誤觸
        navigate("/");
      }
    };

    checkSession();
  }, []);

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-success text-white">
      <div className="text-center">
        <h2>✅ Email Verified</h2>
        <p>Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default SuccessPage;
