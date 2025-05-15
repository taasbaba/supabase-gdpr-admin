import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AuthGuard from "../components/AuthGuard";
import TabBar from "../components/TabBar";
import ProfileTab from "../components/ProfileTab";
import AdminTab from "../components/AdminTab";
import TokenTab from "../components/TokenTab";
import AttendanceTab from "../components/AttendanceTab";
import LeaveTab from "../components/LeaveTab";
import InboxTab from "../components/InboxTab";
import { fetchWithToken } from "../lib/apiClient";

const DashboardPage = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<
    "profile" | "attendance" | "leave" | "inbox" | "admin" | "token"
  >("profile");
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user?.email ?? null);
      console.log("JWT Token:", data.session?.access_token);

      try {
        const profile = await fetchWithToken("/me/profile");
        setRole(profile.role);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    init();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <AuthGuard>
      <div className="app-bg">
        <div className="container-fluid min-vh-100 d-flex flex-column align-items-center py-4 px-2">
          <div className="w-100" style={{ maxWidth: "960px" }}>
            <div className="bg-white shadow-sm rounded p-3 mb-3 border">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                <h2 className="mb-0 text-break">🎉 Welcome {email}</h2>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="mb-3">
              <TabBar active={tab} onChange={setTab} role={role} />
            </div>

            <div className="bg-white shadow rounded p-4 border">
              {tab === "profile" && <ProfileTab />}
              {tab === "attendance" && <AttendanceTab role={role} />}
              {tab === "leave" && <LeaveTab />}
              {tab === "inbox" && (role === "leader" || role === "manager") && (
                <InboxTab />
              )}
              {tab === "admin" && role !== "member" && <AdminTab role={role} />}
              {tab === "token" && <TokenTab />}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;
