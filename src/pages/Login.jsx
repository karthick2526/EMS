import { useEffect, useState } from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  LogIn,
  X,
  CheckCircle2,
  ShieldCheck,
  UserRound,
  ArrowRight,
  KeyRound,
  Sparkles,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);

  /* =========================================================
     DEFAULT ADMIN
  ========================================================= */

  const ADMIN_USERNAME = "admin";
  const DEFAULT_ADMIN_PASSWORD = "Admin@123";
  const DEFAULT_ADMIN_EMAIL = "admin@ems.com";

  /* =========================================================
     GET DYNAMIC ADMIN DETAILS
  ========================================================= */

  const getSavedAdmin = () => {
    try {
      const savedUser = localStorage.getItem("ems-user");

      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Unable to read saved admin:", error);

      return null;
    }
  };

  const savedAdmin = getSavedAdmin();

  const adminEmail =
    savedAdmin?.email?.trim().toLowerCase() || DEFAULT_ADMIN_EMAIL;

  const currentAdminPassword =
    localStorage.getItem("ems-admin-password") || DEFAULT_ADMIN_PASSWORD;

  /* =========================================================
     REDIRECT
  ========================================================= */

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", {
        replace: true,
      });

      return;
    }

    const savedUsername = localStorage.getItem("ems-remember-username");

    if (savedUsername) {
      setFormData((prev) => ({
        ...prev,
        username: savedUsername,
      }));

      setRememberMe(true);
    }
  }, [isAuthenticated, navigate]);

  /* =========================================================
     INPUT
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      login: "",
    }));
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must contain at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================================================
     LOGIN
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm() || isLoggingIn) {
      return;
    }

    setIsLoggingIn(true);
    setErrors({});

    try {
      const username = formData.username.trim().toLowerCase();

      const password = formData.password;

      let loggedInUser = null;

      /* =====================================================
         ADMIN LOGIN
      ===================================================== */

      if (username === ADMIN_USERNAME) {
        const latestPassword =
          localStorage.getItem("ems-admin-password") || DEFAULT_ADMIN_PASSWORD;

        if (password === latestPassword) {
          const latestAdmin = getSavedAdmin();

          loggedInUser = {
            id: latestAdmin?.id || "admin-001",
            name: latestAdmin?.name || "Administrator",
            email: latestAdmin?.email || DEFAULT_ADMIN_EMAIL,
            role: latestAdmin?.role || "Admin",
            password: latestPassword,
          };
        }
      }

      /* =====================================================
         MOCKAPI USER LOGIN
      ===================================================== */

      if (!loggedInUser) {
        try {
          const response = await api.get("/users");

          const users = Array.isArray(response.data) ? response.data : [];

          loggedInUser = users.find((item) => {
            const itemEmail = item?.email?.trim().toLowerCase();

            const itemUsername = item?.username?.trim().toLowerCase();

            return (
              (itemEmail === username || itemUsername === username) &&
              item?.password === password
            );
          });
        } catch (apiError) {
          console.error("User API error:", apiError);
        }
      }

      /* =====================================================
         INVALID LOGIN
      ===================================================== */

      if (!loggedInUser) {
        setErrors({
          login: "Invalid username or password",
        });

        setIsLoggingIn(false);

        return;
      }

      /* =====================================================
         SAVE AUTH
      ===================================================== */

      login({
        id: loggedInUser.id,
        name: loggedInUser.name || "Administrator",
        email: loggedInUser.email || DEFAULT_ADMIN_EMAIL,
        role: loggedInUser.role || "Admin",
        password: loggedInUser.password || password,
      });

      /* =====================================================
         REMEMBER ME
      ===================================================== */

      if (rememberMe) {
        localStorage.setItem("ems-remember-username", username);
      } else {
        localStorage.removeItem("ems-remember-username");
      }

      /* =====================================================
         SUCCESS
      ===================================================== */

      setShowSuccess(true);

      setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 1300);
    } catch (error) {
      console.error("Login error:", error);

      setErrors({
        login: "Unable to sign in. Please try again.",
      });

      setIsLoggingIn(false);
    }
  };

  /* =========================================================
     FORGOT PASSWORD
  ========================================================= */

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    const email = forgotEmail.trim().toLowerCase();

    if (!email) {
      toast.error("Please enter your email address.");

      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");

      return;
    }

    setForgotLoading(true);

    try {
      /* =====================================================
         CHECK ADMIN REGISTERED EMAIL
      ===================================================== */

      const latestAdmin = getSavedAdmin();

      const registeredAdminEmail =
        latestAdmin?.email?.trim().toLowerCase() || DEFAULT_ADMIN_EMAIL;

      if (email === registeredAdminEmail) {
        toast.success("Password reset instructions sent successfully!");

        setForgotEmail("");

        setTimeout(() => {
          setShowForgotModal(false);
        }, 800);

        return;
      }

      /* =====================================================
         CHECK MOCKAPI USERS
      ===================================================== */

      try {
        const response = await api.get("/users");

        const users = Array.isArray(response.data) ? response.data : [];

        const registeredUser = users.find(
          (user) => user?.email?.trim().toLowerCase() === email,
        );

        if (registeredUser) {
          toast.success("Password reset instructions sent successfully!");

          setForgotEmail("");

          setTimeout(() => {
            setShowForgotModal(false);
          }, 800);

          return;
        }
      } catch (apiError) {
        console.error("Forgot password API error:", apiError);
      }

      toast.error("This email is not registered.");
    } finally {
      setForgotLoading(false);
    }
  };

  /* =========================================================
     CLOSE FORGOT
  ========================================================= */

  const closeForgotModal = () => {
    if (forgotLoading) {
      return;
    }

    setShowForgotModal(false);
    setForgotEmail("");
  };

  return (
    <div className="login-page">
      <div className="login-grid" />

      <div className="login-orb login-orb-one" />
      <div className="login-orb login-orb-two" />
      <div className="login-orb login-orb-three" />

      <main className="login-section">
        <div className="login-shell">
          {/* =================================================
              BRAND PANEL
          ================================================= */}

          <section className="login-brand-panel">
            <div className="brand-content">
              <div className="brand-top">
                <div className="brand-logo">
                  <span>E</span>
                </div>

                <div className="brand-name">
                  <strong>EMS</strong>
                  <span>Employee Management System</span>
                </div>
              </div>

              <div className="brand-divider" />

              <div className="brand-badge">
                <Sparkles size={13} />
                SMART WORKFORCE PLATFORM
              </div>

              <h2>
                Manage your
                <span> workforce smarter.</span>
              </h2>

              <p>
                A secure and modern workspace designed to manage employees,
                departments, roles and organizational data from one powerful
                dashboard.
              </p>

              <div className="brand-features">
                <div className="brand-feature">
                  <div className="feature-icon">
                    <ShieldCheck size={17} />
                  </div>

                  <div>
                    <strong>Secure Access</strong>
                    <span>Protected administrator authentication</span>
                  </div>
                </div>

                <div className="brand-feature">
                  <div className="feature-icon">
                    <UserRound size={17} />
                  </div>

                  <div>
                    <strong>Employee Management</strong>
                    <span>Everything in one organized workspace</span>
                  </div>
                </div>

                <div className="brand-feature">
                  <div className="feature-icon">
                    <KeyRound size={17} />
                  </div>

                  <div>
                    <strong>Dynamic Security</strong>
                    <span>Profile password changes update login</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="brand-footer">
              <span className="status-dot" />
              System operational
            </div>
          </section>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <section className="login-card">
            <div className="login-mobile-brand">
              <div className="login-mobile-logo">E</div>

              <div>
                <strong>EMS</strong>
                <span>Employee Management System</span>
              </div>
            </div>

            <div className="login-header">
              <div className="login-icon">
                <ShieldCheck size={22} />
              </div>

              <div className="login-heading">
                <span>ADMIN PORTAL</span>

                <h1>Welcome back</h1>

                <p>Sign in to continue to your dashboard.</p>
              </div>
            </div>

            {errors.login && (
              <div className="login-error">
                <span className="error-dot" />
                {errors.login}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* USERNAME */}

              <div className="login-form-group">
                <label htmlFor="username">Username</label>

                <div
                  className={`login-input ${
                    errors.username ? "input-error" : ""
                  }`}
                >
                  <UserRound size={18} />

                  <input
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    autoFocus
                  />
                </div>

                {errors.username && <small>{errors.username}</small>}
              </div>

              {/* PASSWORD */}

              <div className="login-form-group">
                <div className="password-label-row">
                  <label htmlFor="password">Password</label>

                  <span>SECURE</span>
                </div>

                <div
                  className={`login-input ${
                    errors.password ? "input-error" : ""
                  }`}
                >
                  <LockKeyhole size={18} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && <small>{errors.password}</small>}
              </div>

              {/* OPTIONS */}

              <div className="login-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                  />

                  <span className="custom-check">
                    <CheckCircle2 size={12} />
                  </span>

                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <span className="login-spinner" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn size={18} />
                    Sign in to dashboard
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            {/* =================================================
                DYNAMIC ADMIN DETAILS
            ================================================= */}

            <div className="admin-credentials">
              <div className="credentials-header">
                <div className="credentials-icon">
                  <ShieldCheck size={15} />
                </div>

                <div>
                  <strong>Administrator Access</strong>
                  <span>Current login credentials</span>
                </div>
              </div>

              <div className="credential-row">
                <span>Username</span>
                <b>{ADMIN_USERNAME}</b>
              </div>

              <div className="credential-row">
                <span>Password</span>
                <b>{currentAdminPassword}</b>
              </div>

              <div className="credential-row">
                <span>Email</span>
                <b>{adminEmail}</b>
              </div>

              <div className="dynamic-note">
                <span />
                Password changes from Profile are reflected here automatically.
              </div>
            </div>

            <div className="login-security">
              <ShieldCheck size={15} />
              <span>Secure session · Authorized personnel only</span>
            </div>

            <p className="login-footer">© 2026 EMS · All rights reserved.</p>
          </section>
        </div>
      </main>

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {showSuccess && (
        <div className="login-success-overlay">
          <div className="login-success-card">
            <div className="success-icon">
              <CheckCircle2 size={40} />
            </div>

            <span className="success-label">AUTHENTICATION SUCCESSFUL</span>

            <h2>Welcome back, Admin</h2>

            <p>
              Your identity has been verified. Redirecting you to the
              dashboard...
            </p>

            <div className="success-progress">
              <span />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          FORGOT PASSWORD
      ===================================================== */}

      {showForgotModal && (
        <div className="forgot-overlay" onClick={closeForgotModal}>
          <div
            className="forgot-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="forgot-close"
              onClick={closeForgotModal}
              disabled={forgotLoading}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="forgot-icon">
              <LockKeyhole size={22} />
            </div>

            <span className="forgot-label">ACCOUNT RECOVERY</span>

            <h2>Reset your password</h2>

            <p>
              Enter your registered email address. We'll verify your account and
              send reset instructions.
            </p>

            <form onSubmit={handleForgotPassword}>
              <div className="forgot-input">
                <Mail size={18} />

                <input
                  type="email"
                  placeholder="admin@ems.com"
                  value={forgotEmail}
                  onChange={(event) => setForgotEmail(event.target.value)}
                  autoFocus
                  disabled={forgotLoading}
                />
              </div>

              <button
                type="submit"
                className="forgot-submit"
                disabled={forgotLoading}
              >
                {forgotLoading ? (
                  <>
                    <span className="login-spinner" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Send reset instructions
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
