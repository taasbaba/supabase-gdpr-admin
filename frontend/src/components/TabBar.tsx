// src/components/TabBar.tsx
import React from "react";

interface TabBarProps {
  active: "profile" | "admin" | "token" | "attendance";
  onChange: (tab: "profile" | "admin" | "token" | "attendance") => void;
}

const TabBar: React.FC<TabBarProps> = ({ active, onChange }) => {
  return (
    <div className="nav nav-tabs">
      <button
        className={`nav-link ${active === "profile" ? "active" : ""}`}
        onClick={() => onChange("profile")}
      >
        PROFILE
      </button>
      <button
        className={`nav-link ${active === "attendance" ? "active" : ""}`}
        onClick={() => onChange("attendance")}
      >
        ATTENDANCE
      </button>
      <button
        className={`nav-link ${active === "admin" ? "active" : ""}`}
        onClick={() => onChange("admin")}
      >
        ADMIN
      </button>
      <button
        className={`nav-link ${active === "token" ? "active" : ""}`}
        onClick={() => onChange("token")}
      >
        TOKEN
      </button>
    </div>
  );
};

export default TabBar;
