import { Library, Users, ArrowRight } from "lucide-react";

interface TeacherCoursesListProps {
  teacherCourses: any[];
  onSelectCourse: (course: any) => void;
}

const TeacherCoursesList = ({ teacherCourses, onSelectCourse }: TeacherCoursesListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
          <Library className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Your Classes</h3>
          <p className="text-xs text-gray-500">View and manage grades for all courses assigned to you</p>
        </div>
      </div>

      {teacherCourses.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-sm">
          <Library className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500">No courses assigned yet.</p>
          <p className="text-xs text-gray-400 mt-1">Please contact your administrator for assignments.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacherCourses.map((tc) => {
            const course = tc.course;
            const studentsCount = course?.courseEnrollments?.length || 0;

            return (
              <div
                key={tc.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-wider mb-2">
                    {course?.code}
                  </span>
                  <h4 className="text-base font-bold text-gray-900 leading-tight">
                    {course?.name}
                  </h4>

                  <div className="mt-4 flex items-center space-x-2 text-xs font-semibold text-gray-500">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span>{studentsCount} Students Enrolled</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectCourse(course)}
                  className="mt-6 w-full flex items-center justify-center space-x-2 py-2 px-4 border border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-xl text-sm font-semibold shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer"
                >
                  <span>Manage Marks</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeacherCoursesList;
