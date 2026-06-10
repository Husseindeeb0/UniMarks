import { useState } from "react";
import {
  useGetCoursesQuery,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
} from "../../state/services/courseAPI";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Dialog } from "@mui/material";
import { Trash2, Edit2, BookOpen, Plus, Search } from "lucide-react";
import Loader from "../../components/Loader";
import CreateCourseForm from "../../components/Admin/CourseForm";

const CourseManagement = () => {
  const {
    data: courses,
    isLoading,
    error,
  } = useGetCoursesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteCourse] = useDeleteCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Edit Modal State
  const [editCourse, setEditCourse] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");

  // Search State
  const [courseSearch, setCourseSearch] = useState("");

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
        Failed to load courses. Please refresh the page.
      </div>
    );
  }

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete course "${name}"?`)) {
      try {
        await deleteCourse(id).unwrap();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditOpen = (course: any) => {
    setEditCourse(course);
    setEditName(course.name);
    setEditCode(course.code);
  };

  const handleEditClose = () => {
    setEditCourse(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourse || !editName || !editCode) return;

    try {
      await updateCourse({
        id: editCourse.id,
        name: editName,
        code: editCode,
      }).unwrap();
      handleEditClose();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "code",
      headerName: "Course Code",
      width: 150,
      renderCell: (params) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider">
          {params.value}
        </span>
      ),
    },
    { field: "name", headerName: "Course Name", flex: 1.2, minWidth: 200 },
    {
      field: "teachers",
      headerName: "Assigned Instructors",
      flex: 1,
      minWidth: 200,
      valueGetter: (_, row) => {
        const teachers =
          row.teacherCourses?.map((tc: any) => tc.teacher?.name) || [];
        return teachers.length > 0 ? teachers.join(", ") : "None";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const course = params.row;
        return (
          <div className="flex items-center space-x-2 h-full">
            <button
              onClick={() => handleEditOpen(course)}
              className="p-1.5 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-all cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(course.id, course.name)}
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Courses Catalog</h1>
            <p className="text-sm text-gray-500">
              View and manage the university course offerings.
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md shadow-emerald-100 hover:shadow-lg transition-all duration-200 cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Create Course</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name or code..."
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
          />
        </div>
        <div className="h-[500px] w-full">
          <DataGrid
            rows={(courses || []).filter((c) => {
              const q = courseSearch.toLowerCase();
              return (
                c.name.toLowerCase().includes(q) ||
                c.code.toLowerCase().includes(q)
              );
            })}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
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

      <Dialog
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <CreateCourseForm />
      </Dialog>

      {/* Edit Course Modal */}
      <Dialog
        open={!!editCourse}
        onClose={handleEditClose}
        maxWidth="xs"
        fullWidth
      >
        <div className="font-bold text-gray-900 text-lg border-b border-gray-50 px-6 py-4">
          Edit Course Details
        </div>
        <form onSubmit={handleUpdate} className="space-y-4 p-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Course Code
            </label>
            <input
              type="text"
              required
              value={editCode}
              onChange={(e) => setEditCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm uppercase"
              placeholder="e.g. CS-101"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Course Name
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors text-sm"
              placeholder="Course Name"
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
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-100 transition-all cursor-pointer disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default CourseManagement;
