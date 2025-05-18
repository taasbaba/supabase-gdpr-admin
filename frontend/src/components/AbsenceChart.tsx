import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const absenceData = [
  { month: "Jan", absences: 1 },
  { month: "Feb", absences: 2 },
  { month: "Mar", absences: 3 },
  { month: "Apr", absences: 4 },
  { month: "May", absences: 3 },
  { month: "Jun", absences: 5 },
  { month: "Jul", absences: 6 },
];

const AbsenceChart = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
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
  );
};

export default AbsenceChart;