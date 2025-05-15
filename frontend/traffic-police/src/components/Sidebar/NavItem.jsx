// components/NavItem.jsx
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, label, Icon }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-4 py-2 rounded-lg transition duration-200 font-medium ${
          isActive
            ? 'bg-indigo-600 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`
      }
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  );
};

export default NavItem;
