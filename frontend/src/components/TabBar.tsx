import React from "react";

interface TabBarProps {
  active: string;
  onChange: (tab: "profile" | "admin" | "token") => void;
}

const TabBar: React.FC<TabBarProps> = ({ active, onChange }) => {
  return (
    <div className="flex justify-center space-x-4 py-4 bg-gray-100">
      {["profile", "admin", "token"].map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab as any)}
          className={`px-4 py-2 rounded-md font-semibold ${
            active === tab
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-800 border"
          }`}
        >
          {tab.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default TabBar;
