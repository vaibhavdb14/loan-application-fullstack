import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FilePlus,
  FolderOpen,
  HelpCircle,
  ShieldAlert,
  User,
  Settings,
  LogOut,
  Landmark,
  X,
  IdCard,
} from "lucide-react";

const Sidebar = ({ isOpen = false, onClose = () => {} }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "File New Application", path: "/new", icon: <FilePlus size={20} /> },
    { name: "Applications", path: "/applications", icon: <FolderOpen size={20} /> },
    { name: "Digital Profile", path: "/digital-profile", icon: <IdCard size={20} /> },
    { name: "Help", path: "/help", icon: <HelpCircle size={20} /> },
    { name: "Policy / Rules", path: "/policy", icon: <ShieldAlert size={20} /> },
  ];

  const bottomItems = [
    { name: "Manager Profile", path: "/profile", icon: <User size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  // Prevent background scroll while drawer open on mobile
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-72 sm:w-64 bg-banking-navy text-white h-screen flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ease-out
          lg:translate-x-0 lg:z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="p-6 flex items-center justify-between gap-3 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Landmark className="text-banking-primary" size={28} />
            <span className="font-bold text-lg tracking-wide leading-tight">
              Bank Loan
              <br />
              Processing
            </span>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden text-gray-300 hover:text-white p-1"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 sm:py-3 rounded-md transition-colors ${
                  isActive
                    ? "bg-banking-primary text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {item.icon}
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-1">
          {bottomItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 sm:py-2 text-gray-300 hover:text-white transition-colors"
            >
              {item.icon}
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          ))}
          <button
            onClick={() => { onClose(); navigate("/login"); }}
            className="flex items-center gap-3 px-4 py-3 sm:py-2 w-full text-left text-banking-error hover:text-red-400 transition-colors mt-4"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
