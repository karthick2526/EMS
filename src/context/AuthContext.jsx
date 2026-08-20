import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  /* =========================================================
     AUTHENTICATION STATE
  ========================================================= */

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("ems-auth") === "true",
  );

  /* =========================================================
     USER STATE
  ========================================================= */

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("ems-user");

      if (!savedUser) {
        return null;
      }

      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Failed to load saved user:", error);

      localStorage.removeItem("ems-user");

      return null;
    }
  });

  /* =========================================================
     LOGIN
  ========================================================= */

  const login = (userData) => {
    try {
      localStorage.setItem("ems-auth", "true");
      localStorage.setItem("ems-user", JSON.stringify(userData));

      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error("Login data save failed:", error);
    }
  };

  /* =========================================================
     UPDATE USER
  ========================================================= */

  const updateUser = (updatedData) => {
    setUser((currentUser) => {
      if (!currentUser) {
        return null;
      }

      const updatedUser = {
        ...currentUser,
        ...updatedData,
      };

      try {
        localStorage.setItem("ems-user", JSON.stringify(updatedUser));

        /*
          Save changed admin password separately.
          This is only needed for demo admin account.
        */

        if (updatedData.password !== undefined && updatedData.password !== "") {
          localStorage.setItem("ems-admin-password", updatedData.password);
        }
      } catch (error) {
        console.error("Failed to save updated user:", error);
      }

      return updatedUser;
    });
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const logout = () => {
    localStorage.removeItem("ems-auth");
    localStorage.removeItem("ems-user");
    localStorage.removeItem("ems-remember-email");

    /*
      IMPORTANT:
      Do NOT remove ems-admin-password.
      This allows the changed admin password
      to work after logout/login.
    */

    setIsAuthenticated(false);
    setUser(null);
  };

  /* =========================================================
     AUTH CONTEXT
  ========================================================= */

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================================================
   USE AUTH HOOK
========================================================= */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
