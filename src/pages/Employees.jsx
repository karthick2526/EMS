import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Plus,
  SlidersHorizontal,
  Eye,
  Pencil,
  Trash2,
  Users,
  UserCheck,
  UserX,
  X,
  Sparkles,
} from "lucide-react";

import api from "../api/api";
import AddEmployeeModal from "../components/employees/AddEmployeeModal";
import EmployeeViewModal from "../components/employees/EmployeeViewModal";
import EditEmployeeModal from "../components/employees/EditEmployeeModal";
import DeleteEmployeeModal from "../components/employees/DeleteEmployeeModal";

import "./Employees.css";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEditEmployee, setSelectedEditEmployee] = useState(null);
  const [selectedDeleteEmployee, setSelectedDeleteEmployee] = useState(null);

  const [toast, setToast] = useState(null);

  /* =========================
     FETCH EMPLOYEES
  ========================= */

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);

      const response = await api.get("/employees");

      setEmployees(response.data || []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     STATISTICS
  ========================= */

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active",
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "Inactive",
  ).length;

  /* =========================
     DEPARTMENTS
  ========================= */

  const departments = useMemo(() => {
    const uniqueDepartments = [
      ...new Set(
        employees.map((employee) => employee.department).filter(Boolean),
      ),
    ];

    return ["All", ...uniqueDepartments];
  }, [employees]);

  /* =========================
     FILTER EMPLOYEES
  ========================= */

  const filteredEmployees = useMemo(() => {
    return employees
      .filter((employee) => {
        const search = searchTerm.toLowerCase().trim();

        const matchesSearch =
          employee.name?.toLowerCase().includes(search) ||
          employee.employeeId?.toLowerCase().includes(search) ||
          employee.email?.toLowerCase().includes(search);

        const matchesDepartment =
          department === "All" || employee.department === department;

        const matchesStatus = status === "All" || employee.status === status;

        return matchesSearch && matchesDepartment && matchesStatus;
      })
      .sort((a, b) => {
        const idA = Number(a.employeeId?.replace(/\D/g, "")) || 0;
        const idB = Number(b.employeeId?.replace(/\D/g, "")) || 0;

        return idA - idB;
      });
  }, [employees, searchTerm, department, status]);

  /* =========================
     CLEAR FILTERS
  ========================= */

  const clearFilters = () => {
    setSearchTerm("");
    setDepartment("All");
    setStatus("All");
  };

  const hasFilters = searchTerm || department !== "All" || status !== "All";

  /* =========================
     TOAST
  ========================= */

  const showToast = (message) => {
    setToast({
      type: "success",
      message,
    });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  /* =========================
     EMPLOYEE ADDED
  ========================= */

  const handleEmployeeAdded = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);

    setShowAddModal(false);

    showToast("Employee added successfully!");
  };

  /* =========================
     EMPLOYEE DELETED
  ========================= */

  const handleEmployeeDeleted = (deletedEmployeeId) => {
    setEmployees((prev) =>
      prev.filter(
        (employee) => String(employee.id) !== String(deletedEmployeeId),
      ),
    );

    setSelectedDeleteEmployee(null);

    showToast("Employee deleted successfully!");
  };

  /* =========================
     EMPLOYEE UPDATED
  ========================= */

  const handleEmployeeUpdated = (updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((item) =>
        item.id === updatedEmployee.id ? updatedEmployee : item,
      ),
    );

    setSelectedEditEmployee(null);

    showToast("Employee updated successfully!");
  };

  return (
    <div className="employees-page">
      {/* TOAST */}

      {toast && (
        <div className="employee-toast">
          <div className="toast-icon">✓</div>

          <div className="toast-content">
            <strong>Success</strong>
            <p>{toast.message}</p>
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
            className="toast-close"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* PAGE HERO */}

      <section className="employees-hero">
        <div className="employees-hero-content">
          <div className="employees-eyebrow">
            <Sparkles size={15} />
            PEOPLE MANAGEMENT
          </div>

          <h1>
            Your
            <span> People. </span>
          
            Your Organization.
          </h1>

          <p>
            Manage your workforce, track employee information, and keep
            everything organized from one place.
          </p>
        </div>

        <button
          type="button"
          className="add-employee-btn"
          onClick={() => setShowAddModal(true)}
        >
          <span className="add-icon">
            <Plus size={20} />
          </span>

          <span>Add Employee</span>
        </button>
      </section>

      {/* QUICK STATS */}

      <section className="employee-mini-stats">
        <div className="mini-stat total-stat">
          <div className="mini-stat-icon">
            <Users size={21} />
          </div>

          <div>
            <span>Total Workforce</span>
            <strong>{totalEmployees}</strong>
          </div>

          <div className="mini-stat-line" />
        </div>

        <div className="mini-stat active-stat">
          <div className="mini-stat-icon">
            <UserCheck size={21} />
          </div>

          <div>
            <span>Active</span>
            <strong>{activeEmployees}</strong>
          </div>

          <div className="mini-stat-percent">
            {totalEmployees
              ? Math.round((activeEmployees / totalEmployees) * 100)
              : 0}
            %
          </div>
        </div>

        <div className="mini-stat inactive-stat">
          <div className="mini-stat-icon">
            <UserX size={21} />
          </div>

          <div>
            <span>Inactive</span>
            <strong>{inactiveEmployees}</strong>
          </div>

          <div className="mini-stat-percent">
            {totalEmployees
              ? Math.round((inactiveEmployees / totalEmployees) * 100)
              : 0}
            %
          </div>
        </div>
      </section>

      {/* FILTER AREA */}

      <section className="employee-filter-panel">
        <div className="filter-heading">
          <div className="filter-heading-icon">
            <SlidersHorizontal size={19} />
          </div>

          <div>
            <strong>Find employees</strong>
            <span>Search and filter your workforce</span>
          </div>
        </div>

        <div className="employee-filter-controls">
          {/* SEARCH */}

          <div className="employee-search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search name, ID or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchTerm("")}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* DEPARTMENT */}

          <div className="filter-select-wrap">
            <span>Department</span>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Departments" : item}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS */}

          <div className="filter-select-wrap">
            <span>Status</span>

            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {hasFilters && (
            <button
              type="button"
              className="clear-filter-btn"
              onClick={clearFilters}
            >
              <X size={17} />
              Clear
            </button>
          )}
        </div>
      </section>

      {/* EMPLOYEE LIST */}

      <section className="employee-list-card">
        <div className="employee-list-header">
          <div className="list-title">
            <div className="list-title-mark" />

            <div>
              <h3>Employee Directory</h3>

              <p>
                {filteredEmployees.length}{" "}
                {filteredEmployees.length === 1 ? "employee" : "employees"}{" "}
                displayed
              </p>
            </div>
          </div>

          <div className="result-pill">{filteredEmployees.length}</div>
        </div>

        {/* TABLE */}

        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="table-message">
                    <div className="table-loader">
                      <span />
                      <span />
                      <span />
                    </div>
                    Loading employees...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-message empty">
                    <div className="empty-icon">
                      <Users size={27} />
                    </div>

                    <strong>No employees found</strong>

                    <span>Try changing your search or filters.</span>

                    {hasFilters && (
                      <button type="button" onClick={clearFilters}>
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    style={{
                      "--row-index": index,
                    }}
                  >
                    {/* EMPLOYEE */}

                    <td>
                      <div className="employee-info">
                        <div className="employee-avatar">
                          {employee.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="employee-name-block">
                          <strong>{employee.name}</strong>
                          <span>{employee.employeeId}</span>
                        </div>
                      </div>
                    </td>

                    {/* DEPARTMENT */}

                    <td>
                      <span className="department-tag">
                        {employee.department || "—"}
                      </span>
                    </td>

                    {/* POSITION */}

                    <td>
                      <span className="position-text">
                        {employee.position || "—"}
                      </span>
                    </td>

                    {/* DATE */}

                    <td>
                      <span className="joining-date">
                        {employee.joiningDate || "—"}
                      </span>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={
                          employee.status === "Active"
                            ? "employee-status active"
                            : "employee-status inactive"
                        }
                      >
                        <i />
                        {employee.status}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="employee-actions">
                        <button
                          type="button"
                          title="View Employee"
                          className="action-btn view"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          <Eye size={18} />
                        </button>

                        <button
                          type="button"
                          title="Edit Employee"
                          className="action-btn edit"
                          onClick={() => setSelectedEditEmployee(employee)}
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          type="button"
                          title="Delete Employee"
                          className="action-btn delete"
                          onClick={() => setSelectedDeleteEmployee(employee)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODALS */}

      {showAddModal && (
        <AddEmployeeModal
          employees={employees}
          onClose={() => setShowAddModal(false)}
          onEmployeeAdded={handleEmployeeAdded}
        />
      )}

      {selectedEmployee && (
        <EmployeeViewModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {selectedEditEmployee && (
        <EditEmployeeModal
          employee={selectedEditEmployee}
          onClose={() => setSelectedEditEmployee(null)}
          onEmployeeUpdated={handleEmployeeUpdated}
        />
      )}

      {selectedDeleteEmployee && (
        <DeleteEmployeeModal
          employee={selectedDeleteEmployee}
          onClose={() => setSelectedDeleteEmployee(null)}
          onEmployeeDeleted={handleEmployeeDeleted}
        />
      )}
    </div>
  );
}

export default Employees;
