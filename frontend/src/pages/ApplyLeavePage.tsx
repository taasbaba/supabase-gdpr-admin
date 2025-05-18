import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../lib/apiClient";
import DashboardLayout from "../components/DashboardLayout";

interface LeaveRequest {
  id: number;
  reason: string;
  status: string;
  requested_from: string;
  requested_to: string;
  created_at: string;
}

const ApplyLeavePage: React.FC = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyLeaveRequests = async () => {
    try {
      const data = await fetchWithToken("/leave-request/my");
      setRequests(data);
    } catch (err: any) {
      setError(err.message || "Failed to load leave history.");
    }
  };

  useEffect(() => {
    fetchMyLeaveRequests();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to || !reason.trim()) return;

    try {
      setSubmitting(true);
      await fetchWithToken("/leave-request", "POST", {
        requested_from: from,
        requested_to: to,
        reason,
      });
      setFrom("");
      setTo("");
      setReason("");
      fetchMyLeaveRequests(); // refresh
    } catch (err: any) {
      alert(err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      pending_leader: "bg-yellow-100 text-yellow-800",
      pending_manager: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };

    const className = statusMap[status] || "bg-gray-100 text-gray-800";

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded ${className}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <DashboardLayout title="Apply Leave">
      <div className="space-y-10 px-4 sm:px-8">
        <section>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Request Leave</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-6 rounded shadow"
          >
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">From</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">To</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-100"
              />
            </div>
            <div className="sm:col-span-1 sm:col-start-1 sm:col-end-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Reason</label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Sick leave, family event, etc."
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-100"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Leave History</h3>
          {error && <div className="text-red-600 mb-4">{error}</div>}

          {requests.length === 0 ? (
            <p className="text-gray-500">No leave requests found.</p>
          ) : (
            <div className="overflow-x-auto rounded border border-gray-200 shadow-sm bg-white">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Date From</th>
                    <th className="px-4 py-3 text-left font-semibold">Date To</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{req.requested_from}</td>
                      <td className="px-4 py-2">{req.requested_to}</td>
                      <td className="px-4 py-2">{renderStatusBadge(req.status)}</td>
                      <td className="px-4 py-2">{req.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default ApplyLeavePage;
