import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoutes";
import { useAuth } from "./hooks/useAuth";
import Loader from "./components/Loader";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import StudentManagement from "./pages/AdminDashboard/studentManagement";
import TeacherManagement from "./pages/AdminDashboard/teacherManagement";
import CourseManagement from "./pages/AdminDashboard/courseManagement";
import EnrollmentManagement from "./pages/AdminDashboard/enrollmentManagement";
import AssignmentManagement from "./pages/AdminDashboard/assignmentManagment";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentMarks from "./pages/StudentMarks";

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <StudentMarks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/students" replace />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="teachers" element={<TeacherManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="enrollment" element={<EnrollmentManagement />} />
            <Route path="assignments" element={<AssignmentManagement />} />
          </Route>

          <Route
            path="/teacher"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
