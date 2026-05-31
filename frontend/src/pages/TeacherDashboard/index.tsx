
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useGetTeacherCoursesQuery } from "../../state/services/teacherCourseAPI";
import TeacherCoursesList from "../../components/Teacher/TeacherCoursesList";
import StudentMarksManager from "../../components/Teacher/StudentMarksManager";
import { GraduationCap, Library, School, Loader2 } from "lucide-react";

const TeacherDashboard = () => {
  const { user } = useAuth();
  const teacherId = Number(user?.id);

  const { data: teacherCourses, isLoading, error } = useGetTeacherCoursesQuery(teacherId, {
    skip: !teacherId,
  });

  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm max-w-md w-full">
          Failed to load your teacher dashboard. Please try logging in again.
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalCourses = teacherCourses?.length || 0;
  const enrolledStudentsSet = new Set<number>();
  teacherCourses?.forEach((tc) => {
    tc.course?.courseEnrollments?.forEach((e: any) => {
      if (e.studentId) enrolledStudentsSet.add(e.studentId);
    });
  });
  const totalEnrolledStudents = enrolledStudentsSet.size;

  const currentSelectedCourse = selectedCourse
    ? teacherCourses?.find((tc) => tc.courseId === selectedCourse.id)?.course
    : null;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-100 py-8 shadow-xs mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
                <School className="w-6 h-6 text-blue-600" />
                <span>Instructor Dashboard</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, <strong className="text-gray-700">{user.name}</strong>. Grade students and manage coursework.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-blue-50/50 border border-blue-100/50 p-3.5 rounded-2xl flex items-center space-x-3">
                <div className="p-2 bg-blue-100/70 text-blue-700 rounded-xl hidden sm:block">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-600/80 uppercase tracking-wider">Courses Taught</p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">{totalCourses}</p>
                </div>
              </div>

              <div className="bg-indigo-50/50 border border-indigo-100/50 p-3.5 rounded-2xl flex items-center space-x-3">
                <div className="p-2 bg-indigo-100/70 text-indigo-700 rounded-xl hidden sm:block">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-indigo-600/80 uppercase tracking-wider">Total Students</p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">{totalEnrolledStudents}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentSelectedCourse ? (
          <StudentMarksManager
            course={currentSelectedCourse}
            onBack={() => setSelectedCourse(null)}
          />
        ) : (
          <TeacherCoursesList
            teacherCourses={teacherCourses || []}
            onSelectCourse={(course) => setSelectedCourse(course)}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
