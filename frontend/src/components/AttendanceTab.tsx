import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../lib/apiClient";

interface AttendanceTabProps {
  role: string | null;
}

interface AttendanceRecord {
  date: string;
  time_in: string | null;
  time_out: string | null;
}

interface TeamUser {
  id: string;
  full_name: string;
}

const AttendanceTab: React.FC<AttendanceTabProps> = ({ role }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [targetRecords, setTargetRecords] = useState<AttendanceRecord[]>([]);
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<TeamUser | null>(null);

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

  useEffect(() => {
    fetchAttendanceMe();
    if (role === "manager" || role === "leader") {
      fetchTeamUsers();
    }
  }, [role]);

  const renderTable = (records: AttendanceRecord[]) => (
    <div className="table-responsive">
      <table className="table table-sm table-bordered">
        <thead className="table-light">
          <tr>
            <th>Date</th>
            <th>Time In</th>
            <th>Time Out</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec, idx) => (
            <tr key={idx}>
              <td>{rec.date.slice(0, 10)}</td>
              <td>
                {rec.time_in
                  ? new Date(rec.time_in).toLocaleTimeString()
                  : "--"}
              </td>
              <td>
                {rec.time_out
                  ? new Date(rec.time_out).toLocaleTimeString()
                  : "--"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div className="fs-5 fw-medium">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        <div className="d-flex gap-3">
          <button
            className="btn btn-success btn-lg px-4"
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
            className="btn btn-danger btn-lg px-4"
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

      <h4 className="mb-3">Attendance (Last 30 Days)</h4>
      {errorSelf && <div className="alert alert-danger">{errorSelf}</div>}
      {loadingSelf ? (
        <p>Loading attendance records...</p>
      ) : (
        renderTable(records)
      )}

      {(role === "manager" || role === "leader") && (
        <>
          <h5 className="mt-5">Team Users</h5>
          <ul className="list-unstyled d-flex flex-column gap-2">
            {teamUsers.map((user) => (
              <li key={user.id}>
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => fetchAttendanceTarget(user)}
                >
                  {user.full_name}
                </button>
              </li>
            ))}
          </ul>

          {selectedUser && (
            <>
              <h6 className="mt-4">{selectedUser.full_name}'s Attendance</h6>
              {errorTarget && (
                <div className="alert alert-danger">{errorTarget}</div>
              )}
              {loadingTarget ? (
                <p>Loading attendance records...</p>
              ) : (
                renderTable(targetRecords)
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceTab;
