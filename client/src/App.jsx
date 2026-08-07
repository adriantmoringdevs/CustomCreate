import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import LoginSignup from "./pages/LoginSignup";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
// import stubs for the rest as you build them:
import JobList from "./pages/JobList";
import JobById from "./pages/JobById";
// import MaterialList from "./pages/MaterialList";
// import MaterialDetail from "./pages/MaterialDetail";
// import ReorderRequestList from "./pages/ReorderRequestList";
// import StaffList from "./pages/StaffList";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginSignup />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/jobs/:id" element={<JobById />} />
        {/* <Route path="/materials" element={<MaterialList />} /> */}
        {/* <Route path="/materials/:id" element={<MaterialDetail />} /> */}
        {/* <Route path="/reorder-requests" element={<ReorderRequestList />} /> */}
        {/* <Route path="/staff" element={<StaffList />} /> */}

      </Route>
    </Routes>
  );
}
export default App;
