import { useState } from "react";
import {
  ShieldCheck,
  Mail,
  UserRound,
  KeyRound,
  CalendarDays,
  CheckCircle2,
  Edit3,
  X,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./Profile.css";

function Profile() {
  const { user } = useAuth();

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!user) {
    return null;
  }

  const displayName = user.name || "Administrator";
  const displayEmail = user.email || "admin@ems.com";
  const displayRole = user.role || "Admin";
  const displayId = user.id || "admin-001";

  const initials = displayName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  /* =========================
     EDIT PROFILE
  ========================= */

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();

    /*
      UI only for now.
      Later API / backend update can be connected here.
    */

    setShowEditModal(false);
  };

  /* =========================
     PASSWORD
  ========================= */

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }

    /*
      UI only for now.
      Password API can be connected later.
    */

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setShowPasswordModal(false);
  };

  return (
    <div className="admin-profile-page">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="profile-page-header">
        <div>
          <span className="profile-eyebrow">ADMINISTRATION</span>

          <h1>My Profile</h1>

          <p>Manage your administrator account and security settings.</p>
        </div>

        <div className="profile-header-status">
          <span className="status-dot" />
          Account Active
        </div>
      </div>

      {/* =========================
          PROFILE HERO
      ========================= */}

      <section className="profile-hero-card">
        <div className="profile-hero-background" />

        <div className="profile-avatar-large">{initials}</div>

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
          onClick={() => {
            setEditData({
              name: displayName,
              email: displayEmail,
            });

            setShowEditModal(true);
          }}
        >
          <Edit3 size={16} />
          Edit Profile
        </button>
      </section>

      {/* =========================
          CONTENT GRID
      ========================= */}

      <div className="profile-content-grid">
        {/* =========================
            PERSONAL INFORMATION
        ========================= */}

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

        {/* =========================
            SECURITY
        ========================= */}

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

              <span>Your administrator account is protected.</span>
            </div>
          </div>

          <button
            type="button"
            className="security-action-btn"
            onClick={() => setShowPasswordModal(true)}
          >
            <LockKeyhole size={17} />
            Change Password
          </button>
        </section>

        {/* =========================
            ACCOUNT STATUS
        ========================= */}

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
              <strong>Administrator</strong>
            </div>

            <div className="account-status-row">
              <span>Authentication</span>
              <strong>Protected</strong>
            </div>
          </div>
        </section>

        {/* =========================
            ADMIN ACCESS
        ========================= */}

        <section className="profile-section-card">
          <div className="section-card-header">
            <div className="section-icon access">
              <ShieldCheck size={19} />
            </div>

            <div>
              <h3>Admin Access</h3>
              <p>System permissions</p>
            </div>
          </div>

          <div className="permission-list">
            <div className="permission-item">
              <span>Dashboard</span>
              <CheckCircle2 size={17} />
            </div>

            <div className="permission-item">
              <span>Employee Management</span>
              <CheckCircle2 size={17} />
            </div>

            <div className="permission-item">
              <span>Administrator Access</span>
              <CheckCircle2 size={17} />
            </div>
          </div>
        </section>
      </div>

      {/* =========================
          EDIT PROFILE MODAL
      ========================= */}

      {showEditModal && (
        <div
          className="profile-modal-overlay"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="profile-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowEditModal(false)}
            >
              <X size={18} />
            </button>

            <div className="modal-icon">
              <Edit3 size={21} />
            </div>

            <span className="modal-eyebrow">ACCOUNT SETTINGS</span>

            <h2>Edit Profile</h2>

            <p>Update your administrator account information.</p>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-form-group">
                <label>Full Name</label>

                <div className="modal-input">
                  <UserRound size={17} />

                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
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
                    value={editData.email}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              <button type="submit" className="modal-submit-btn">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          CHANGE PASSWORD MODAL
      ========================= */}

      {showPasswordModal && (
        <div
          className="profile-modal-overlay"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="profile-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setShowPasswordModal(false)}
            >
              <X size={18} />
            </button>

            <div className="modal-icon security-modal">
              <LockKeyhole size={21} />
            </div>

            <span className="modal-eyebrow">SECURITY</span>

            <h2>Change Password</h2>

            <p>
              Keep your administrator account secure with a strong password.
            </p>

            <form onSubmit={handlePasswordSubmit}>
              <div className="modal-form-group">
                <label>Current Password</label>

                <div className="modal-input">
                  <LockKeyhole size={17} />

                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />

                  <button
                    type="button"
                    className="modal-password-toggle"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div className="modal-form-group">
                <label>New Password</label>

                <div className="modal-input">
                  <LockKeyhole size={17} />

                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />

                  <button
                    type="button"
                    className="modal-password-toggle"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="modal-form-group">
                <label>Confirm New Password</label>

                <div className="modal-input">
                  <LockKeyhole size={17} />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>

              <button type="submit" className="modal-submit-btn">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
