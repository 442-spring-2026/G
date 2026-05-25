import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Home from "./pages/Home";
// import SavedCabinet from "./pages/SavedCabinet";
import Dashboard from "./pages/Dashboard";
import AddMedicinePage from "./pages/AddMedicinePage";
import ManageMedication from "./pages/ManageMedication";
import Navbar from "./navbar";


function App() {
  return (
    <div className="app-shell">
      <Routes>
        {/* Login & Signup pages have NO navbar (Requirement N1) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/forgotpassword" element={<Navigate to="/forgot-password" replace />} />

        {/* Main pages HAVE navbar */}
        <Route path="/home" element={<><Navbar /><Home /></>} />
        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
        <Route path="/addmedicinepage" element={<><Navbar /><AddMedicinePage /></>} />
        <Route path="/manage/:id" element={<><Navbar /><ManageMedication /></>} />
        
        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;