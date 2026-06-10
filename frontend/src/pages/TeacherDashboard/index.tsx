import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useGetTeacherCoursesQuery } from "../../state/services/teacherCourseAPI";
import {
  useAddMarkMutation,
  useUpdateMarkMutation,
  useDeleteMarkMutation,
} from "../../state/services/markAPI";
import TeacherCoursesGrid from "../../components/Teacher/TeacherCoursesGrid";
import StudentMarksGrid from "../../components/Teacher/StudentMarksGrid";
import GradeEditDialog from "../../components/Teacher/GradeEditDialog";
import Loader from "../../components/Loader";
import {
  GraduationCap,
  Library,
  School,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface StudentRow {
  id: number;
  name: string;
  email: string;
  score: number | null;
  markId: number | null;
  enrollmentId: number;
}

const TeacherDashboard = () => {
  const { user } = useAuth();
  const teacherId = Number(user?.id);

  // Fetch teacher's courses (reactive to refetch)
  const { data: teacherCourses, isLoading, error } = useGetTeacherCoursesQuery(
    teacherId,
    { skip: !teacherId },
  );

  const [addMark, { isLoading: isAdding }] = useAddMarkMutation();
  const [updateMark, { isLoading: isUpdating }] = useUpdateMarkMutation();
  const [deleteMark, { isLoading: isDeleting }] = useDeleteMarkMutation();

  // Selected course state
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  // Search terms
  const [courseSearch, setCourseSearch] = useState("");
  const [studentSearch, setStudentSearch] = useState("");

  // Grade edit dialog states
  const [editingStudent, setEditingStudent] = useState<StudentRow | null>(null);
  const [scoreInput, setScoreInput] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleEditClose = () => {
    setEditingStudent(null);
    setScoreInput("");
  };

  if (isLoading) {
    return <Loader />;
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
  let totalEnrolledStudents = 0;
  teacherCourses?.forEach((tc) => {
    totalEnrolledStudents += tc.course?._count?.courseEnrollments || 0;
  });

  const currentCourse = selectedCourse
    ? teacherCourses?.find((tc) => tc.courseId === selectedCourse.id)?.course
    : null;

  const handleSaveMark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !currentCourse) return;

    const scoreVal = parseFloat(scoreInput);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      setErrorMsg("Please enter a valid mark score between 0 and 100.");
      return;
    }

    setSuccessMsg("");
    setErrorMsg("");

    try {
      if (editingStudent.markId) {
        // Edit existing grade
        await updateMark({
          markId: editingStudent.markId,
          score: scoreVal,
        }).unwrap();
        setSuccessMsg(`Successfully updated mark for ${editingStudent.name}!`);
      } else {
        // Add new grade
        await addMark({
          courseId: currentCourse.id,
          studentId: editingStudent.id,
          score: scoreVal,
        }).unwrap();
        setSuccessMsg(`Successfully added mark for ${editingStudent.name}!`);
      }
      setEditingStudent(null);
      setScoreInput("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.data?.message || "Failed to save student grade. Please try again.",
      );
    }
  };

  const handleDeleteMark = async (studentName: string, markId: number) => {
    if (
      window.confirm(
        `Are you sure you want to delete the grade for student "${studentName}"?`,
      )
    ) {
      setSuccessMsg("");
      setErrorMsg("");
      try {
        await deleteMark(markId).unwrap();
        setSuccessMsg(`Grade for ${studentName} deleted successfully.`);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err?.data?.message || "Failed to delete student grade.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-100 py-8 shadow-xs mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
                <School className="w-6 h-6 text-indigo-600" />
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
                  <p className="text-xs font-semibold text-blue-600/80 uppercase tracking-wider">
                    Courses Taught
                  </p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {totalCourses}
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50/50 border border-indigo-100/50 p-3.5 rounded-2xl flex items-center space-x-3">
                <div className="p-2 bg-indigo-100/70 text-indigo-700 rounded-xl hidden sm:block">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-indigo-600/80 uppercase tracking-wider">
                    Total Students
                  </p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {totalEnrolledStudents}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {successMsg && (
          <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 p-3 rounded-xl border border-green-100 shadow-xs">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center space-x-2 text-sm text-red-700 bg-red-50 p-3 rounded-xl border border-red-100 shadow-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sequential Layout */}
        {!currentCourse ? (
          <TeacherCoursesGrid
            teacherCourses={teacherCourses || []}
            courseSearch={courseSearch}
            setCourseSearch={setCourseSearch}
            selectedCourseId={currentCourse?.id || null}
            onSelectCourse={(course) => {
              setSelectedCourse(course);
              setStudentSearch("");
            }}
          />
        ) : (
          <StudentMarksGrid
            course={currentCourse}
            studentSearch={studentSearch}
            setStudentSearch={setStudentSearch}
            onEditMark={(student) => {
              setEditingStudent(student);
              setScoreInput(student.score !== null ? student.score.toString() : "");
            }}
            onDeleteMark={handleDeleteMark}
            isDeleting={isDeleting}
            onBack={() => setSelectedCourse(null)}
          />
        )}
      </div>

      {/* Grade Manage Dialog Overlay */}
      <GradeEditDialog
        isOpen={!!editingStudent}
        onClose={handleEditClose}
        editingStudent={editingStudent}
        scoreInput={scoreInput}
        setScoreInput={setScoreInput}
        onSubmit={handleSaveMark}
        isSaving={isAdding || isUpdating}
      />
    </div>
  );
};

export default TeacherDashboard;
