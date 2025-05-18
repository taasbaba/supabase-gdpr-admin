import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const absenceData = [
  { month: "Jan", absences: 1 },
  { month: "Feb", absences: 2 },
  { month: "Mar", absences: 3 },
  { month: "Apr", absences: 4 },
  { month: "May", absences: 3 },
  { month: "Jun", absences: 5 },
  { month: "Jul", absences: 6 },
];

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white p-6 space-y-6">
        <h1 className="text-2xl font-bold">Team Portal</h1>
        <nav className="space-y-4">
          <button className="block w-full text-left">My Attendance</button>
          <button className="block w-full text-left">Apply Leave</button>
          <button className="block w-full text-left">Inbox</button>
          <button className="block w-full text-left">Debug</button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Workforce Insights</h2>
          <div className="flex space-x-4">
            <button className="text-gray-700">Inbox</button>
            <button className="text-red-500">Logout</button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Employees</p>
            <p className="text-2xl font-bold">120</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Attendance Rate</p>
            <p className="text-2xl font-bold">95%</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Absences</p>
            <p className="text-2xl font-bold">5</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500">Leave Requests</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </div>

        {/* Chart + Profile */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">Absences per Month</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={absenceData}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="absences" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded shadow flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-300 mb-4" />
            <p className="font-semibold">John Doe</p>
            <p className="text-sm text-gray-500">Administrator</p>
            <button className="mt-2 px-4 py-1 border rounded text-sm">View</button>
          </div>
        </div>

        {/* Leave Requests */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Leave Requests</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Employee</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td>Alex Smith</td>
                <td>2024-05-17</td>
                <td>
                  <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-sm">
                    Approved
                  </span>
                </td>
              </tr>
              <tr className="border-b">
                <td>Lisa Wong</td>
                <td>2024-05-16</td>
                <td>
                  <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-sm">
                    Pending
                  </span>
                </td>
              </tr>
              <tr>
                <td>Mark Johnson</td>
                <td>2024-05-15</td>
                <td>
                  <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-sm">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
