import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../lib/apiClient";

interface InboxItem {
  id: number;
  type: "leave_request";
  reference_id: number;
  status: string;
  created_at: string;
  leave: {
    id: number;
    user_id: string;
    reason: string;
    status: string;
    requested_from: string;
    requested_to: string;
  };
}

const InboxTab: React.FC = () => {
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInbox = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithToken("/inbox");
      setInbox(data);
    } catch (err: any) {
      setError(err.message || "Failed to load inbox.");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId: number) => {
    try {
      await fetchWithToken(`/leave-request/${leaveId}/approve`, "PUT");
      fetchInbox(); // Refresh after approval
    } catch (err: any) {
      alert(err.message || "Approval failed.");
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  return (
    <div>
      <h4 className="mb-3">Inbox – Pending Approvals</h4>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <p>Loading inbox...</p>
      ) : inbox.length === 0 ? (
        <p>No pending items.</p>
      ) : (
        <ul className="list-group">
          {inbox.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-start flex-wrap"
            >
              <div className="w-100">
                <div className="fw-bold">
                  Leave Request – {item.leave.requested_from} to{" "}
                  {item.leave.requested_to}
                </div>
                <div>Reason: {item.leave.reason}</div>
                <div className="text-muted small">
                  Requested on: {item.created_at.slice(0, 10)}
                </div>
              </div>
              <button
                className="btn btn-sm btn-success mt-2"
                onClick={() => handleApprove(item.leave.id)}
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InboxTab;
