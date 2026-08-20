import { useEffect } from "react";

import {
  X,
  Mail,
  Phone,
  BriefcaseBusiness,
  CalendarDays,
  Wallet,
  Building2,
  UserRound,
} from "lucide-react";

import "./EmployeeViewModal.css";

function EmployeeViewModal({ employee, onClose }) {
  /* =========================
     ESC KEY
  ========================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Lock background page scroll
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // Restore background page scroll
      document.body.style.overflow = "";

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  /* =========================
     OUTSIDE CLICK
  ========================= */

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!employee) {
    return null;
  }

  /* =========================
     SALARY
  ========================= */

  const formattedSalary = employee.salary
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(employee.salary)
    : "Not specified";

  /* =========================
     INITIAL
  ========================= */

  const employeeInitial = employee.name?.charAt(0).toUpperCase() || "E";

  return (
    <div className="employee-view-overlay" onClick={handleOverlayClick}>
      <div
        className="employee-view-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-view-title"
      >
        {/* =========================
            HEADER
        ========================= */}

        <div className="employee-view-header">
          <div>
            <h2 id="employee-view-title">Employee Details</h2>

            <p>View employee information</p>
          </div>

          <button
            type="button"
            className="employee-view-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* =========================
            PROFILE
        ========================= */}

        <div className="employee-view-profile">
          <div className="employee-view-avatar">{employeeInitial}</div>

          <div className="employee-view-profile-info">
            <h3>{employee.name}</h3>

            <span>{employee.employeeId}</span>
          </div>

          <span
            className={
              employee.status === "Active"
                ? "employee-view-status active"
                : "employee-view-status inactive"
            }
          >
            <span className="employee-view-status-dot"></span>

            {employee.status}
          </span>
        </div>

        {/* =========================
            CONTACT INFORMATION
        ========================= */}

        <section className="employee-view-section">
          <div className="employee-view-section-title">
            <UserRound size={17} />

            <h4>Contact Information</h4>
          </div>

          <div className="employee-view-grid">
            {/* Email */}

            <div className="employee-view-item">
              <div className="employee-view-icon">
                <Mail size={17} />
              </div>

              <div>
                <span className="employee-view-label">Email</span>

                <strong className="employee-view-value">
                  {employee.email || "Not specified"}
                </strong>
              </div>
            </div>

            {/* Phone */}

            <div className="employee-view-item">
              <div className="employee-view-icon">
                <Phone size={17} />
              </div>

              <div>
                <span className="employee-view-label">Phone</span>

                <strong className="employee-view-value">
                  {employee.phone || "Not specified"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            WORK INFORMATION
        ========================= */}

        <section className="employee-view-section">
          <div className="employee-view-section-title">
            <BriefcaseBusiness size={17} />

            <h4>Work Information</h4>
          </div>

          <div className="employee-view-grid">
            {/* Department */}

            <div className="employee-view-item">
              <div className="employee-view-icon">
                <Building2 size={17} />
              </div>

              <div>
                <span className="employee-view-label">Department</span>

                <strong className="employee-view-value">
                  {employee.department || "Not specified"}
                </strong>
              </div>
            </div>

            {/* Position */}

            <div className="employee-view-item">
              <div className="employee-view-icon">
                <BriefcaseBusiness size={17} />
              </div>

              <div>
                <span className="employee-view-label">Position</span>

                <strong className="employee-view-value">
                  {employee.position || "Not specified"}
                </strong>
              </div>
            </div>

            {/* Joining Date */}

            <div className="employee-view-item">
              <div className="employee-view-icon">
                <CalendarDays size={17} />
              </div>

              <div>
                <span className="employee-view-label">Joining Date</span>

                <strong className="employee-view-value">
                  {employee.joiningDate || "Not specified"}
                </strong>
              </div>
            </div>

            {/* Salary */}

            <div className="employee-view-item">
              <div className="employee-view-icon">
                <Wallet size={17} />
              </div>

              <div>
                <span className="employee-view-label">Salary</span>

                <strong className="employee-view-value">
                  {formattedSalary}
                </strong>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="employee-view-footer">
          <button
            type="button"
            className="employee-view-close-action"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeViewModal;
