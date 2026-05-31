import { useState } from "react";
import CreateUserForm from "../../components/Admin/CreateUserForm";
import CreateCourseForm from "../../components/Admin/CreateCourseForm";
import UsersList from "../../components/Admin/UsersList";
import CoursesList from "../../components/Admin/CoursesList";
import StudentsEnrollment from "../../components/Admin/studentsEnrollment";
import TeacherAssignment from "../../components/Admin/teacherAssignment";

import { useGetUsersQuery } from "../../state/services/userAPI";
import { useGetCoursesQuery } from "../../state/services/courseAPI";

import {
  Users,
  GraduationCap,
  School,
  Library,
  Settings,
  FolderOpen,
} from "lucide-react";
import type { UserType } from "../../types";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"users" | "courses">("users");

  // Selection states for managing enrollment/assignment detail views
  const [selectedStudent, setSelectedStudent] = useState<UserType | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<UserType | null>(null);

  // Queries for header statistics
  const { data: users } = useGetUsersQuery();
  const { data: courses } = useGetCoursesQuery();

  const totalStudents = users?.filter((u) => u.role === "STUDENT").length || 0;
  const totalTeachers = users?.filter((u) => u.role === "TEACHER").length || 0;
  const totalCourses = courses?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-100 py-8 shadow-xs mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center space-x-2">
                <Settings className="w-6 h-6 text-blue-600 animate-spin-slow" />
                <span>Admin Management Suite</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Configure courses, assign instructional staff, and manage
                student enrollments.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <div className="bg-blue-50/50 border border-blue-100/50 p-3.5 rounded-2xl flex items-center space-x-3">
                <div className="p-2 bg-blue-100/70 text-blue-700 rounded-xl hidden sm:block">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-600/80 uppercase tracking-wider">
                    Students
                  </p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {totalStudents}
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50/50 border border-indigo-100/50 p-3.5 rounded-2xl flex items-center space-x-3">
                <div className="p-2 bg-indigo-100/70 text-indigo-700 rounded-xl hidden sm:block">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-indigo-600/80 uppercase tracking-wider">
                    Teachers
                  </p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {totalTeachers}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100/50 p-3.5 rounded-2xl flex items-center space-x-3">
                <div className="p-2 bg-emerald-100/70 text-emerald-700 rounded-xl hidden sm:block">
                  <Library className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-600/80 uppercase tracking-wider">
                    Courses
                  </p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {totalCourses}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Work Area */}
        {selectedStudent ? (
          <StudentsEnrollment
            student={selectedStudent}
            onBack={() => setSelectedStudent(null)}
          />
        ) : selectedTeacher ? (
          <TeacherAssignment
            teacher={selectedTeacher}
            onBack={() => setSelectedTeacher(null)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Sidebar: Controls & Creation Forms */}
            <div className="lg:col-span-4 space-y-6">
              <CreateUserForm />
              <CreateCourseForm />
            </div>

            {/* Right Main Panel: Directories & Catalog */}
            <div className="lg:col-span-8 space-y-6">
              {/* Tab Navigation */}
              <div className="bg-white p-1.5 rounded-2xl border border-gray-100 shadow-xs flex space-x-1">
                <button
                  onClick={() => setActiveTab("users")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "users"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Users Directory</span>
                </button>
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === "courses"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Courses Catalog</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="transition-all duration-300">
                {activeTab === "users" ? (
                  <UsersList
                    onManageStudentCourses={(student) =>
                      setSelectedStudent(student)
                    }
                    onManageTeacherCourses={(teacher) =>
                      setSelectedTeacher(teacher)
                    }
                  />
                ) : (
                  <CoursesList />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
