import { NavLink } from 'react-router-dom';
import { Home, PlusCircle, Bell } from 'lucide-react'; 

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#4b2e83] text-[#85754d] flex justify-around items-center h-16 shadow-lg border-t border-[#85754d]">
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => 
          isActive ? "text-white flex flex-col items-center" : "flex flex-col items-center hover:text-white"
        }
      >
        <Home size={24} />
        <span className="text-xs">Home</span>
      </NavLink>

      {/* Add Medicine Icon (N3, N6) */}
      <NavLink 
        to="/add" 
        className={({ isActive }) => 
          isActive ? "text-white flex flex-col items-center" : "flex flex-col items-center hover:text-white"
        }
      >
        <PlusCircle size={24} />
        <span className="text-xs">Add</span>
      </NavLink>

      {/* Reminders Icon (N4, N7) */}
      <NavLink 
        to="/reminders" 
        className={({ isActive }) => 
          isActive ? "text-white flex flex-col items-center" : "flex flex-col items-center hover:text-white"
        }
      >
        <Bell size={24} />
        <span className="text-xs">Reminders</span>
      </NavLink>
    </nav>
  );
};

export default Navbar;