import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-slate-800 text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold">Team Portal</h1>
      <nav className="space-y-4">
        <button className="block w-full text-left" onClick={() => navigate("/attendance")}>My Attendance</button>
        <button className="block w-full text-left" onClick={() => navigate("/leave")}>Apply Leave</button>
        <button className="block w-full text-left" onClick={() => navigate("/inbox")}>Inbox</button>
        <button className="block w-full text-left" onClick={() => navigate("/debug")}>Debug</button>
      </nav>
    </aside>
  );
};

export default Sidebar;