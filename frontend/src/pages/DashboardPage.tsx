import Sidebar from "../components/Sidebar";
import HeaderBar from "../components/HeaderBar";
import MetricCard from "../components/MetricCard";
import AbsenceChart from "../components/AbsenceChart";
import UserProfileCard from "../components/UserProfileCard";
import LeaveTable from "../components/LeaveTable";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-6">
        {/* Header Bar */}
        <HeaderBar title="Workforce Insights" />

        {/* Metrics Section */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Employees" value="120" />
          <MetricCard label="Attendance Rate" value="95%" />
          <MetricCard label="Absences" value="5" />
          <MetricCard label="Leave Requests" value="12" />
        </div>

        {/* Chart and Profile Section */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <AbsenceChart />
          </div>
          <UserProfileCard
            name="John Doe"
            role="Administrator"
          />
        </div>

        {/* Leave Table */}
        <LeaveTable />
      </main>
    </div>
  );
};

export default DashboardPage;
