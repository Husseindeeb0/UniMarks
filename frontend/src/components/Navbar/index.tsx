import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLogoutMutation } from "../../state/services/authAPI";
import { GraduationCap, LogIn, LogOut, Loader2 } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo & Icon */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-md shadow-blue-200 group-hover:bg-blue-700 transition-all duration-300 transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              UniMarks
            </span>
          </Link>

          {/* Right: Auth Action */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {user && (
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {user.role}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {user.name || user.email}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:text-red-600 hover:border-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition-all duration-200 cursor-pointer"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-red-500" />
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
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;