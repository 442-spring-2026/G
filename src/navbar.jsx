import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Bell } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">💊 MediTrack</div>

      <div className="navbar-links">
        {[
          // Home Icon (N2, N5)
          { to: '/dashboard', icon: <Home size={18} />, label: 'Home' },
          // Add Medicine Icon (N3, N6)
          { to: '/add', icon: <PlusCircle size={18} />, label: 'Add' },
          // Reminders Icon (N4, N7)
          { to: '/reminders', icon: <Bell size={18} />, label: 'Reminders' },
        ].map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
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