
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  ShieldCheck,
  Mail,
  UserRound,
  KeyRound,
  CheckCircle2,
  Edit3,
  X,
  LockKeyhole,
  Eye,
  EyeOff,
  Save,
  UserCog,
  Shield,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import api from "../api/api";

import "./Profile.css";

function Profile() {
  const { user, updateUser } = useAuth();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({});

  /* =========================================================
     PREVENT BACKGROUND SCROLL
  ========================================================= */

  useEffect(() => {
    const modalOpen = showEditModal || showPasswordModal;

    document.body.style.overflow = modalOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [showEditModal, showPasswordModal]);

  /* =========================================================
     USER CHECK
  ========================================================= */

  if (!user) {
    return null;
  }

  /* =========================================================
     USER DATA
  ========================================================= */

  const displayName = user.name || "Administrator";
  const displayEmail = user.email || "admin@ems.com";
  const displayRole = user.role || "Admin";
  const displayId = user.id || "admin-001";

  const initials = displayName
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* =========================================================
     PERMISSIONS
  ========================================================= */

  const permissions = [
    {
      label: "Dashboard",
      icon: CheckCircle2,
    },
    {
      label: "Employee Management",
      icon: CheckCircle2,
    },
    {
      label: "Department Management",
      icon: CheckCircle2,
    },
    {
      label: "Administrator Access",
      icon: CheckCircle2,
    },
  ];

  /* =========================================================
     EDIT PROFILE
  ========================================================= */

  const openEditModal = () => {
    setEditData({
      name: displayName,
      email: displayEmail,
    });

    setShowEditModal(true);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    if (savingProfile) {
      return;
    }

    const name = editData.name.trim();
    const email = editData.email.trim();

    if (!name) {
      toast.error("Full name is required");
      return;
    }

    if (!email) {
      toast.error("Email address is required");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid email address");
      return;
    }

    try {
      setSavingProfile(true);

      /*
        =====================================================
        MOCKAPI PROFILE UPDATE
        =====================================================

        API users with a real ID will be updated.

        Demo admin account uses localStorage/AuthContext.
      */

      if (user.id && user.id !== "admin-001") {
        await api.patch(`/users/${user.id}`, {
          name,
          email,
        });
      }

      /* Update local authentication state */
      updateUser({
        name,
        email,
      });

      setShowEditModal(false);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update failed:", error);

      toast.error(
        error?.response?.data?.message || "Failed to update profile",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  /* =========================================================
     PASSWORD INPUT
  ========================================================= */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* =========================================================
     PASSWORD VALIDATION
  ========================================================= */

  const validatePassword = () => {
    const errors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "Password must contain at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (
      passwordData.newPassword !== passwordData.confirmPassword
    ) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (
      passwordData.currentPassword &&
      passwordData.newPassword &&
      passwordData.currentPassword === passwordData.newPassword
    ) {
      errors.newPassword =
        "New password must be different from current password";
    }

    setPasswordErrors(errors);

    return Object.keys(errors).length === 0;
  };

  /* =========================================================
     CHANGE PASSWORD
     
     IMPORTANT:
     Password is NOT updated in MockAPI.
     It is stored locally for demo authentication.
  ========================================================= */

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (savingPassword) {
      return;
    }

    if (!validatePassword()) {
      return;
    }

    try {
      setSavingPassword(true);

      const currentPassword = passwordData.currentPassword;
      const newPassword = passwordData.newPassword;

      /*
        =====================================================
        GET CURRENT PASSWORD
        =====================================================

        Admin password is stored in localStorage.

        Default:
        Admin@123
      */

      const savedPassword =
        localStorage.getItem("ems-admin-password") || "Admin@123";

      /* =====================================================
         VERIFY CURRENT PASSWORD
      ===================================================== */

      if (currentPassword !== savedPassword) {
        setPasswordErrors({
          currentPassword: "Current password is incorrect",
        });

        toast.error("Current password is incorrect");

        return;
      }

      /* =====================================================
         SAVE NEW PASSWORD LOCALLY
      ===================================================== */

      localStorage.setItem("ems-admin-password", newPassword);

      /*
        Also update AuthContext user object.
        This keeps the current session synchronized.
      */

      updateUser({
        password: newPassword,
      });

      /* =====================================================
         RESET FORM
      ===================================================== */

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setPasswordErrors({});

      setShowPasswordModal(false);

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Password update failed:", error);

      toast.error("Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  /* =========================================================
     OPEN PASSWORD MODAL
  ========================================================= */

  const openPasswordModal = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordErrors({});

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setShowPasswordModal(true);
  };

  /* =========================================================
     CLOSE PASSWORD MODAL
  ========================================================= */

  const closePasswordModal = () => {
    if (savingPassword) {
      return;
    }

    setShowPasswordModal(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordErrors({});

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  /* =========================================================
     CLOSE EDIT MODAL
  ========================================================= */

  const closeEditModal = () => {
    if (savingProfile) {
      return;
    }

    setShowEditModal(false);

    setEditData({
      name: "",
      email: "",
    });
  };

  return (
    <div className="admin-profile-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="profile-page-header">
        <div>
          <span className="profile-eyebrow">ADMINISTRATION</span>

          <h1>My Profile</h1>

          <p>
            Manage your administrator account and security settings.
          </p>
        </div>

        <div className="profile-header-status">
          <span className="status-dot" />
          Account Active
        </div>
      </div>

      {/* =====================================================
          PROFILE HERO
      ===================================================== */}

      <section className="profile-hero-card">
        <div className="profile-hero-background" />

        <div className="profile-avatar-large">
          {initials}
        </div>

        <div className="profile-hero-info">
          <div className="profile-name-row">
            <h2>{displayName}</h2>

            <span className="admin-badge">
              <ShieldCheck size={14} />
              {displayRole}
            </span>
          </div>

          <p className="profile-email">
            <Mail size={15} />
            {displayEmail}
          </p>

          <div className="profile-account-id">
            <span>Account ID</span>
            <strong>{displayId}</strong>
          </div>
        </div>

        <button
          type="button"
          className="profile-edit-btn"
          onClick={openEditModal}
        >
          <Edit3 size={16} />
          Edit Profile
        </button>
      </section>

      {/* =====================================================
          CONTENT GRID
      ===================================================== */}

      <div className="profile-content-grid">

        {/* PERSONAL INFORMATION */}

        <section className="profile-section-card">
          <div className="section-card-header">
            <div className="section-icon">
              <UserRound size={19} />
            </div>

            <div>
              <h3>Personal Information</h3>
              <p>Your administrator account details</p>
            </div>
          </div>

          <div className="profile-info-list">

            <div className="profile-info-item">
              <div className="info-icon">
                <UserRound size={17} />
              </div>

              <div>
                <span>Full Name</span>
                <strong>{displayName}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="info-icon">
                <Mail size={17} />
              </div>

              <div>
                <span>Email Address</span>
                <strong>{displayEmail}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="info-icon">
                <ShieldCheck size={17} />
              </div>

              <div>
                <span>Role</span>
                <strong>{displayRole}</strong>
              </div>
            </div>

            <div className="profile-info-item">
              <div className="info-icon">
                <KeyRound size={17} />
              </div>

              <div>
                <span>Account ID</span>
                <strong>{displayId}</strong>
              </div>
            </div>

          </div>
        </section>

        {/* SECURITY */}

        <section className="profile-section-card">
          <div className="section-card-header">
            <div className="section-icon security">
              <ShieldCheck size={19} />
            </div>

            <div>
              <h3>Security</h3>
              <p>Protect your administrator account</p>
            </div>
          </div>

          <div className="security-status">
            <div className="security-status-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <strong>Account secured</strong>
              <span>
                Your administrator account is protected.
              </span>
            </div>
          </div>

          <button
            type="button"
            className="security-action-btn"
            onClick={openPasswordModal}
          >
            <LockKeyhole size={17} />
            Change Password
          </button>
        </section>

        {/* ACCOUNT STATUS */}

        <section className="profile-section-card">
          <div className="section-card-header">
            <div className="section-icon status">
              <CheckCircle2 size={19} />
            </div>

            <div>
              <h3>Account Status</h3>
              <p>Current account information</p>
            </div>
          </div>

          <div className="account-status-card">

            <div className="account-status-row">
              <span>Status</span>

              <strong className="active-status">
                <span />
                Active
              </strong>
            </div>

            <div className="account-status-row">
              <span>Access Level</span>
              <strong>{displayRole}</strong>
            </div>

            <div className="account-status-row">
              <span>Authentication</span>
              <strong>Protected</strong>
            </div>

            <div className="account-status-row">
              <span>Account ID</span>
              <strong>{displayId}</strong>
            </div>

          </div>
        </section>

        {/* ADMIN ACCESS */}

        <section className="profile-section-card">
          <div className="section-card-header">
            <div className="section-icon access">
              <Shield size={19} />
            </div>

            <div>
              <h3>Admin Access</h3>
              <p>System permissions</p>
            </div>
          </div>

          <div className="permission-list">
            {permissions.map((permission) => {
              const PermissionIcon = permission.icon;

              return (
                <div
                  className="permission-item"
                  key={permission.label}
                >
                  <span>{permission.label}</span>

                  <PermissionIcon size={17} />
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* =====================================================
          EDIT PROFILE MODAL
      ===================================================== */}

      {showEditModal && (
        <div
          className="profile-modal-overlay"
          onClick={closeEditModal}
        >
          <div
            className="profile-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <button
              type="button"
              className="modal-close-btn"
              onClick={closeEditModal}
              disabled={savingProfile}
            >
              <X size={18} />
            </button>

            <div className="modal-icon">
              <UserCog size={21} />
            </div>

            <span className="modal-eyebrow">
              ACCOUNT SETTINGS
            </span>

            <h2>Edit Profile</h2>

            <p>
              Update your administrator account information.
            </p>

            <form onSubmit={handleEditSubmit}>

              <div className="modal-form-group">
                <label>Full Name</label>

                <div className="modal-input">
                  <UserRound size={17} />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={editData.name}
                    onChange={handleEditChange}
                    disabled={savingProfile}
                  />
                </div>
              </div>

              <div className="modal-form-group">
                <label>Email Address</label>

                <div className="modal-input">
                  <Mail size={17} />

                  <input
                    type="email"
                    name="email"
                    placeholder="admin@ems.com"
                    value={editData.email}
                    onChange={handleEditChange}
                    disabled={savingProfile}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="modal-submit-btn"
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <>
                    <span className="button-spinner" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* =====================================================
          CHANGE PASSWORD MODAL
      ===================================================== */}

      {showPasswordModal && (
        <div
          className="profile-modal-overlay"
          onClick={closePasswordModal}
        >
          <div
            className="profile-modal password-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <button
              type="button"
              className="modal-close-btn"
              onClick={closePasswordModal}
              disabled={savingPassword}
            >
              <X size={18} />
            </button>

            <div className="modal-icon security-modal">
              <LockKeyhole size={21} />
            </div>

            <span className="modal-eyebrow security-eyebrow">
              SECURITY
            </span>

            <h2>Change Password</h2>

            <p>
              Keep your administrator account secure with a strong
              password.
            </p>

            <form onSubmit={handlePasswordSubmit}>

              {/* CURRENT PASSWORD */}

              <div className="modal-form-group">
                <label>Current Password</label>

                <div
                  className={`modal-input ${
                    passwordErrors.currentPassword
                      ? "input-error"
                      : ""
                  }`}
                >
                  <LockKeyhole size={17} />

                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    name="currentPassword"
                    placeholder="Enter current password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    disabled={savingPassword}
                  />

                  <button
                    type="button"
                    className="modal-password-toggle"
                    onClick={() =>
                      setShowCurrentPassword(
                        (prev) => !prev,
                      )
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                {passwordErrors.currentPassword && (
                  <small className="password-error">
                    {passwordErrors.currentPassword}
                  </small>
                )}
              </div>

              {/* NEW PASSWORD */}

              <div className="modal-form-group">
                <label>New Password</label>

                <div
                  className={`modal-input ${
                    passwordErrors.newPassword
                      ? "input-error"
                      : ""
                  }`}
                >
                  <LockKeyhole size={17} />

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    placeholder="Enter new password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    disabled={savingPassword}
                  />

                  <button
                    type="button"
                    className="modal-password-toggle"
                    onClick={() =>
                      setShowNewPassword(
                        (prev) => !prev,
                      )
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                {passwordErrors.newPassword && (
                  <small className="password-error">
                    {passwordErrors.newPassword}
                  </small>
                )}
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="modal-form-group">
                <label>Confirm New Password</label>

                <div
                  className={`modal-input ${
                    passwordErrors.confirmPassword
                      ? "input-error"
                      : ""
                  }`}
                >
                  <LockKeyhole size={17} />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    disabled={savingPassword}
                  />

                  <button
                    type="button"
                    className="modal-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev,
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                {passwordErrors.confirmPassword && (
                  <small className="password-error">
                    {passwordErrors.confirmPassword}
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="modal-submit-btn"
                disabled={savingPassword}
              >
                {savingPassword ? (
                  <>
                    <span className="button-spinner" />
                    Updating...
                  </>
                ) : (
                  <>
                    <LockKeyhole size={16} />
                    Update Password
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

export default Profile;

