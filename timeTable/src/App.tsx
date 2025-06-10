import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ColorPalets from "./components/ColorPalets";
import NavBar from "./components/NavBar";
import DeleteNews from "./pages/DeleteNews";
import TimeTable from "./pages/Timetable";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Test from "./pages/Test";
import UsersInfo from "./pages/UsersInfo";
import { PermissionsProvider } from "./components/scripts/permissions";

function App() {
  useEffect(() => {
    document.body.style.backgroundColor = ColorPalets.bgMainLight;
    document.body.style.color = ColorPalets.textPrimary;
  }, []);
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{}} //hier noch backround cooler und body machen
    >
      
    <Router>
      <PermissionsProvider>
        <NavBar />
        <Routes>
          <Route path="/timetable" element={<TimeTable />} />
          <Route path="/test" element={<Test />} />
          <Route path="/deleteNews" element={<DeleteNews />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/usersInfo" element={<UsersInfo />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </PermissionsProvider>
    </Router>
     
    </div>
  );
}

export default App;
