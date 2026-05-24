import { useNavigate, NavLink } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { Bell, Home, PlusCircle, Pill } from 'lucide-react';
import { auth } from "./firebase";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="app-navbar" aria-label="Primary">
      <div className="navbar-links">
        {[
          // Home Icon (N2, N5)
          { to: '/home', icon: <Home size={18} />, label: 'Home' },
          // Add Medicine Icon (N3, N6)
          { to: '/addmedicinepage', icon: <PlusCircle size={18} />, label: 'Add' },
          // Manage Medication/Dashboard page link for testing
          { to: '/dashboard', icon: <Pill size={18} />, label: 'Cabinet' },
          // Reminders Icon (N4, N7)
          { to: '/reminders', icon: <Bell size={18} />, label: 'Reminders' },
        ].map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
            aria-label={label}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </div>
      <button type="button" className="navbar-logout" onClick={handleLogout}>
        Log out
      </button>
    </nav>
  );
};

export default Navbar;