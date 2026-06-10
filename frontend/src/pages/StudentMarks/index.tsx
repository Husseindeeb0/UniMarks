import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useGetStudentMarksQuery } from "../../state/services/markAPI";
import { useGetEnrolledCoursesQuery } from "../../state/services/courseEnrollmentAPI";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import Loader from "../../components/Loader";
import {
  GraduationCap,
  BookOpen,
  TrendingUp,
  Search,
} from "lucide-react";

const StudentMarks = () => {
  const { user } = useAuth();
  const studentId = Number(user?.id);

  const {
    data: marks,
    isLoading: isMarksLoading,
    error,
  } = useGetStudentMarksQuery(studentId);

  const { data: enrollments, isLoading: isEnrollmentsLoading } =
    useGetEnrolledCoursesQuery(studentId);

  const [courseSearch, setCourseSearch] = useState("");

  if (isMarksLoading || isEnrollmentsLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm max-w-md w-full">
          Failed to load your marks. Please try again later.
        </div>
      </div>
    );
  }

  const validMarks = marks || [];
  const validEnrollments = enrollments || [];

  const averageScore =
    validMarks.length > 0
      ? validMarks.reduce((acc, curr) => acc + curr.score, 0) /
        validMarks.length
      : 0;

  // Prepare grid data combining enrollments and marks
  const rows = validEnrollments.map((enrollment) => {
    const courseMark = validMarks.find(
      (m) => m.course.id === enrollment.course.id
    );
    return {
      id: enrollment.course.id,
      code: enrollment.course.code,
      name: enrollment.course.name,
      score: courseMark ? courseMark.score : null,
    };
  });

  const filteredRows = rows.filter((r) => {
    const search = courseSearch.toLowerCase();
    return (
      r.code.toLowerCase().includes(search) ||
      r.name.toLowerCase().includes(search)
    );
  });

  const columns: GridColDef[] = [
    {
      field: "code",
      headerName: "Course Code",
      width: 130,
      renderCell: (params) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-700 uppercase tracking-wider">
          {params.value}
        </span>
      ),
    },
    {
      field: "name",
      headerName: "Course Name",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <span className="font-semibold text-gray-800">{params.value}</span>
      ),
    },
    {
      field: "score",
      headerName: "Final Score",
      width: 150,
      renderCell: (params) => {
        const score = params.value;
        if (score === null || score === undefined) {
          return (
            <div className="flex items-center h-full">
              <span className="text-gray-400 font-medium italic text-sm">
                Pending
              </span>
            </div>
          );
        }
        return (
          <div className="flex items-center h-full">
            <div className="flex items-baseline space-x-1">
              <span className="text-lg font-extrabold text-gray-900">
                {score}
              </span>
              <span className="text-xs font-medium text-gray-500">/ 100</span>
            </div>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      sortable: false,
      renderCell: (params) => {
        const score = params.row.score;
        if (score === null || score === undefined) {
          return (
            <div className="flex items-center h-full">
              <div className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
                Pending
              </div>
            </div>
          );
        }

        let statusClass = "bg-red-100 text-red-700 border-red-200";
        let statusText = "Fail";

        if (score >= 90) {
          statusClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
          statusText = "Excellent";
        } else if (score >= 70) {
          statusClass = "bg-blue-100 text-blue-700 border-blue-200";
          statusText = "Good";
        } else if (score >= 50) {
          statusClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
          statusText = "Pass";
        }

        return (
          <div className="flex items-center h-full">
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold border ${statusClass}`}
            >
              {statusText}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-100 py-8 shadow-xs mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                <span>My Academic Record</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome, <strong className="text-gray-700">{user?.name}</strong>
                . Here are your official course marks.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex space-x-4 sm:space-x-6">
              <div className="bg-blue-50/50 border border-blue-100/50 p-3.5 rounded-2xl flex items-center space-x-3">
                <div className="p-2 bg-blue-100/70 text-blue-700 rounded-xl hidden sm:block">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-600/80 uppercase tracking-wider">
                    Courses Graded
                  </p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {validMarks.length}
                  </p>
                </div>
              </div>
              <div className="bg-indigo-50/50 border border-indigo-100/50 p-3.5 rounded-2xl flex items-center space-x-3">
                <div className="p-2 bg-indigo-100/70 text-indigo-700 rounded-xl hidden sm:block">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-indigo-600/80 uppercase tracking-wider">
                    Average Score
                  </p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {averageScore.toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Enrolled Courses
                </h3>
                <p className="text-xs text-gray-500">
                  View your final grades for all your registered classes.
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
                className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm"
              />
            </div>
          </div>

          <div className="h-[550px] w-full">
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
      </div>
    </div>
  );
};

export default StudentMarks;
