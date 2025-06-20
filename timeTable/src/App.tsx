import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ColorPalets from "./components/ColorPalets";
import NavBar from "./components/NavBar";
import DeleteNews from "./pages/DeleteNews";
import TimeTable from "./pages/Timetable";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Test from "./pages/Test";
import UsersInfo from "./pages/CoursInfo";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/scripts/ProtectedRoute";
import DashboardPage from "./pages/Dashbord"
import { useAuth } from "../src/context/AuthContext";
import CourseListGroupedByDay from "./pages/CoursSelection";

function App() {
  
  useEffect(() => {
    document.body.style.backgroundColor = ColorPalets.bgMainLight;
    document.body.style.color = ColorPalets.textPrimary;
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Router>
        <AuthProvider>
          <NavBar />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/timetable"
              element={
                <ProtectedRoute allowedRoles={["user", "teacher", "manager", "admin"]}>
                  <TimeTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={["user", "teacher", "manager", "admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["teacher", "manager", "admin"]}
                
                >
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/coursselection"
              element={
                <ProtectedRoute allowedRoles={["user", "teacher", "manager", "admin"]}>
                  <CourseListGroupedByDay />
                </ProtectedRoute>
              }
            />

            <Route
              path="/test"
              element={
                <ProtectedRoute allowedRoles={["user", "teacher", "manager", "admin"]}>
                  <Test />
                </ProtectedRoute>
              }
            />

            <Route
              path="/upload"
              element={
                <ProtectedRoute allowedRoles={["teacher", "manager", "admin"]}>
                  <Upload />
                </ProtectedRoute>
              }
            />

            <Route
              path="/deleteNews"
              element={
                <ProtectedRoute allowedRoles={["manager", "admin"]}>
                  <DeleteNews />
                </ProtectedRoute>
              }
            />

            <Route
              path="/usersInfo"
              element={
                <ProtectedRoute allowedRoles={["teacher", "admin"]}>
                  <UsersInfo />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
