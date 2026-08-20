import {
  LayoutDashboard,
  Users,
  UserRound,
  PanelLeft,
  PanelRight,
  LogOut,
  X,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Sidebar.css";

const menuItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Employees",
    path: "/employees",
    icon: Users,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserRound,
  },
];

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  isCollapsed,
  setIsCollapsed,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // =========================================
  // DESKTOP COLLAPSE / EXPAND
  // =========================================

  const handleToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  // =========================================
  // MOBILE CLOSE
  // =========================================

  const handleMobileClose = () => {
    setSidebarOpen(false);
  };

  // =========================================
  // MENU CLICK
  // =========================================

  const handleMenuClick = () => {
    if (window.innerWidth <= 800) {
      setSidebarOpen(false);
    }
  };

  // =========================================
  // SIGN OUT
  // =========================================

  const handleSignOut = () => {
    logout();
    setSidebarOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      <div
        className={`sidebar-overlay ${
          sidebarOpen ? "sidebar-overlay-show" : ""
        }`}
        onClick={handleMobileClose}
      />

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={`
          ems-sidebar
          ${isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"}
          ${sidebarOpen ? "sidebar-mobile-open" : ""}
        `}
      >
        {/* ===================================
            HEADER
        =================================== */}

        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span>E</span>
          </div>

          <div className="sidebar-brand">
            <h2>EMS</h2>
            <p>Employee Management</p>
          </div>

          {/* Mobile Close */}

          <button
            type="button"
            className="mobile-close"
            onClick={handleMobileClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* ===================================
            DESKTOP TOGGLE
        =================================== */}

        <button
          type="button"
          className="sidebar-toggle"
          onClick={handleToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelRight size={18} /> : <PanelLeft size={18} />}
        </button>

        {/* ===================================
            MENU
        =================================== */}

        <div className="sidebar-menu-wrapper">
          <div className="sidebar-menu-title">MAIN MENU</div>

          <nav className="sidebar-menu">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={handleMenuClick}
                  className={({ isActive }) =>
                    `sidebar-menu-item ${isActive ? "active" : ""}`
                  }
                >
                  <span className="menu-icon">
                    <Icon size={20} />
                  </span>

                  <span className="menu-text">{item.label}</span>

                  <span className="menu-arrow">›</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* ===================================
            FOOTER
        =================================== */}

        <div className="sidebar-footer">
          {/* SIGN OUT */}

          <button type="button" className="signout-btn" onClick={handleSignOut}>
            <span className="signout-icon">
              <LogOut size={19} />
            </span>

            <span className="signout-text">Sign out</span>
          </button>

          {/* VERSION */}

          <div className="sidebar-version">
            <span>EMS</span>
            <span>v1.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
