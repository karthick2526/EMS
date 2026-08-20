import { useEffect, useState } from "react";
import { X, UserRound, Mail, Phone, Wallet } from "lucide-react";

import api from "../../api/api";
import "./EditEmployeeModal.css";

const departmentPositions = {
  Engineering: [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Software Engineer",
  ],

  Design: ["UI/UX Designer", "Product Designer", "Graphic Designer"],

  Marketing: [
    "Marketing Executive",
    "Digital Marketing Specialist",
    "Marketing Manager",
  ],

  HR: ["HR Executive", "HR Manager", "Talent Acquisition Specialist"],

  Finance: ["Accountant", "Financial Analyst", "Finance Manager"],

  Sales: ["Sales Executive", "Sales Manager", "Business Development Executive"],
};

function EditEmployeeModal({ employee, onClose, onEmployeeUpdated }) {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    joiningDate: "",
    salary: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  /* =========================
     LOAD EMPLOYEE DATA
  ========================= */

  useEffect(() => {
    if (!employee) return;

    const emailParts = employee.email?.split("@") || ["", "company.com"];

    setFormData({
      employeeId: employee.employeeId || "",
      name: employee.name || "",
      email: emailParts[0] || "",
      phone: employee.phone || "",
      department: employee.department || "",
      position: employee.position || "",
      joiningDate: employee.joiningDate || "",
      salary: employee.salary || "",
      status: employee.status || "Active",
    });

    setErrors({});
    setApiError("");
    setSuccessMessage("");
  }, [employee]);

  /* =========================
     ESC KEY + BODY SCROLL
  ========================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, isSaving]);

  /* =========================
     OUTSIDE CLICK
  ========================= */

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !isSaving) {
      onClose();
    }
  };

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
    }));

    setApiError("");
  };

  /* =========================
     PHONE CHANGE
  ========================= */

  const handlePhoneChange = (event) => {
    const value = event.target.value.replace(/\D/g, "").slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));

    setErrors((prev) => ({
      ...prev,
      phone: "",
    }));

    setApiError("");
  };

  /* =========================
     DEPARTMENT CHANGE
  ========================= */

  const handleDepartmentChange = (event) => {
    const department = event.target.value;

    const positions = departmentPositions[department] || [];

    setFormData((prev) => ({
      ...prev,
      department,
      position: positions.includes(prev.position) ? prev.position : "",
    }));

    setErrors((prev) => ({
      ...prev,
      department: "",
      position: "",
    }));

    setApiError("");
  };

  /* =========================
     VALIDATION
  ========================= */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.department) {
      newErrors.department = "Please select a department";
    }

    if (!formData.position) {
      newErrors.position = "Please select a position";
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = "Joining date is required";
    }

    if (!formData.salary) {
      newErrors.salary = "Salary is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     SUBMIT + PATCH API
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSaving) return;

    setApiError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    const updatedEmployee = {
      ...employee,

      employeeId: formData.employeeId,

      name: formData.name.trim(),

      email: `${formData.email.trim()}@company.com`,

      phone: formData.phone,

      department: formData.department,

      position: formData.position,

      joiningDate: formData.joiningDate,

      salary: Number(formData.salary),

      status: formData.status,
    };

    try {
      setIsSaving(true);

      /* =========================
         UPDATE EMPLOYEE IN MOCKAPI
      ========================= */

      const response = await api.put(
        `/employees/${employee.id}`,
        updatedEmployee,
      );

      console.log("EDIT EMPLOYEE:", employee);
      console.log("EDIT ID:", employee.id);
      console.log(
        "EDIT URL:",
        `${import.meta.env.VITE_API_URL}/employees/${employee.id}`,
      );

      console.log("Employee updated successfully:", response.data);

      setSuccessMessage("Employee updated successfully");

      /*
        Give the user time to see
        the success message.
      */

      setTimeout(() => {
        onEmployeeUpdated(response.data);
      }, 800);
    } catch (error) {
      console.error(
        "Failed to update employee:",
        error.response?.data || error.message,
      );

      setApiError("Failed to update employee. Please try again.");

      setIsSaving(false);
    }
  };

  if (!employee) {
    return null;
  }

  const positions = departmentPositions[formData.department] || [];

  return (
    <div className="edit-employee-overlay" onClick={handleOverlayClick}>
      {/* =========================
          SUCCESS POPUP
      ========================= */}

      {successMessage && (
        <div className="edit-success-popup">
          <div className="edit-success-icon">✓</div>

          <div>
            <strong>Success</strong>

            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* =========================
          MODAL
      ========================= */}

      <div
        className="edit-employee-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-employee-title"
      >
        {/* =========================
            HEADER
        ========================= */}

        <div className="edit-employee-header">
          <div>
            <h2 id="edit-employee-title">Edit Employee</h2>

            <p>Update employee information</p>
          </div>

          <button
            type="button"
            className="edit-close-btn"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* =========================
            API ERROR
        ========================= */}

        {apiError && <div className="edit-api-error">{apiError}</div>}

        {/* =========================
            FORM
        ========================= */}

        <form className="edit-employee-form" onSubmit={handleSubmit}>
          {/* Employee ID */}

          <div className="edit-form-group">
            <label>Employee ID</label>

            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              disabled
            />

            <small>Employee ID cannot be changed</small>
          </div>

          {/* Name */}

          <div className="edit-form-group">
            <label>
              Full Name <span>*</span>
            </label>

            <div className="edit-input-wrapper">
              <UserRound size={17} />

              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {errors.name && <p className="edit-error">{errors.name}</p>}
          </div>

          {/* Email */}

          <div className="edit-form-group">
            <label>
              Email <span>*</span>
            </label>

            <div className="edit-input-wrapper">
              <Mail size={17} />

              <input
                type="text"
                name="email"
                placeholder="username"
                value={formData.email}
                onChange={handleChange}
              />

              <span className="email-domain">@company.com</span>
            </div>

            {errors.email && <p className="edit-error">{errors.email}</p>}
          </div>

          {/* Phone */}

          <div className="edit-form-group">
            <label>
              Phone Number <span>*</span>
            </label>

            <div className="edit-input-wrapper">
              <Phone size={17} />

              <input
                type="tel"
                name="phone"
                placeholder="10 digit phone number"
                value={formData.phone}
                onChange={handlePhoneChange}
                maxLength={10}
              />
            </div>

            <small>{formData.phone.length}/10 digits</small>

            {errors.phone && <p className="edit-error">{errors.phone}</p>}
          </div>

          {/* Department + Position */}

          <div className="edit-form-row">
            <div className="edit-form-group">
              <label>
                Department <span>*</span>
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleDepartmentChange}
              >
                <option value="">Select department</option>

                {Object.keys(departmentPositions).map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              {errors.department && (
                <p className="edit-error">{errors.department}</p>
              )}
            </div>

            <div className="edit-form-group">
              <label>
                Position <span>*</span>
              </label>

              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                disabled={!formData.department}
              >
                <option value="">
                  {formData.department
                    ? "Select position"
                    : "Select department first"}
                </option>

                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>

              {errors.position && (
                <p className="edit-error">{errors.position}</p>
              )}
            </div>
          </div>

          {/* Joining Date + Salary */}

          <div className="edit-form-row">
            <div className="edit-form-group">
              <label>
                Joining Date <span>*</span>
              </label>

              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
              />

              {errors.joiningDate && (
                <p className="edit-error">{errors.joiningDate}</p>
              )}
            </div>

            <div className="edit-form-group">
              <label>
                Salary <span>*</span>
              </label>

              <div className="edit-input-wrapper">
                <Wallet size={17} />

                <input
                  type="number"
                  name="salary"
                  placeholder="Enter salary"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              {errors.salary && <p className="edit-error">{errors.salary}</p>}
            </div>
          </div>

          {/* Status */}

          <div className="edit-form-group">
            <label>Employment Status</label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Footer */}

          <div className="edit-employee-footer">
            <button
              type="button"
              className="edit-cancel-btn"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>

            <button type="submit" className="edit-save-btn" disabled={isSaving}>
              {isSaving ? (
                <>
                  <span className="edit-save-spinner" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEmployeeModal;
