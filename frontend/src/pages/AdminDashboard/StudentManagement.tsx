import { useState } from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../state/services/userAPI";
import { Dialog } from "@mui/material";
import { UserPlus, Users } from "lucide-react";
import Loader from "../../components/Loader";
import CreateUserForm from "../../components/Admin/UserForm";
import UsersGrid from "../../components/Admin/UsersGrid";
import type { UserType } from "../../types";

const StudentManagement = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Edit Modal State
  const [editUser, setEditUser] = useState<UserType | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
        Failed to load students. Please refresh the page.
      </div>
    );
  }

  const students = users?.filter((u) => u.role === "STUDENT") || [];

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete student "${name}"?`)) {
      try {
        await deleteUser(id as any).unwrap();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditOpen = (user: UserType) => {
    setEditUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  const handleEditClose = () => {
    setEditUser(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser || !editName || !editEmail) return;

    try {
      await updateUser({
        id: editUser.id as any,
        name: editName,
        email: editEmail,
      }).unwrap();
      handleEditClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Students Directory
            </h1>
            <p className="text-sm text-gray-500">
              View, register, edit, and delete student accounts.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-100 hover:shadow-lg transition-all duration-200 cursor-pointer text-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Student</span>
        </button>
      </div>

      {/* Shared Users Grid (with built-in search) */}
      <UsersGrid
        users={students}
        accentColor="blue"
        onEdit={handleEditOpen}
        onDelete={handleDelete}
      />

      {/* Register Student Modal */}
      <Dialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <CreateUserForm fixedRole="STUDENT" />
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog
        open={!!editUser}
        onClose={handleEditClose}
        maxWidth="xs"
        fullWidth
      >
        <div className="font-bold text-gray-900 text-lg border-b border-gray-50 px-6 py-4">
          Edit Student Details
        </div>
        <form onSubmit={handleUpdate} className="space-y-4 p-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
              placeholder="Full Name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
              placeholder="Email Address"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={handleEditClose}
              disabled={isUpdating}
              className="px-4 py-2 border border-gray-200 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-100 transition-all cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default StudentManagement;
