import React from "react";

const LeaveTable = () => {
  return (
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
            <td><span className="text-green-600 bg-green-100 px-2 py-1 rounded text-sm">Approved</span></td>
          </tr>
          <tr className="border-b">
            <td>Lisa Wong</td>
            <td>2024-05-16</td>
            <td><span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-sm">Pending</span></td>
          </tr>
          <tr>
            <td>Mark Johnson</td>
            <td>2024-05-15</td>
            <td><span className="text-red-600 bg-red-100 px-2 py-1 rounded text-sm">Rejected</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;