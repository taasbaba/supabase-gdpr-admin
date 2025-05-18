import React from "react";
import { supabase } from "../lib/supabaseClient";

interface HeaderBarProps {
  title: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ title }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="flex space-x-4">
        <button className="text-gray-700">Inbox</button>
        <button
          className="text-red-500 hover:underline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default HeaderBar;
