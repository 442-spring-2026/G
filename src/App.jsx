import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import SavedCabinet from "./pages/SavedCabinet";
import AddMedicinePage from "./pages/AddMedicinePage";
import ManageMedication from "./pages/ManageMedication";
import Navbar from "./navbar";

function App() {
  return (
    <div className="app-shell">
      <Routes>
        {/* Login page has NO navbar (Requirement N1) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated routes displaying the global Navbar */}
        <Route path="/home" element={<><Navbar /><Home /></>} />
        <Route path="/dashboard" element={<><Navbar /><SavedCabinet /></>} />
        <Route path="/addmedicinepage" element={<><Navbar /><AddMedicinePage /></>} />
        <Route path="/manage/:id" element={<><Navbar /><ManageMedication /></>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
