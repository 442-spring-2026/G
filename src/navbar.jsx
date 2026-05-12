import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Bell } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#4b2e83] text-[#85754d] flex justify-around items-center h-16 shadow-lg border-t border-[#85754d]">
      <NavLink 
        to="/home" 
        className={({ isActive }) => 
          isActive ? "text-white flex flex-col items-center" : "flex flex-col items-center hover:text-white"
        }
      >
        <Home size={24} />
        <span className="text-xs">Home</span>
      </NavLink>

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