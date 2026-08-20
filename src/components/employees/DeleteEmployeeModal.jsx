import { useEffect, useState } from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

import api from "../../api/api";

import "./DeleteEmployeeModal.css";

function DeleteEmployeeModal({ employee, onClose, onEmployeeDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     ESC KEY + BODY SCROLL
  ========================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, isDeleting]);

  /* =========================
     OUTSIDE CLICK
  ========================= */

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isDeleting) {
      onClose();
    }
  };

  /* =========================
     DELETE EMPLOYEE
  ========================= */

  const handleDelete = async () => {
    if (isDeleting) return;

    if (!employee || employee.id === undefined || employee.id === null) {
      setError("Employee database ID is missing.");
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      const id = employee.id;

      console.log("DELETE START");
      console.log("Employee:", employee);
      console.log("ID:", id);
      console.log("URL:", `/employees/${id}`);

      await api.delete(`/employees/${id}`);

      console.log("DELETE SUCCESS");

      onEmployeeDeleted(id);
      onClose();
    } catch (error) {
      console.error("DELETE ERROR:", error);
      console.error("STATUS:", error.response?.status);
      console.error("DATA:", error.response?.data);

      setError(
        error.response?.data?.message ||
          "Failed to delete employee. Please try again.",
      );

      setIsDeleting(false);
    }
  };

  /* =========================
     NO EMPLOYEE
  ========================= */

  if (!employee) {
    return null;
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="delete-employee-overlay" onClick={handleOverlayClick}>
      <div
        className="delete-employee-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-employee-title"
      >
        {/* =========================
            CLOSE BUTTON
        ========================= */}

        <button
          type="button"
          className="delete-close-btn"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Close"
        >
          <X size={19} />
        </button>

        {/* =========================
            WARNING ICON
        ========================= */}

        <div className="delete-warning-icon">
          <Trash2 size={24} />
        </div>

        {/* =========================
            CONTENT
        ========================= */}

        <div className="delete-employee-content">
          <h2 id="delete-employee-title">Delete Employee?</h2>

          <p>
            Are you sure you want to delete <strong>{employee.name}</strong>?
          </p>

          {/* EMPLOYEE INFO */}

          <div className="delete-employee-info">
            <span>Employee ID</span>

            <strong>{employee.employeeId || "N/A"}</strong>
          </div>

          {/* WARNING */}

          <div className="delete-warning-message">
            <AlertTriangle size={16} />

            <span>This action cannot be undone.</span>
          </div>

          {/* =========================
              API ERROR
          ========================= */}

          {error && <div className="delete-api-error">{error}</div>}
        </div>

        {/* =========================
            FOOTER
        ========================= */}

        <div className="delete-employee-footer">
          {/* CANCEL */}

          <button
            type="button"
            className="delete-cancel-btn"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          {/* DELETE */}

          <button
            type="button"
            className="delete-confirm-btn"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="delete-spinner" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Delete Employee
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteEmployeeModal;
