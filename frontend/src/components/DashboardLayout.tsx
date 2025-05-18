import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <main className="flex-1 p-8 space-y-6">
        <HeaderBar title={title || "Dashboard"} />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
