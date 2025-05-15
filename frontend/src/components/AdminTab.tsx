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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAttendance = async (uuid?: string) => {
    setLoading(true);
    setError(null);
    try {
      const path = uuid ? `/attendance/${uuid}` : "/attendance/me";
      const data = await fetchWithToken(path);
      if (uuid) {
        setTargetRecords(data);
      } else {
        setRecords(data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamUsers = async () => {
    try {
      const res = await fetchWithToken("/admin/getall");
      setTeamUsers(res.users);
    } catch (err: any) {
      console.error("Failed to fetch team users", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
    if (role === "manager" || role === "leader") {
      fetchTeamUsers();
    }
  }, [role]);

  const handleUserClick = (user: TeamUser) => {
    setSelectedUser(user);
    fetchAttendance(user.id);
  };

  const renderTable = (records: AttendanceRecord[]) => {
    return (
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
                <td>{rec.time_in ? new Date(rec.time_in).toLocaleTimeString() : "--"}</td>
                <td>{rec.time_out ? new Date(rec.time_out).toLocaleTimeString() : "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <h4 className="mb-3">Attendance (Last 30 Days)</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? <p>Loading attendance records...</p> : renderTable(records)}

      {(role === "manager" || role === "leader") && (
        <>
          <h5 className="mt-4">Team Users</h5>
          <ul className="list-unstyled d-flex flex-wrap gap-2">
            {teamUsers.map((user) => (
              <li key={user.id}>
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => handleUserClick(user)}
                >
                  {user.full_name}
                </button>
              </li>
            ))}
          </ul>

          {selectedUser && (
            <>
              <h6 className="mt-4">{selectedUser.full_name}'s Attendance</h6>
              {renderTable(targetRecords)}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceTab;