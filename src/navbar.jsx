import { useNavigate, NavLink } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { Bell, Home, PlusCircle, Info } from 'lucide-react';
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
          // Home Icon now routes straight to the primary Saved Medicine Cabinet (Requirement N2, N5)
          { to: '/dashboard', icon: <Home size={18} />, label: 'Cabinet' },
          
          // Add Medicine Icon (Requirement N3, N6)
          { to: '/addmedicinepage', icon: <PlusCircle size={18} />, label: 'Add' },
          
          // Reminders Icon (Requirement N4, N7)
          { to: '/reminders', icon: <Bell size={18} />, label: 'Reminders' },

          // Info Icon represents your informational About guidelines page
          { to: '/home', icon: <Info size={18} />, label: 'About' },
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