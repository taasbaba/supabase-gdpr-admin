import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const demoUsers = [
  { label: "IT.manager", email: "it.manager@jack.com" },
  { label: "IT.leader", email: "it.leader@jack.com" },
  { label: "IT.member-a", email: "it.member-a@jack.com" },
];

const DEFAULT_PASSWORD = "12345678";

const LoginPage = () => {
  const [selectedEmail, setSelectedEmail] = useState(demoUsers[0].email);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: selectedEmail,
      password: DEFAULT_PASSWORD,
    });
    setLoading(false);
    if (error) {
      alert("Login failed: " + error.message);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-800 to-slate-600">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Log in to your account
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Please choose your role. This demo is implemented using Supabase Auth.
        </p>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select a user role
        </label>
        <select
          className="w-full border border-gray-300 rounded px-4 py-2 mb-6 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
        >
          {demoUsers.map((user) => (
            <option key={user.email} value={user.email}>
              {user.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
