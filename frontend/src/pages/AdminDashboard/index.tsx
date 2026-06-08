import { Outlet } from "react-router-dom";
import DashboardSidebar from "../../components/Admin/dashboardSidebar";

const AdminDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Sidebar navigation */}
      <DashboardSidebar />

      {/* Main dashboard content area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
