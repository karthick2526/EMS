import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

import api from "../../api/api";
import "./AddEmployeeModal.css";

const departmentPositions = {
  Engineering: [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UI/UX Designer",
    "QA Engineer",
  ],

  HR: [
    "HR Executive",
    "HR Manager",
    "Recruiter",
    "Talent Acquisition Specialist",
  ],

  Finance: [
    "Accountant",
    "Financial Analyst",
    "Finance Executive",
    "Finance Manager",
  ],

  Marketing: [
    "Marketing Executive",
    "Digital Marketing Specialist",
    "Content Strategist",
    "Marketing Manager",
  ],

  Sales: [
    "Sales Executive",
    "Sales Manager",
    "Business Development Executive",
    "Account Manager",
  ],
};

function AddEmployeeModal({ employees = [], onClose, onEmployeeAdded }) {
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
  const [saving, setSaving] = useState(false);

  /* =========================================================
     LOCK BACKGROUND SCROLL WHEN MODAL IS OPEN
  ========================================================= */

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  /* =========================================================
     GENERATE EMPLOYEE ID
  ========================================================= */

  const generateEmployeeId = () => {
    if (!employees || employees.length === 0) {
      return "EMP001";
    }

    const usedNumbers = new Set(
      employees
        .map((employee) => {
          const match = employee.employeeId?.match(/^EMP(\d+)$/i);

          return match ? Number(match[1]) : null;
        })
        .filter((number) => number !== null && number > 0),
    );

    let nextNumber = 1;

    while (usedNumbers.has(nextNumber)) {
      nextNumber++;
    }

    return `EMP${String(nextNumber).padStart(3, "0")}`;
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      employeeId: generateEmployeeId(),
    }));
  }, [employees]);

  /* =========================================================
     POSITION OPTIONS
  ========================================================= */

  const positionOptions = useMemo(() => {
    return departmentPositions[formData.department] || [];
  }, [formData.department]);

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) {
        return;
      }

      if (value.length > 10) {
        return;
      }
    }

    if (name === "email") {
      const localPart = value.split("@")[0];

      setFormData((prev) => ({
        ...prev,
        email: localPart,
      }));

      setErrors((prev) => ({
        ...prev,
        email: "",
      }));

      return;
    }

    if (name === "department") {
      setFormData((prev) => ({
        ...prev,
        department: value,
        position: "",
      }));

      setErrors((prev) => ({
        ...prev,
        department: "",
        position: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    const newErrors = {};

    const employeeIdExists = employees.some(
      (employee) =>
        employee.employeeId?.toLowerCase() ===
        formData.employeeId.toLowerCase(),
    );

    if (employeeIdExists) {
      newErrors.employeeId = "Employee ID already used";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(`${formData.email}@company.com`)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.position) {
      newErrors.position = "Position is required";
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = "Joining date is required";
    }

    if (formData.salary && Number(formData.salary) < 0) {
      newErrors.salary = "Salary cannot be negative";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const finalEmail = `${formData.email}@company.com`;

      const response = await api.post("/employees", {
        employeeId: formData.employeeId,
        name: formData.name.trim(),
        email: finalEmail,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        joiningDate: formData.joiningDate,
        salary: formData.salary ? Number(formData.salary) : 0,
        status: formData.status,
      });

      console.log("Employee created in MockAPI:", response.data);

      onEmployeeAdded(response.data);

      window.dispatchEvent(
        new CustomEvent("employee-added", {
          detail: {
            message: "Employee added successfully!",
          },
        }),
      );

      onClose();
    } catch (error) {
      console.error(
        "Failed to add employee:",
        error.response?.data || error.message,
      );

      setErrors({
        submit: "Failed to add employee. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     CLOSE
  ========================================================= */

  const handleClose = () => {
    if (saving) {
      return;
    }

    onClose();
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="employee-modal" onMouseDown={(e) => e.stopPropagation()}>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="modal-header">
          <div className="modal-title-area">
            <h2>Add Employee</h2>

            <p>Add a new employee to your organization.</p>
          </div>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close modal"
            title="Close"
          >
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>

        {/* =====================================================
            FORM
        ===================================================== */}

        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Employee ID */}

            <div className="form-field">
              <label>Employee ID</label>

              <input
                type="text"
                value={formData.employeeId}
                disabled
                className="disabled-input"
              />

              {errors.employeeId && (
                <small className="form-error">{errors.employeeId}</small>
              )}
            </div>

            {/* Full Name */}

            <div className="form-field">
              <label>
                Full Name <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={saving}
              />

              {errors.name && (
                <small className="form-error">{errors.name}</small>
              )}
            </div>

            {/* Email */}

            <div className="form-field">
              <label>
                Email <span>*</span>
              </label>

              <div className="email-input-wrapper">
                <input
                  type="text"
                  name="email"
                  placeholder="arun"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={saving}
                />

                <span>@company.com</span>
              </div>

              {errors.email && (
                <small className="form-error">{errors.email}</small>
              )}
            </div>

            {/* Phone */}

            <div className="form-field">
              <label>
                Phone <span>*</span>
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="9876543210"
                maxLength="10"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={saving}
              />

              {errors.phone && (
                <small className="form-error">{errors.phone}</small>
              )}
            </div>

            {/* Department */}

            <div className="form-field">
              <label>
                Department <span>*</span>
              </label>

              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled={saving}
              >
                <option value="">Select department</option>

                {Object.keys(departmentPositions).map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>

              {errors.department && (
                <small className="form-error">{errors.department}</small>
              )}
            </div>

            {/* Position */}

            <div className="form-field">
              <label>
                Position <span>*</span>
              </label>

              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                disabled={!formData.department || saving}
              >
                <option value="">
                  {formData.department
                    ? "Select position"
                    : "Select department first"}
                </option>

                {positionOptions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>

              {errors.position && (
                <small className="form-error">{errors.position}</small>
              )}
            </div>

            {/* Joining Date */}

            <div className="form-field">
              <label>
                Joining Date <span>*</span>
              </label>

              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleInputChange}
                disabled={saving}
              />

              {errors.joiningDate && (
                <small className="form-error">{errors.joiningDate}</small>
              )}
            </div>

            {/* Salary */}

            <div className="form-field">
              <label>Salary</label>

              <input
                type="number"
                name="salary"
                placeholder="50000"
                min="0"
                value={formData.salary}
                onChange={handleInputChange}
                disabled={saving}
              />

              {errors.salary && (
                <small className="form-error">{errors.salary}</small>
              )}
            </div>

            {/* Status */}

            <div className="form-field">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={saving}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Submit Error */}

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          {/* Footer */}

          <div className="modal-footer">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-employee-btn"
              disabled={saving}
            >
              {saving ? "Adding..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEmployeeModal;
