import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import SavedCabinet from "./pages/SavedCabinet";
import AddMedicinePage from "./pages/AddMedicinePage";
import Navbar from "./navbar";

function App() {
  return (
    <Routes>
      {/* Login page has NO navbar (Requirement N1) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<><Navbar /><Home /></>} />
      <Route path="/dashboard" element={<><Navbar /><SavedCabinet /></>} />
      <Route path="/addmedicinepage" element={<><Navbar /><AddMedicinePage /></>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;