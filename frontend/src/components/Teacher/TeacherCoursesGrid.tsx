import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Library, Search, Users, ArrowRight } from "lucide-react";

interface TeacherCoursesGridProps {
  teacherCourses: any[];
  courseSearch: string;
  setCourseSearch: (val: string) => void;
  selectedCourseId: number | null;
  onSelectCourse: (course: any) => void;
}

const TeacherCoursesGrid = ({
  teacherCourses,
  courseSearch,
  setCourseSearch,
  selectedCourseId,
  onSelectCourse,
}: TeacherCoursesGridProps) => {
  // Filter courses based on query
  const filteredCourses = teacherCourses.filter((tc) => {
    const search = courseSearch.toLowerCase();
    const code = (tc.course?.code || "").toLowerCase();
    const name = (tc.course?.name || "").toLowerCase();
    return code.includes(search) || name.includes(search);
  });

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Course Code",
      width: 130,
      valueGetter: (_, row) => row.course?.code,
      renderCell: (params) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider">
          {params.value}
        </span>
      ),
    },
    {
      field: "name",
      headerName: "Course Name",
      flex: 1,
      minWidth: 150,
      valueGetter: (_, row) => row.course?.name,
    },
    {
      field: "studentsCount",
      headerName: "Enrolled",
      width: 130,
      valueGetter: (_, row) => row.course?._count?.courseEnrollments || 0,
      renderCell: (params) => (
        <div className="flex items-center space-x-1.5 h-full">
          <Users className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-600 font-medium">{params.value}</span>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const course = params.row.course;
        const isSelected = selectedCourseId === course?.id;
        return (
          <div className="flex items-center h-full">
            <button
              onClick={() => onSelectCourse(course)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1 ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              }`}
            >
              <span>{isSelected ? "Managing" : "Select"}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Library className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Your Classes</h3>
            <p className="text-xs text-gray-500">
              Select a class to manage student marks.
            </p>
          </div>
        </div>

        {/* Course Search */}
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Filter courses..."
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
          />
        </div>
      </div>

      <div className="h-[450px] w-full">
        <DataGrid
          rows={filteredCourses}
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
  );
};

export default TeacherCoursesGrid;
