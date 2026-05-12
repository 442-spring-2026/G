import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AddMedicinePage from "./pages/AddMedicinePage";
import Navbar from "./navbar";

// Navbar is only on post-login pages (Requirement N1)
const AuthenticatedLayout = () => {
  return (
    <div style={{ paddingTop: '64px' }}>
      <Navbar />
      <Outlet /> 
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Login page has NO navbar (Requirement N1) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Pages inside this block WILL have the navbar (Post-Login) */}
      <Route element={<AuthenticatedLayout />}>
        <Route path="/add" element={<AddMedicinePage />} />
        {/* Requirement N5 */}
        <Route path="/dashboard" element={<div>Medicine Cabinet Page</div>} />
        {/* Requirement N7 */}
        <Route path="/reminders" element={<div>Reminders Page</div>} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;