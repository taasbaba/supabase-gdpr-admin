import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../lib/apiClient";
import { supabase } from "../lib/supabaseClient";
import DashboardLayout from "../components/DashboardLayout";

interface AttendanceRecord {
  date: string;
  time_in: string | null;
  time_out: string | null;
}

interface TeamUser {
  id: string;
  full_name: string;
}

const MyAttendancePage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [targetRecords, setTargetRecords] = useState<AttendanceRecord[]>([]);
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<TeamUser | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const [loadingSelf, setLoadingSelf] = useState(false);
  const [loadingTarget, setLoadingTarget] = useState(false);
  const [errorSelf, setErrorSelf] = useState<string | null>(null);
  const [errorTarget, setErrorTarget] = useState<string | null>(null);

  const fetchAttendanceMe = async () => {
    setLoadingSelf(true);
    setErrorSelf(null);
    try {
      const data = await fetchWithToken("/attendance/me");
      setRecords(data);
    } catch (err: any) {
      setErrorSelf(err.message || "Failed to fetch my attendance");
    } finally {
      setLoadingSelf(false);
    }
  };

  const fetchAttendanceTarget = async (user: TeamUser) => {
    setSelectedUser(user);
    setLoadingTarget(true);
    setErrorTarget(null);
    try {
      const data = await fetchWithToken(`/attendance/${user.id}`);
      setTargetRecords(data);
    } catch (err: any) {
      setErrorTarget(err.message || "Failed to fetch target attendance");
    } finally {
      setLoadingTarget(false);
    }
  };

  const fetchTeamUsers = async () => {
    try {
      const res = await fetchWithToken("/admin/getall");
      setTeamUsers(res.users);
    } catch (err) {
      console.error("Failed to fetch team users", err);
    }
  };

  const detectRole = async () => {
    const data = await fetchWithToken("/me/profile");
    const userRole = data?.role || null;
    setRole(userRole);
    console.log("In detectRole", data);
    if (userRole === "manager" || userRole === "leader") {
      await fetchTeamUsers();
      console.log(teamUsers);
    }
  };

  useEffect(() => {
    fetchAttendanceMe();
    detectRole();
  }, []);

  const renderTable = (records: AttendanceRecord[]) => (
    <div className="overflow-x-auto rounded border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Date</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Time In</th>
            <th className="px-4 py-2 text-left font-medium text-gray-600">Time Out</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {records.map((rec, idx) => (
            <tr key={idx}>
              <td className="px-4 py-2">{rec.date.slice(0, 10)}</td>
              <td className="px-4 py-2">{rec.time_in ? new Date(rec.time_in).toLocaleTimeString() : "--"}</td>
              <td className="px-4 py-2">{rec.time_out ? new Date(rec.time_out).toLocaleTimeString() : "--"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <DashboardLayout title="My Attendance">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="text-lg font-medium text-gray-700">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button
              className="px-5 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
              onClick={async () => {
                try {
                  await fetchWithToken("/attendance/time-in", "POST");
                  fetchAttendanceMe();
                } catch (err: any) {
                  alert("Clock In failed: " + err.message);
                }
              }}
            >
              Clock In
            </button>
            <button
              className="px-5 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700"
              onClick={async () => {
                try {
                  await fetchWithToken("/attendance/time-out", "POST");
                  fetchAttendanceMe();
                } catch (err: any) {
                  alert("Clock Out failed: " + err.message);
                }
              }}
            >
              Clock Out
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">My Attendance (Latest 10 Records)</h3>
          {errorSelf && <div className="text-red-500">{errorSelf}</div>}
          {loadingSelf ? <p>Loading...</p> : renderTable(records)}
        </div>

        {(role === "manager" || role === "leader") && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Your Team</h4>
              <div className="flex flex-wrap gap-2">
                {teamUsers.map((user) => (
                  <button
                    key={user.id}
                    className="px-4 py-1 border border-gray-400 text-sm rounded hover:bg-gray-100"
                    onClick={() => fetchAttendanceTarget(user)}
                  >
                    {user.full_name}
                  </button>
                ))}
              </div>
            </div>

            {selectedUser && (
              <div>
                <h5 className="text-md font-medium text-gray-600 mb-2">
                  {selectedUser.full_name}'s Attendance
                </h5>
                {errorTarget && <div className="text-red-500">{errorTarget}</div>}
                {loadingTarget ? <p>Loading...</p> : renderTable(targetRecords)}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyAttendancePage;
