import { useState } from "react";
import { useAddMarkMutation, useUpdateMarkMutation, useDeleteMarkMutation } from "../../state/services/markAPI";
import { ArrowLeft, Edit2, Check, X, Award, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

interface StudentMarksManagerProps {
  course: any;
  onBack: () => void;
}

const StudentMarksManager = ({ course, onBack }: StudentMarksManagerProps) => {
  const [addMark, { isLoading: isAdding }] = useAddMarkMutation();
  const [updateMark, { isLoading: isUpdating }] = useUpdateMarkMutation();
  const [deleteMark, { isLoading: isDeleting }] = useDeleteMarkMutation();

  // Active inline editor state
  const [editingStudentId, setEditingStudentId] = useState<number | null>(null);
  const [scoreInput, setScoreInput] = useState("");
  const [activeMarkId, setActiveMarkId] = useState<number | null>(null);

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const enrollments = course?.courseEnrollments || [];

  const handleSave = async (studentId: number) => {
    const scoreVal = parseFloat(scoreInput);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      setErrorMsg("Please enter a valid mark score between 0 and 100.");
      return;
    }

    setSuccessMsg("");
    setErrorMsg("");

    try {
      if (activeMarkId) {
        // Edit mode
        await updateMark({ markId: activeMarkId, score: scoreVal }).unwrap();
        setSuccessMsg("Mark updated successfully!");
      } else {
        // Add mode
        await addMark({ courseId: course.id, studentId, score: scoreVal }).unwrap();
        setSuccessMsg("Mark added successfully!");
      }
      setEditingStudentId(null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.data?.message || "Failed to save mark. Please try again.");
    }
  };

  const startEdit = (studentId: number, currentMark: any) => {
    setEditingStudentId(studentId);
    if (currentMark) {
      setScoreInput(currentMark.score.toString());
      setActiveMarkId(currentMark.id);
    } else {
      setScoreInput("");
      setActiveMarkId(null);
    }
  };

  const cancelEdit = () => {
    setEditingStudentId(null);
    setScoreInput("");
    setActiveMarkId(null);
  };

  const handleDeleteMark = async (markId: number) => {
    if (window.confirm("Are you sure you want to delete this student's mark?")) {
      setSuccessMsg("");
      setErrorMsg("");
      try {
        await deleteMark(markId).unwrap();
        setSuccessMsg("Mark deleted successfully.");
      } catch (err: any) {
        setErrorMsg(err?.data?.message || "Failed to delete mark.");
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="inline-block text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded uppercase tracking-wider mb-1">
              {course.code}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{course.name}</h3>
            <p className="text-xs text-gray-500">Manage student marks and grades</p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 p-3 rounded-xl border border-green-100">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center space-x-2 text-sm text-red-700 bg-red-50 p-3 rounded-xl border border-red-100">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Students Directory */}
      <div className="space-y-4">
        <h4 className="font-bold text-gray-800 text-sm">Enrolled Students List</h4>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-3 px-4 rounded-l-xl">Student Details</th>
                <th className="py-3 px-4">Score / Grade</th>
                <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {enrollments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-gray-400">
                    No students are enrolled in this course yet.
                  </td>
                </tr>
              ) : (
                enrollments.map((enrollment: any) => {
                  const student = enrollment.student;
                  const currentCourseMark = student?.marks?.find((m: any) => m.courseId === course.id);
                  const isEditing = editingStudentId === student.id;

                  return (
                    <tr key={enrollment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={scoreInput}
                              onChange={(e) => setScoreInput(e.target.value)}
                              className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                              placeholder="0 - 100"
                              required
                            />
                            <span className="text-xs text-gray-400">/ 100</span>
                          </div>
                        ) : currentCourseMark ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700">
                            <Award className="w-3.5 h-3.5 mr-1" />
                            {currentCourseMark.score}
                          </span>
                        ) : (
                          <span className="text-xs italic text-gray-400">No mark entered</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {isEditing ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleSave(student.id)}
                              disabled={isAdding || isUpdating}
                              className="inline-flex items-center p-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
                            >
                              {(isAdding || isUpdating) ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="inline-flex items-center p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => startEdit(student.id, currentCourseMark)}
                              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium text-xs transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>{currentCourseMark ? "Edit Mark" : "Add Mark"}</span>
                            </button>
                            {currentCourseMark && (
                              <button
                                onClick={() => handleDeleteMark(currentCourseMark.id)}
                                disabled={isDeleting}
                                className="inline-flex items-center p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentMarksManager;
