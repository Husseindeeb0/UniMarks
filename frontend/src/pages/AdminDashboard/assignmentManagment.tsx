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
  Loader2,
  BookOpen,
  Plus,
  Trash2,
  Check,
  ClipboardList,
} from "lucide-react";
import type { UserType } from "../../types";

const AssignmentManagement = () => {
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
  } = useGetUsersQuery();
  const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery();

  const [selectedTeacher, setSelectedTeacher] = useState<UserType | null>(null);
  const teacherId = selectedTeacher ? Number(selectedTeacher.id) : null;

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

  if (usersLoading || coursesLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-rose-600" />
      </div>
    );
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
      width: 130,
      sortable: false,
      renderCell: (params) => {
        const teacher = params.row as UserType;
        const isSelected = selectedTeacher?.id === teacher.id;
        return (
          <button
            onClick={() => setSelectedTeacher(teacher)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              isSelected
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            {isSelected ? "Managing" : "Select Teacher"}
          </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Teachers DataGrid */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden">
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">
            Teachers Directory
          </h3>
          <div className="h-[480px] w-full">
            <DataGrid
              rows={teachers}
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

        {/* Right Side: Assignment Panel */}
        <div className="lg:col-span-6 space-y-6">
          {!selectedTeacher ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
              <BookOpen className="w-16 h-16 text-gray-300 mb-4 animate-pulse" />
              <h3 className="text-base font-bold text-gray-700">
                No Teacher Selected
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Please click "Select Teacher" on a row in the directory on the
                left to configure their course list.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 min-h-[500px]">
              <div>
                <span className="text-xs font-bold uppercase text-rose-600">
                  Active Settings
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-1">
                  {selectedTeacher.name}
                </h2>
                <p className="text-xs text-gray-500">{selectedTeacher.email}</p>
              </div>

              {assignedLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-rose-600" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-50 pt-4">
                  {/* Current Assignments */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-800 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span>Assigned ({assignedData?.length || 0})</span>
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {assignedData?.length === 0 ? (
                        <p className="text-xs italic text-gray-400 py-4">
                          No assigned courses.
                        </p>
                      ) : (
                        assignedData?.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100 rounded-xl"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="block text-[9px] font-bold text-green-700 uppercase">
                                {assignment.course?.code}
                              </span>
                              <p className="text-xs font-semibold text-gray-900 truncate">
                                {assignment.course?.name}
                              </p>
                            </div>
                            <button
                              onClick={() => handleUnassign(assignment.id)}
                              disabled={isUnassigning}
                              className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Available Courses */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-800 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span>Catalog</span>
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {courses?.length === 0 ? (
                        <p className="text-xs italic text-gray-400 py-4">
                          No courses available.
                        </p>
                      ) : (
                        courses?.map((course) => {
                          const assigned = isAssigned(course.id);
                          const assignmentId = getAssignmentId(course.id);

                          return (
                            <div
                              key={course.id}
                              className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-xl"
                            >
                              <div className="min-w-0 pr-2">
                                <span className="block text-[9px] font-bold text-gray-500 uppercase">
                                  {course.code}
                                </span>
                                <p className="text-xs font-semibold text-gray-800 truncate">
                                  {course.name}
                                </p>
                              </div>

                              {assigned ? (
                                <button
                                  onClick={() =>
                                    assignmentId && handleUnassign(assignmentId)
                                  }
                                  disabled={isUnassigning}
                                  className="flex items-center space-x-0.5 px-2 py-1 bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-700 rounded border border-green-100 hover:border-red-100 text-[10px] font-bold cursor-pointer transition-all"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Assigned</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAssign(course.id)}
                                  disabled={isAssigning}
                                  className="flex items-center space-x-0.5 px-2 py-1 bg-indigo-600 text-white rounded text-[10px] font-bold cursor-pointer hover:bg-indigo-700 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
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
      </div>
    </div>
  );
};

export default AssignmentManagement;
