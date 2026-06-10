import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../../components/Admin/DashboardSidebar";
import { Menu, X } from "lucide-react";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50/50 relative">
      {/* Sidebar navigation */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 transition-opacity lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main dashboard content area */}
      <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
          {/* Top Right Toggle Button (Mobile Only) */}
          <div className="flex justify-end mb-6 lg:hidden">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer flex items-center space-x-2"
               title="Toggle Menu"
             >
               <span className="text-sm font-bold">Menu</span>
               {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
             </button>
          </div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
