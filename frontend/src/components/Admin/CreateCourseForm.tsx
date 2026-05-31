import React, { useState } from "react";
import { useAddCourseMutation } from "../../state/services/courseAPI";
import { BookOpen, Loader2, CheckCircle, AlertCircle } from "lucide-react";

const CreateCourseForm = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [addCourse, { isLoading }] = useAddCourseMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!name || !code) {
      setErrorMsg("All fields are required.");
      return;
    }

    try {
      await addCourse({ name, code }).unwrap();
      setSuccessMsg(`Successfully created course "${name}" (${code})!`);
      setName("");
      setCode("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.data?.message || "Failed to create course. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Create Course</h3>
          <p className="text-xs text-gray-500">Add a new course to the catalog</p>
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
            Course Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
            placeholder="Introduction to Computer Science"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Course Code
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
            placeholder="CS-101"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-100 hover:shadow-lg transition-all duration-200 disabled:opacity-50 text-sm cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating course...</span>
            </>
          ) : (
            <span>Create Course</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateCourseForm;
