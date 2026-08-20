import { Bell, Search, Menu, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="navbar">
      {/* =================================
          LEFT
      ================================= */}

      <div className="navbar-left">
        <button
          type="button"
          className="navbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="navbar-search">
          <Search className="search-icon" size={18} />

          <input
            type="text"
            placeholder="Search employees..."
            aria-label="Search"
          />

          <span className="search-shortcut">Ctrl K</span>
        </div>
      </div>

      {/* =================================
          RIGHT
      ================================= */}

      <div className="navbar-right">
        {/* STATUS */}

        <div className="navbar-status">
          <span className="navbar-status-dot"></span>
          <span>System Online</span>
        </div>

        {/* NOTIFICATION */}

        <button
          type="button"
          className="notification-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={19} />

          <span className="notification-dot"></span>
        </button>

        <div className="navbar-divider"></div>

        {/* PROFILE */}

        <button
          type="button"
          className="navbar-profile"
          aria-label="User profile"
        >
          <div className="navbar-avatar">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>

          <div className="navbar-user-info">
            <strong>{user?.name || "Admin"}</strong>

            <small>{user?.role || "Administrator"}</small>
          </div>

          <ChevronDown className="profile-chevron" size={15} />
        </button>

        {/* LOGOUT */}

        <button
          type="button"
          className="navbar-logout"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={17} />

          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
