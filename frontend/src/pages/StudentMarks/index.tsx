import { useAuth } from "../../hooks/useAuth";
import { useGetStudentMarksQuery } from "../../state/services/markAPI";
import { useGetEnrolledCoursesQuery } from "../../state/services/courseEnrollmentAPI";
import {
  GraduationCap,
  BookOpen,
  Award,
  Loader2,
  TrendingUp,
  CheckCircle2,
  Clock,
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

  const isLoading = isMarksLoading || isEnrollmentsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar for enrolled courses */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-50 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Enrolled Courses</span>
            </h2>

            {validEnrollments.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                No active enrollments found.
              </p>
            ) : (
              <div className="space-y-3">
                {validEnrollments.map((enrollment) => {
                  const courseMark = validMarks.find(
                    (m) => m.course.id === enrollment.course.id,
                  );
                  return (
                    <div
                      key={enrollment.id}
                      className="p-3.5 bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {enrollment.course.code}
                        </span>
                        {courseMark ? (
                          <span className="flex items-center text-xs font-semibold text-emerald-600 gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{courseMark.score}/100</span>
                          </span>
                        ) : (
                          <span className="flex items-center text-xs font-semibold text-amber-600 gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-gray-800 leading-tight">
                        {enrollment.course.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Main Marks Area */}
          <div className="lg:col-span-3">
            {validMarks.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center min-h-[300px]">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-500 mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  No marks available yet
                </h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  Your teachers haven't uploaded any marks for your courses yet.
                  Check back later!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {validMarks.map((mark) => (
                  <div
                    key={mark.id}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />

                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          {mark.course.code}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
                        {mark.course.name}
                      </h3>

                      <div className="mt-6 pt-4 border-t border-gray-50 flex items-end justify-between">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">
                            Final Score
                          </p>
                          <div className="flex items-baseline space-x-1">
                            <span className="text-3xl font-extrabold text-gray-900">
                              {mark.score}
                            </span>
                            <span className="text-sm font-medium text-gray-500">
                              / 100
                            </span>
                          </div>
                        </div>

                        <div
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            mark.score >= 90
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : mark.score >= 70
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : mark.score >= 50
                                  ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {mark.score >= 90
                            ? "Excellent"
                            : mark.score >= 70
                              ? "Good"
                              : mark.score >= 50
                                ? "Pass"
                                : "Fail"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMarks;
