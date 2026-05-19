import { NavLink } from 'react-router-dom';
import { Bell, FilePenLine, Home, PlusCircle } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="app-navbar" aria-label="Primary">
      <div className="navbar-links">
        {[
          // Home Icon (N2, N5)
          { to: '/home', icon: <Home size={18} />, label: 'Home' },
          // Add Medicine Icon (N3, N6)
          { to: '/addmedicinepage', icon: <PlusCircle size={18} />, label: 'Add' },
          // Temporary Manage Medication page link for testing
          { to: '/manage/mock1', icon: <FilePenLine size={18} />, label: 'Manage' },
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
    </nav>
  );
};

export default Navbar;