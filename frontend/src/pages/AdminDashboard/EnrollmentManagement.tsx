import { useState } from "react";
import { useGetUsersQuery } from "../../state/services/userAPI";
import { useGetCoursesQuery } from "../../state/services/courseAPI";
import {
  useGetEnrolledCoursesQuery,
  useEnrollStudentMutation,
  useUnenrollStudentMutation,
} from "../../state/services/courseEnrollmentAPI";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  Plus,
  Trash2,
  Check,
  UserPlus,
  Search,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Loader from "../../components/Loader";
import type { UserType } from "../../types";

const EnrollmentManagement = () => {
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useGetUsersQuery();

  const [selectedStudent, setSelectedStudent] = useState<UserType | null>(null);
  const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery(undefined, { skip: !selectedStudent });

  const studentId = selectedStudent ? Number(selectedStudent.id) : null;
  const [studentSearch, setStudentSearch] = useState("");
  const [enrolledSearch, setEnrolledSearch] = useState("");
  const [catalogSearch, setCatalogSearch] = useState("");

  // Fetch enrolled courses for the selected student
  const { data: enrolledData, isLoading: enrolledLoading } =
    useGetEnrolledCoursesQuery(studentId!, { skip: !studentId });

  const [enrollStudent, { isLoading: isEnrolling }] =
    useEnrollStudentMutation();
  const [unenrollStudent, { isLoading: isUnenrolling }] =
    useUnenrollStudentMutation();

  const handleEnroll = async (courseId: number) => {
    if (!studentId) return;
    try {
      await enrollStudent({ courseId, studentId }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnenroll = async (enrollmentId: number) => {
    try {
      await unenrollStudent(enrollmentId).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const isEnrolled = (courseId: number) => {
    return enrolledData?.some((e) => e.courseId === courseId);
  };

  const getEnrollmentId = (courseId: number) => {
    return enrolledData?.find((e) => e.courseId === courseId)?.id;
  };

  if (usersLoading) {
    return <Loader />;
  }

  if (usersError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
        Failed to load student/course directory. Please refresh.
      </div>
    );
  }

  const students = users?.filter((u) => u.role === "STUDENT") || [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email Address", flex: 1.2, minWidth: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        const student = params.row as UserType;
        return (
          <div className="flex items-center h-full">
            <button
              onClick={() => setSelectedStudent(student)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center space-x-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100"
            >
              <span>Manage Courses</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center space-x-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
          <UserPlus className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Student Course Enrollment
          </h1>
          <p className="text-sm text-gray-500">
            Select a student to manage their active course enrollments.
          </p>
        </div>
      </div>

      {!selectedStudent ? (
        /* Directory View */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              Students Directory
            </h3>
            <div className="relative max-w-xs w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors text-sm"
              />
            </div>
          </div>
          <div className="h-[550px] w-full">
            <DataGrid
              rows={students.filter((s) => {
                const q = studentSearch.toLowerCase();
                return (
                  s.name.toLowerCase().includes(q) ||
                  s.email.toLowerCase().includes(q) ||
                  s.id.toString().includes(q)
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
      ) : (
        /* Management Panel View */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="mb-4 flex items-center space-x-1.5 text-sm font-semibold text-gray-500 hover:text-amber-600 transition-colors cursor-pointer w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </button>
              <span className="text-xs font-bold uppercase text-amber-600">
                Enrollment Management
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                {selectedStudent.name}
              </h2>
              <p className="text-sm text-gray-500">{selectedStudent.email}</p>
            </div>
          </div>

          {enrolledLoading || coursesLoading ? (
            <div className="h-[400px] relative">
               <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50 pt-6">
              {/* Current Enrollments */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span>Enrolled Courses ({enrolledData?.length || 0})</span>
                  </h4>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search enrolled courses..."
                    value={enrolledSearch}
                    onChange={(e) => setEnrolledSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors text-sm bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {enrolledData?.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                      <p className="text-sm italic text-gray-500">
                        No enrolled courses yet.
                      </p>
                    </div>
                  ) : (
                    enrolledData?.filter(e => {
                      const q = enrolledSearch.toLowerCase();
                      return e.course?.name?.toLowerCase().includes(q) || e.course?.code?.toLowerCase().includes(q);
                    }).map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-red-100 transition-colors group"
                      >
                        <div className="min-w-0 pr-4">
                          <span className="block text-[10px] font-bold text-green-700 uppercase mb-0.5">
                            {enrollment.course?.code}
                          </span>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {enrollment.course?.name}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnenroll(enrollment.id)}
                          disabled={isUnenrolling}
                          className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all cursor-pointer shadow-sm"
                          title="Unenroll Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Available Courses */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span>Course Catalog</span>
                  </h4>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search course catalog..."
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {courses?.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                      <p className="text-sm italic text-gray-500">
                        No courses available in catalog.
                      </p>
                    </div>
                  ) : (
                    courses?.filter(c => {
                      const q = catalogSearch.toLowerCase();
                      return c.name?.toLowerCase().includes(q) || c.code?.toLowerCase().includes(q);
                    }).map((course) => {
                      const enrolled = isEnrolled(course.id);
                      const enrollmentId = getEnrollmentId(course.id);

                      return (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-200 transition-colors"
                        >
                          <div className="min-w-0 pr-4">
                            <span className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">
                              {course.code}
                            </span>
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {course.name}
                            </p>
                          </div>

                          {enrolled ? (
                            <button
                              onClick={() =>
                                enrollmentId && handleUnenroll(enrollmentId)
                              }
                              disabled={isUnenrolling}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-700 rounded-lg border border-green-100 hover:border-red-200 text-xs font-bold cursor-pointer transition-all shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Enrolled</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEnroll(course.id)}
                              disabled={isEnrolling}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-blue-700 hover:shadow-md transition-all shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Enroll</span>
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnrollmentManagement;
