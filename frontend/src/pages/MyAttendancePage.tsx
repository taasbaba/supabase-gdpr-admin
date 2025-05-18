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
    if (userRole === "manager" || userRole === "leader") {
      await fetchTeamUsers();
    }
  };

  useEffect(() => {
    fetchAttendanceMe();
    detectRole();
  }, []);

  const renderTable = (records: AttendanceRecord[]) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
      <table className="min-w-full text-sm text-gray-700">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Date</th>
            <th className="px-4 py-3 text-left font-semibold">Time In</th>
            <th className="px-4 py-3 text-left font-semibold">Time Out</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {records.map((rec, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
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
      <div className="space-y-10 px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <div className="flex gap-3">
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium shadow"
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
              className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-lg font-medium shadow"
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

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">My Attendance (Latest 10 Records)</h3>
          {errorSelf && <p className="text-red-600">{errorSelf}</p>}
          {loadingSelf ? <p className="text-gray-500">Loading...</p> : renderTable(records)}
        </section>

        {(role === "manager" || role === "leader") && (
          <section>
            <h4 className="text-xl font-semibold text-gray-700 mb-4">Your Team</h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {teamUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => fetchAttendanceTarget(user)}
                  className="px-4 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  {user.full_name}
                </button>
              ))}
            </div>

            {selectedUser && (
              <div>
                <h5 className="text-md font-medium text-gray-600 mb-3">
                  {selectedUser.full_name}'s Attendance
                </h5>
                {errorTarget && <p className="text-red-600">{errorTarget}</p>}
                {loadingTarget ? <p className="text-gray-500">Loading...</p> : renderTable(targetRecords)}
              </div>
            )}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyAttendancePage;
