import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Edit2, Trash2, Search } from "lucide-react";
import type { UserType } from "../../types";

interface UsersGridProps {
  users: UserType[];
  accentColor?: "blue" | "indigo";
  onEdit: (user: UserType) => void;
  onDelete: (id: string, name: string) => void;
}

const UsersGrid = ({
  users,
  accentColor = "blue",
  onEdit,
  onDelete,
}: UsersGridProps) => {
  const [search, setSearch] = useState("");

  const hoverColor =
    accentColor === "indigo"
      ? "hover:text-indigo-600 hover:bg-indigo-50"
      : "hover:text-blue-600 hover:bg-blue-50";

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.id.toString().includes(q)
    );
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email Address", flex: 1.2, minWidth: 200 },
    {
      field: "createdAt",
      headerName: "Registered Date",
      width: 180,
      valueGetter: (value) => {
        if (!value) return "N/A";
        return new Date(value).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const user = params.row as UserType;
        return (
          <div className="flex items-center space-x-2 h-full">
            <button
              onClick={() => onEdit(user)}
              className={`p-1.5 text-gray-400 rounded-lg transition-all cursor-pointer ${hoverColor}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(user.id, user.name)}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 overflow-hidden">
      {/* Search Bar */}
      <div className="relative max-w-xs">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
        />
      </div>

      <div className="h-[500px] w-full">
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          className="border-none"
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f9fafb",
              borderBottom: "1px solid #f3f4f6",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f9fafb",
            },
          }}
        />
      </div>
    </div>
  );
};

export default UsersGrid;
