import React, { useState } from "react";
import { useCreateUserMutation } from "../../state/services/userAPI";
import { UserPlus, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const CreateUserForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"TEACHER" | "STUDENT">("STUDENT");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!name || !email || !password || !role) {
      setErrorMsg("All fields are required.");
      return;
    }

    try {
      await createUser({ name, email, password, role }).unwrap();
      setSuccessMsg(`Successfully created ${role.toLowerCase()} user "${name}"!`);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.data?.message || "Failed to create user. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Create Account</h3>
          <p className="text-xs text-gray-500">Register new students or teachers</p>
        </div>
      </div>

      {successMsg && (
        <div className="mb-4 flex items-center space-x-2 text-sm text-green-700 bg-green-50 p-3 rounded-xl border border-green-100">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-4 flex items-center space-x-2 text-sm text-red-700 bg-red-50 p-3 rounded-xl border border-red-100">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
            placeholder="johndoe@university.edu"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Role
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                role === "STUDENT"
                  ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm shadow-blue-50"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("TEACHER")}
              className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                role === "TEACHER"
                  ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm shadow-blue-50"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Teacher
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-100 hover:shadow-lg transition-all duration-200 disabled:opacity-50 text-sm cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating user...</span>
            </>
          ) : (
            <span>Create User</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
