import {
  useGetTeacherCoursesQuery,
  useAssignTeacherMutation,
  useUnassignTeacherMutation,
} from "../../state/services/teacherCourseAPI";
import { useGetCoursesQuery } from "../../state/services/courseAPI";
import { X, BookOpen, Check, Plus, Loader2, ArrowLeft } from "lucide-react";
import type { UserType } from "../../types";

interface TeacherAssignmentProps {
  teacher: UserType;
  onBack: () => void;
}

const TeacherAssignment = ({ teacher, onBack }: TeacherAssignmentProps) => {
  const teacherId = Number(teacher.id);

  // Fetch assigned courses for this teacher
  const { data: assignedData, isLoading: assignedLoading } =
    useGetTeacherCoursesQuery(teacherId);

  // Fetch all available courses
  const { data: courses, isLoading: coursesLoading } = useGetCoursesQuery();

  const [assignTeacher, { isLoading: isAssigning }] =
    useAssignTeacherMutation();
  const [unassignTeacher, { isLoading: isUnassigning }] =
    useUnassignTeacherMutation();

  const handleAssign = async (courseId: number) => {
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

  const isLoading = assignedLoading || coursesLoading;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      {/* Back & Title */}
      <div className="flex items-center justify-between border-b border-gray-50 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-gray-50 text-gray-500 hover:text-gray-900 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Manage Teacher Assignments
            </h3>
            <p className="text-xs text-gray-500">
              Assigning courses to Instructor{" "}
              <strong className="text-gray-700">{teacher.name}</strong> (
              {teacher.email})
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Currently Assigned Courses */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 flex items-center space-x-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              <span>Assigned Courses ({assignedData?.length || 0})</span>
            </h4>

            <div className="space-y-3">
              {assignedData?.length === 0 ? (
                <div className="text-center py-8 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-400">
                    Teacher is not assigned to any courses.
                  </p>
                </div>
              ) : (
                assignedData?.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-all shadow-sm"
                  >
                    <div className="min-w-0">
                      <span className="inline-block text-[10px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded uppercase tracking-wider mb-1">
                        {assignment.course?.code}
                      </span>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {assignment.course?.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUnassign(assignment.id)}
                      disabled={isUnassigning}
                      className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add / Assign courses */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 flex items-center space-x-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span>Available Courses Catalog</span>
            </h4>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {courses?.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">
                  No courses available to assign.
                </p>
              ) : (
                courses?.map((course) => {
                  const assigned = isAssigned(course.id);
                  const assignmentId = getAssignmentId(course.id);

                  return (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-all shadow-xs"
                    >
                      <div className="min-w-0 flex-1 pr-4">
                        <span className="inline-block text-[10px] font-bold bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-wider mb-1">
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
                          className="flex items-center space-x-1 px-2.5 py-1 bg-green-50 hover:bg-red-50 text-green-700 hover:text-red-700 rounded-lg text-xs font-semibold border border-green-100 hover:border-red-100 transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Assigned</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAssign(course.id)}
                          disabled={isAssigning}
                          className="flex items-center space-x-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer"
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
  );
};

export default TeacherAssignment;
