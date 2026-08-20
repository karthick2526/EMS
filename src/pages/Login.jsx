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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [forgotMessage, setForgotMessage] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);

  /* =========================
     DEMO ADMIN CREDENTIALS
  ========================= */

  const ADMIN_USERNAME = "admin";
  const ADMIN_PASSWORD = "Admin@123";

  /* =========================
     REDIRECT IF ALREADY LOGIN
  ========================= */

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
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

  /* =========================
     INPUT CHANGE
  ========================= */

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

  /* =========================
     VALIDATION
  ========================= */

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

  /* =========================
     LOGIN
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoggingIn(true);
    setErrors({});

    try {
      const username = formData.username.trim().toLowerCase();
      const password = formData.password;

      let loggedInUser = null;

      /* =========================
         DEMO ADMIN LOGIN
      ========================= */

      if (
        username === ADMIN_USERNAME.toLowerCase() &&
        password === ADMIN_PASSWORD
      ) {
        loggedInUser = {
          id: "admin-001",
          name: "Administrator",
          email: "admin@ems.com",
          role: "Admin",
        };
      } else {
        /* =========================
           API USER LOGIN
        ========================= */

        try {
          const response = await api.get("/users");

          const users = Array.isArray(response.data) ? response.data : [];

          loggedInUser = users.find((item) => {
            const itemEmail = item?.email?.trim().toLowerCase();

            return (
              (itemEmail === username ||
                item?.username?.trim().toLowerCase() === username) &&
              item?.password === password
            );
          });
        } catch (apiError) {
          console.error("User API error:", apiError);
        }
      }

      /* =========================
         INVALID LOGIN
      ========================= */

      if (!loggedInUser) {
        setErrors({
          login: "Invalid username or password",
        });

        setIsLoggingIn(false);
        return;
      }

      /* =========================
         AUTH CONTEXT LOGIN
      ========================= */

      login({
        id: loggedInUser.id,
        name: loggedInUser.name || "Administrator",
        email: loggedInUser.email || "admin@ems.com",
        role: loggedInUser.role || "Admin",
      });

      /* =========================
         REMEMBER ME
      ========================= */

      if (rememberMe) {
        localStorage.setItem("ems-remember-username", username);
      } else {
        localStorage.removeItem("ems-remember-username");
      }

      /* =========================
         SUCCESS
      ========================= */

      setShowSuccess(true);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1300);
    } catch (error) {
      console.error("Login error:", error);

      setErrors({
        login: "Unable to sign in. Please try again.",
      });

      setIsLoggingIn(false);
    }
  };

  /* =========================
     FORGOT PASSWORD
  ========================= */

  const handleForgotPassword = async (event) => {
    event.preventDefault();

    if (!forgotEmail.trim()) {
      setForgotMessage("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setForgotMessage("Please enter a valid email address.");
      return;
    }

    setForgotMessage(
      "If this email is registered, password reset instructions will be sent.",
    );
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail("");
    setForgotMessage("");
  };

  return (
    <div className="login-page">
      {/* =========================
          BACKGROUND
      ========================= */}

      <div className="login-grid" />

      <div className="login-orb login-orb-one" />
      <div className="login-orb login-orb-two" />
      <div className="login-orb login-orb-three" />

      {/* =========================
          MAIN
      ========================= */}

      <main className="login-section">
        <div className="login-shell">
          {/* =========================
              LEFT BRAND PANEL
          ========================= */}

          <section className="login-brand-panel">
            <div className="brand-content">
              <div className="brand-logo">
                <span>E</span>
              </div>

              <div className="brand-name">
                <strong>EMS</strong>
                <span>Employee Management System</span>
              </div>

              <div className="brand-divider" />

              <h2>
                Manage your
                <span> workforce smarter.</span>
              </h2>

              <p>
                A secure and modern workspace to manage employees, departments,
                roles, attendance and organizational data.
              </p>

              <div className="brand-features">
                <div className="brand-feature">
                  <div className="feature-icon">
                    <ShieldCheck size={17} />
                  </div>

                  <div>
                    <strong>Secure Access</strong>
                    <span>Protected admin authentication</span>
                  </div>
                </div>

                <div className="brand-feature">
                  <div className="feature-icon">
                    <UserRound size={17} />
                  </div>

                  <div>
                    <strong>Employee Management</strong>
                    <span>Everything in one workspace</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="brand-footer">
              <span className="status-dot" />
              System operational
            </div>
          </section>

          {/* =========================
              LOGIN PANEL
          ========================= */}

          <section className="login-card">
            <div className="login-mobile-brand">
              <div className="login-mobile-logo">E</div>

              <div>
                <strong>EMS</strong>
                <span>Employee Management System</span>
              </div>
            </div>

            {/* HEADER */}

            <div className="login-header">
              <div className="login-icon">
                <ShieldCheck size={22} />
              </div>

              <div className="login-heading">
                <span>ADMIN PORTAL</span>

                <h1>Welcome back</h1>

                <p>Sign in to access your employee management dashboard.</p>
              </div>
            </div>

            {/* ERROR */}

            {errors.login && (
              <div className="login-error">
                <span className="error-dot" />

                {errors.login}
              </div>
            )}

            {/* FORM */}

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
                    placeholder="Enter admin username"
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

                  <span>Protected</span>
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

              {/* SUBMIT */}

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

            {/* DEMO CREDENTIAL */}

            <div className="admin-hint">
              <div className="hint-icon">
                <ShieldCheck size={15} />
              </div>

              <div>
                <strong>Administrator access</strong>

                <p>
                  Demo username: <b>admin</b>
                </p>
              </div>
            </div>

            {/* SECURITY */}

            <div className="login-security">
              <ShieldCheck size={15} />

              <span>Secure session · Authorized personnel only</span>
            </div>

            <p className="login-footer">© 2026 EMS · All rights reserved.</p>
          </section>
        </div>
      </main>

      {/* =========================
          SUCCESS POPUP
      ========================= */}

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

      {/* =========================
          FORGOT PASSWORD
      ========================= */}

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
              Enter your registered email address and we'll help you recover
              access to your account.
            </p>

            <form onSubmit={handleForgotPassword}>
              <div className="forgot-input">
                <Mail size={18} />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={forgotEmail}
                  onChange={(event) => {
                    setForgotEmail(event.target.value);
                    setForgotMessage("");
                  }}
                  autoFocus
                />
              </div>

              {forgotMessage && (
                <div className="forgot-message">{forgotMessage}</div>
              )}

              <button type="submit" className="forgot-submit">
                Send reset instructions
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
