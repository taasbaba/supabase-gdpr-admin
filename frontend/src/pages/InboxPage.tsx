import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../lib/apiClient";
import DashboardLayout from "../components/DashboardLayout";

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

const InboxPage: React.FC = () => {
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
      fetchInbox(); // Refresh
    } catch (err: any) {
      alert(err.message || "Approval failed.");
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  return (
    <DashboardLayout title="Inbox">
      <div className="space-y-6 px-4 sm:px-8">
        {error && <div className="text-red-600">{error}</div>}

        {loading ? (
          <p className="text-gray-500">Loading inbox...</p>
        ) : inbox.length === 0 ? (
          <p className="text-gray-500">No pending items.</p>
        ) : (
          <ul className="space-y-4">
            {inbox.map((item) => (
              <li
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="font-semibold text-gray-800">
                    Leave Request: {item.leave.requested_from} → {item.leave.requested_to}
                  </div>
                  <div>Reason: {item.leave.reason}</div>
                  <div className="text-xs text-gray-500">
                    Requested on: {item.created_at.slice(0, 10)}
                  </div>
                </div>
                <button
                  onClick={() => handleApprove(item.leave.id)}
                  className="mt-3 sm:mt-0 sm:ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm shadow"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
};

export default InboxPage;
