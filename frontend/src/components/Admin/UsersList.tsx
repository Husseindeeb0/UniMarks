import { useState } from "react";
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from "../../state/services/userAPI";
import { Users, GraduationCap, School, Trash2, ArrowRight, Loader2, Edit2, Check, X } from "lucide-react";
import type { UserType } from "../../types";

interface UsersListProps {
  onManageStudentCourses: (student: UserType) => void;
  onManageTeacherCourses: (teacher: UserType) => void;
}

const UsersList = ({ onManageStudentCourses, onManageTeacherCourses }: UsersListProps) => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Editing state
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
        Failed to load users. Please refresh the page.
      </div>
    );
  }

  const students = users?.filter((u) => u.role === "STUDENT") || [];
  const teachers = users?.filter((u) => u.role === "TEACHER") || [];

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      try {
        await deleteUser(id as any).unwrap();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const startEdit = (user: UserType) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
  };

  const handleUpdate = async (id: string) => {
    if (!editName || !editEmail) return;
    try {
      await updateUser({ id: id as any, name: editName, email: editEmail }).unwrap();
      setEditingUserId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">User Management</h3>
          <p className="text-xs text-gray-500">Manage, enroll and assign teachers/students to courses</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Students */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h4 className="font-bold text-gray-800">Students</h4>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
              {students.length} Total
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {students.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No students registered yet.</p>
            ) : (
              students.map((student) => (
                <div
                  key={student.id}
                  className="p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-gray-100 hover:shadow-sm transition-all duration-200"
                >
                  {editingUserId === student.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Email"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleUpdate(student.id)}
                          disabled={isUpdating}
                          className="p-1 text-green-600 bg-green-50 hover:bg-green-100 rounded-md cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{student.name}</p>
                        <p className="text-xs text-gray-500 truncate">{student.email}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => onManageStudentCourses(student)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>Enroll</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => startEdit(student)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Teachers */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-3">
            <div className="flex items-center space-x-2">
              <School className="w-5 h-5 text-indigo-600" />
              <h4 className="font-bold text-gray-800">Teachers</h4>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full">
              {teachers.length} Total
            </span>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
            {teachers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">No teachers registered yet.</p>
            ) : (
              teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-white hover:border-gray-100 hover:shadow-sm transition-all duration-200"
                >
                  {editingUserId === teacher.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Name"
                      />
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Email"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleUpdate(teacher.id)}
                          disabled={isUpdating}
                          className="p-1 text-green-600 bg-green-50 hover:bg-green-100 rounded-md cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1 text-red-600 bg-red-50 hover:bg-red-100 rounded-md cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{teacher.name}</p>
                        <p className="text-xs text-gray-500 truncate">{teacher.email}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => onManageTeacherCourses(teacher)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>Assign</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => startEdit(teacher)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id, teacher.name)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;

