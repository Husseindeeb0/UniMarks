import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./components/protectedRoutes";
import { useAuth } from "./hooks/useAuth";
import Loader from "./components/Loader";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
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
          />

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
