import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLogoutMutation } from "../../state/services/authAPI";
import {
  GraduationCap,
  Users,
  School,
  BookOpen,
  UserPlus,
  ClipboardList,
  LogOut,
  Loader2,
} from "lucide-react";

interface DashboardSidebarProps {
  onClose?: () => void;
}

const DashboardSidebar = ({ onClose }: DashboardSidebarProps) => {
  const { user } = useAuth();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navItems = [
    {
      to: "/admin/students",
      label: "Students",
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      to: "/admin/teachers",
      label: "Teachers",
      icon: School,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      to: "/admin/courses",
      label: "Courses",
      icon: BookOpen,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      to: "/admin/enrollment",
      label: "Enrollment",
      icon: UserPlus,
      color: "text-amber-600 bg-amber-50",
    },
    {
      to: "/admin/assignments",
      label: "Assignments",
      icon: ClipboardList,
      color: "text-rose-600 bg-rose-50",
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-50 flex items-center space-x-3">
        <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md shadow-blue-100">
          <GraduationCap className="w-6 h-6" />
        </div>
        <span className="text-xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          UniMarks Admin
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Footer */}
      <div className="p-4 border-t border-gray-50 bg-gray-50/50 space-y-4">
        {user && (
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {user.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user.name || "Administrator"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 border border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:text-red-600 hover:border-red-200 focus:outline-none transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
