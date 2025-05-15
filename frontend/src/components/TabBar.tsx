import React from "react";

interface TabBarProps {
  active:
    | "profile"
    | "attendance"
    | "leave"
    | "inbox"
    | "admin"
    | "token";
  onChange: (tab: TabBarProps["active"]) => void;
  role: string | null;
}

const TabBar: React.FC<TabBarProps> = ({ active, onChange, role }) => {
  return (
    <div className="nav nav-tabs flex-wrap">
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
        className={`nav-link ${active === "leave" ? "active" : ""}`}
        onClick={() => onChange("leave")}
      >
        LEAVE
      </button>
      {(role === "manager" || role === "leader") && (
        <button
          className={`nav-link ${active === "inbox" ? "active" : ""}`}
          onClick={() => onChange("inbox")}
        >
          INBOX
        </button>
      )}
      {role !== "member" && (
        <button
          className={`nav-link ${active === "admin" ? "active" : ""}`}
          onClick={() => onChange("admin")}
        >
          ADMIN
        </button>
      )}
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
