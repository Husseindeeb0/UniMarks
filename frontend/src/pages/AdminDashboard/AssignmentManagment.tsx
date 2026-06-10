import { useState } from "react";
import { useGetUsersQuery } from "../../state/services/userAPI";
import { useGetCoursesQuery } from "../../state/services/courseAPI";
import {
  useGetTeacherCoursesQuery,
  useAssignTeacherMutation,
  useUnassignTeacherMutation,
} from "../../state/services/teacherCourseAPI";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import {
  Plus,
  Trash2,
  Check,
  ClipboardList,
  Search,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Loader from "../../components/Loader";
import type { UserType } from "../../types";

const AssignmentManagement = () => {
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useGetUsersQuery();

  const [selectedTeacher, setSelectedTeacher] = useState<UserType | null>(null);
  const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery(undefined, { skip: !selectedTeacher });

  const teacherId = selectedTeacher ? Number(selectedTeacher.id) : null;
  const [teacherSearch, setTeacherSearch] = useState("");
  const [assignedSearch, setAssignedSearch] = useState("");
  const [catalogSearch, setCatalogSearch] = useState("");

  // Fetch assigned courses for the selected teacher
  const { data: assignedData, isLoading: assignedLoading } =
    useGetTeacherCoursesQuery(teacherId!, { skip: !teacherId });

  const [assignTeacher, { isLoading: isAssigning }] =
    useAssignTeacherMutation();
  const [unassignTeacher, { isLoading: isUnassigning }] =
    useUnassignTeacherMutation();

  const handleAssign = async (courseId: number) => {
    if (!teacherId) return;
    try {
      await assignTeacher({ courseId, teacherId }).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnassign = async (assignmentId: number) => {
    try {
      await unassignTeacher(assignmentId).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  const isAssigned = (courseId: number) => {
    return assignedData?.some((tc) => tc.courseId === courseId);
  };

  const getAssignmentId = (courseId: number) => {
    return assignedData?.find((tc) => tc.courseId === courseId)?.id;
  };

  if (usersLoading) {
    return <Loader />;
  }

  if (usersError) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
        Failed to load teacher/course directory. Please refresh.
      </div>
    );
  }

  const teachers = users?.filter((u) => u.role === "TEACHER") || [];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
    { field: "email", headerName: "Email Address", flex: 1.2, minWidth: 180 },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      sortable: false,
      renderCell: (params) => {
        const teacher = params.row as UserType;
        return (
          <div className="flex items-center h-full">
            <button
              onClick={() => setSelectedTeacher(teacher)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center space-x-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100"
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
        <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
          <ClipboardList className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Teacher Course Assignment
          </h1>
          <p className="text-sm text-gray-500">
            Select an instructor to configure their assigned courses.
          </p>
        </div>
      </div>

      {!selectedTeacher ? (
        /* Directory View */
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              Teachers Directory
            </h3>
            <div className="relative max-w-xs w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search teachers..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors text-sm"
              />
            </div>
          </div>
          <div className="h-[550px] w-full">
            <DataGrid
              rows={teachers.filter((t) => {
                const q = teacherSearch.toLowerCase();
                return (
                  t.name.toLowerCase().includes(q) ||
                  t.email.toLowerCase().includes(q) ||
                  t.id.toString().includes(q)
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
                onClick={() => setSelectedTeacher(null)}
                className="mb-4 flex items-center space-x-1.5 text-sm font-semibold text-gray-500 hover:text-rose-600 transition-colors cursor-pointer w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </button>
              <span className="text-xs font-bold uppercase text-rose-600">
                Assignment Management
              </span>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                {selectedTeacher.name}
              </h2>
              <p className="text-sm text-gray-500">{selectedTeacher.email}</p>
            </div>
          </div>

          {assignedLoading || coursesLoading ? (
            <div className="h-[400px] relative">
               <Loader />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50 pt-6">
              {/* Current Assignments */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-800 flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span>Assigned Courses ({assignedData?.length || 0})</span>
                  </h4>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search assigned courses..."
                    value={assignedSearch}
                    onChange={(e) => setAssignedSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-colors text-sm bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {assignedData?.length === 0 ? (
                    <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                      <p className="text-sm italic text-gray-500">
                        No assigned courses yet.
                      </p>
                    </div>
                  ) : (
                    assignedData?.filter(tc => {
                      const q = assignedSearch.toLowerCase();
                      return tc.course?.name?.toLowerCase().includes(q) || tc.course?.code?.toLowerCase().includes(q);
                    }).map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-red-100 transition-colors group"
                      >
                        <div className="min-w-0 pr-4">
                          <span className="block text-[10px] font-bold text-green-700 uppercase mb-0.5">
                            {assignment.course?.code}
                          </span>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {assignment.course?.name}
                          </p>
                        </div>
                        <button
                          onClick={() => handleUnassign(assignment.id)}
                          disabled={isUnassigning}
                          className="p-2 bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg transition-all cursor-pointer shadow-sm"
                          title="Unassign Teacher"
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
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
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
                    className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors text-sm bg-gray-50 focus:bg-white"
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
                      const assigned = isAssigned(course.id);
                      const assignmentId = getAssignmentId(course.id);

                      return (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-rose-200 transition-colors"
                        >
                          <div className="min-w-0 pr-4">
                            <span className="block text-[10px] font-bold text-gray-500 uppercase mb-0.5">
                              {course.code}
                            </span>
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {course.name}
                            </p>
                          </div>

                          {assigned ? (
                            <button
                              onClick={() =>
                                assignmentId && handleUnassign(assignmentId)
                              }
                              disabled={isUnassigning}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-700 rounded-lg border border-green-100 hover:border-red-200 text-xs font-bold cursor-pointer transition-all shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Assigned</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAssign(course.id)}
                              disabled={isAssigning}
                              className="flex items-center space-x-1 px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-rose-700 hover:shadow-md transition-all shadow-sm"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Assign</span>
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

export default AssignmentManagement;
