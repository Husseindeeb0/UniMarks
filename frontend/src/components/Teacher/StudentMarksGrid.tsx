import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Search, Award, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { useGetCourseStudentsQuery } from "../../state/services/courseEnrollmentAPI";
import Loader from "../Loader";

interface StudentRow {
  id: number;
  name: string;
  email: string;
  score: number | null;
  markId: number | null;
  enrollmentId: number;
}

interface StudentMarksGridProps {
  course: any;
  studentSearch: string;
  setStudentSearch: (val: string) => void;
  onEditMark: (student: StudentRow) => void;
  onDeleteMark: (name: string, markId: number) => void;
  isDeleting: boolean;
  onBack: () => void;
}

const StudentMarksGrid = ({
  course,
  studentSearch,
  setStudentSearch,
  onEditMark,
  onDeleteMark,
  isDeleting,
  onBack,
}: StudentMarksGridProps) => {
  const { data: enrollments = [], isLoading } = useGetCourseStudentsQuery(course.id);



  // Map enrollments to local rows
  const rows: StudentRow[] = enrollments.map((e: any) => {
    const student = e.student;
    const mark = student?.marks?.find((m: any) => m.courseId === course.id);
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      score: mark ? mark.score : null,
      markId: mark ? mark.id : null,
      enrollmentId: e.id,
    };
  });

  // Filter rows based on search input
  const filteredRows = rows.filter((r) => {
    const search = studentSearch.toLowerCase();
    return (
      r.name.toLowerCase().includes(search) ||
      r.email.toLowerCase().includes(search) ||
      r.id.toString().includes(search)
    );
  });

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Student Name", flex: 1, minWidth: 120 },
    { field: "email", headerName: "Email Address", flex: 1.1, minWidth: 150 },
    {
      field: "score",
      headerName: "Grade",
      width: 140,
      renderCell: (params) => {
        const score = params.value;
        if (score === null) {
          return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-400 italic">
              Not Graded
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-green-50 text-green-700">
            <Award className="w-3.5 h-3.5 mr-1 text-green-600" />
            {score} / 100
          </span>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      renderCell: (params) => {
        const row = params.row as StudentRow;
        return (
          <div className="flex items-center space-x-2 h-full">
            <button
              onClick={() => onEditMark(row)}
              className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all cursor-pointer"
              title={row.markId ? "Edit Grade" : "Add Grade"}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            {row.markId && (
              <button
                onClick={() => onDeleteMark(row.name, row.markId!)}
                disabled={isDeleting}
                className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all cursor-pointer disabled:opacity-50"
                title="Delete Grade"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-50 pb-4">
        <div>
          <button
            onClick={onBack}
            className="mb-4 flex items-center space-x-1.5 text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Classes</span>
          </button>
          <span className="inline-block text-[10px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded uppercase tracking-wider mb-1">
            {course.code}
          </span>
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            {course.name}
          </h3>
          <p className="text-xs text-gray-500">
            Manage student marks and grades
          </p>
        </div>

        {/* Student Search */}
        <div className="relative max-w-xs w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search students..."
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm"
          />
        </div>
      </div>

      <div className="h-[400px] w-full relative">
        {isLoading ? (
          <div className="absolute inset-0 z-10 flex rounded-xl">
             <Loader />
          </div>
        ) : null}
        <DataGrid
          rows={filteredRows}
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

export default StudentMarksGrid;
