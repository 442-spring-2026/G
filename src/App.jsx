import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
<<<<<<< Updated upstream
import SavedCabinet from "./pages/SavedCabinet";

function App() {
  return (
<<<<<<< HEAD
    <Routes>
      {/* Login page has NO navbar (Requirement N1) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<SavedCabinet />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
=======
    <div className="app-shell">
      {activeReminder && (
        <div style={{
          position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)",
          background: "#f5efff", border: "2px solid #4b2e83", borderRadius: "12px",
          padding: "20px", zIndex: 999, minWidth: "320px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <Bell size={20} color="#4b2e83" />
            <strong style={{ color: "#4b2e83" }}>Time to take your medication. Did you take it?</strong>
          </div>
          <p style={{ margin: "0 0 16px" }}><strong>{activeReminder.name}</strong> — {formatDosage(activeReminder.dosage)}</p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button className="primary-button" style={{ width: "auto", padding: "10px 24px" }}
              onClick={() => saveReminderResult("Taken")}>Yes</button>
            <button className="secondary-button" style={{ width: "auto", padding: "10px 24px", marginTop: 0 }}
              onClick={() => saveReminderResult("Missed")}>Ignore</button>
          </div>
        </div>
      )}
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
        <Route path="/reminders" element={<><Navbar /><SavedCabinet /></>} />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
>>>>>>> 75aaacd (fix auth flow and add dashboard)
  );
}
=======
import AddMedicinePage from "./pages/AddMedicinePage";
import Navbar from "./navbar";
import Home from "./pages/Home";


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
>>>>>>> Stashed changes


     {/* Pages inside this block WILL have the navbar (Post-Login) */}
     <Route element={<AuthenticatedLayout />}>
     <Route path="/home" element={<Home />} />
       <Route path="/add" element={<AddMedicinePage />} />
       {/* Requirement N5 */}
       <Route path="/dashboard" element={<div>Medicine Cabinet Page</div>} />
       {/* Requirement N7 */}
       <Route path="/reminders" element={<div>Reminders Page</div>} />
     </Route>


     <Route path="*" element={<Navigate to="/login" replace />} />
   </Routes>