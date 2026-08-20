import {
  Menu,
  ChevronDown,
  UserRound,
  LogOut,
  CircleUserRound,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const profileRef = useRef(null);

  /* =========================================================
     DYNAMIC USER DATA
  ========================================================= */

  const displayName = user?.name || "Administrator";

  const displayRole = user?.role || "Admin";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* =========================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =========================================================
     PROFILE CLICK
  ========================================================= */

  const handleProfileClick = () => {
    setShowProfileMenu((prev) => !prev);
  };

  /* =========================================================
     MY PROFILE
  ========================================================= */

  const handleMyProfile = () => {
    setShowProfileMenu(false);

    navigate("/profile");
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    setShowProfileMenu(false);

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="navbar">
      {/* =====================================================
          LEFT
      ===================================================== */}

      <div className="navbar-left">
        {/* MOBILE MENU */}

        <button
          type="button"
          className="navbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* PAGE BRAND */}

        <div className="navbar-page-title">
          <span className="navbar-title-dot" />

          <div>
            <strong>Employee Management System</strong>
            <span>Administration Panel</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          RIGHT
      ===================================================== */}

      <div className="navbar-right">
        {/* SYSTEM STATUS */}

        <div className="navbar-status">
          <span className="navbar-status-dot" />
          <span>System Online</span>
        </div>

        <div className="navbar-divider" />

        {/* ===================================================
            PROFILE
        =================================================== */}

        <div className="navbar-profile-wrapper" ref={profileRef}>
          <button
            type="button"
            className={`navbar-profile ${
              showProfileMenu ? "profile-open" : ""
            }`}
            onClick={handleProfileClick}
            aria-label="Open profile menu"
            aria-expanded={showProfileMenu}
          >
            {/* AVATAR */}

            <div className="navbar-avatar">{initials || "A"}</div>

            {/* USER INFO */}

            <div className="navbar-user-info">
              <strong>{displayName}</strong>

              <small>{displayRole}</small>
            </div>

            <ChevronDown
              className={`profile-chevron ${
                showProfileMenu ? "chevron-open" : ""
              }`}
              size={16}
            />
          </button>

          {/* =================================================
              PROFILE DROPDOWN
          ================================================= */}

          {showProfileMenu && (
            <div className="profile-dropdown">
              {/* DROPDOWN USER */}

              <div className="dropdown-user">
                <div className="dropdown-avatar">{initials || "A"}</div>

                <div className="dropdown-user-info">
                  <strong>{displayName}</strong>

                  <span>{displayRole}</span>
                </div>
              </div>

              <div className="dropdown-divider" />

              {/* MY PROFILE */}

              <button
                type="button"
                className="profile-dropdown-item"
                onClick={handleMyProfile}
              >
                <span className="dropdown-item-icon">
                  <UserRound size={17} />
                </span>

                <span>My Profile</span>
              </button>

              {/* LOGOUT */}

              <button
                type="button"
                className="profile-dropdown-item logout-item"
                onClick={handleLogout}
              >
                <span className="dropdown-item-icon">
                  <LogOut size={17} />
                </span>

                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
