import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../lib/apiClient";

interface LeaveRequest {
  id: number;
  reason: string;
  status: string;
  requested_from: string;
  requested_to: string;
  created_at: string;
}

const LeaveTab: React.FC = () => {
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
    const map: Record<string, string> = {
      pending_leader: "warning",
      pending_manager: "primary",
      approved: "success",
      rejected: "danger",
    };
    return (
      <span className={`badge bg-${map[status] || "secondary"}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div>
      <h4 className="mb-3">Request Leave</h4>
      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <label className="form-label">From</label>
          <input
            type="date"
            className="form-control"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">To</label>
          <input
            type="date"
            className="form-control"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Reason</label>
          <input
            type="text"
            className="form-control"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Sick leave, family event, etc."
            required
          />
        </div>
        <div className="col-md-2 d-flex align-items-end">
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      <h5 className="mb-2">Your Leave History</h5>
      {error && <div className="alert alert-danger">{error}</div>}
      {requests.length === 0 ? (
        <p>No leave requests found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-sm">
            <thead className="table-light">
              <tr>
                <th>Date From</th>
                <th>Date To</th>
                <th>Status</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.requested_from}</td>
                  <td>{req.requested_to}</td>
                  <td>{renderStatusBadge(req.status)}</td>
                  <td>{req.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveTab;
