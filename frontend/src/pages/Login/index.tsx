import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../state/services/authAPI";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (user.role === "TEACHER") {
        navigate("/teacher", { replace: true });
      } else if (user.role === "STUDENT") {
        navigate("/", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    setLoginError("");

    if (!email || !password) {
      setValidationError("Please fill in all fields.");
      return;
    }

    try {
      await loginMutation({ email, password }).unwrap();
      // Auth tag invalidation will auto-refetch checkAuth,
      // and the useEffect above will handle navigation based on role.
    } catch (err: any) {
      console.error("Login failed:", err);
      setLoginError(err?.data?.message || "Invalid credentials or server error.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Sign in to UniMarks
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your courses, marks, and dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {validationError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
              {validationError}
            </div>
          )}
          {loginError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
              {loginError}
            </div>
          )}
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;