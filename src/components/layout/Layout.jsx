import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "./Layout.css";

function Layout() {
  // =========================================
  // SIDEBAR STATES
  // =========================================

  // true  = small sidebar / icons only
  // false = full sidebar
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // =========================================
  // OPEN MOBILE SIDEBAR
  // =========================================

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  // =========================================
  // CLOSE MOBILE SIDEBAR
  // =========================================

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // =========================================
  // MOBILE SCROLL LOCK
  // =========================================

  useEffect(() => {
    if (sidebarOpen && window.innerWidth <= 800) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // =========================================
  // RESPONSIVE RESIZE
  // =========================================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 800) {
        setSidebarOpen(false);

        document.body.style.overflow = "";
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // =========================================
  // JSX
  // =========================================

  return (
    <div
      className={`
        app-layout
        ${isCollapsed ? "layout-collapsed" : "layout-expanded"}
      `}
    >
      {/* =====================================
          SIDEBAR
      ===================================== */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* =====================================
          MAIN WRAPPER
      ===================================== */}

      <div className="main-wrapper">
        <Navbar onMenuClick={openSidebar} />

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
