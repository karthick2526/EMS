import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  ArrowUpRight,
  RefreshCw,
  Activity,
  ChevronRight,
  BriefcaseBusiness,
} from "lucide-react";

import api from "../api/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH EMPLOYEES
  ========================= */

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/employees");

      setEmployees(response.data || []);
    } catch (error) {
      console.error("Failed to fetch employees:", error);

      setError("Unable to load employee data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

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

  const totalDepartments = new Set(
    employees.map((employee) => employee.department).filter(Boolean),
  ).size;

  const activePercentage =
    totalEmployees > 0
      ? Math.round((activeEmployees / totalEmployees) * 100)
      : 0;

  const inactivePercentage =
    totalEmployees > 0
      ? Math.round((inactiveEmployees / totalEmployees) * 100)
      : 0;

  /* =========================
     DEPARTMENT OVERVIEW
  ========================= */

  const departmentOverview = useMemo(() => {
    const departmentMap = {};

    employees.forEach((employee) => {
      const department = employee.department;

      if (!department) return;

      departmentMap[department] = (departmentMap[department] || 0) + 1;
    });

    return Object.entries(departmentMap)
      .map(([name, count]) => ({
        name,
        count,
        percentage:
          totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [employees, totalEmployees]);

  /* =========================
     RECENT EMPLOYEES
  ========================= */

  const recentEmployees = useMemo(() => {
    return [...employees]
      .sort((a, b) => {
        const idA = Number(a.employeeId?.replace(/\D/g, "")) || 0;

        const idB = Number(b.employeeId?.replace(/\D/g, "")) || 0;

        return idB - idA;
      })
      .slice(0, 5);
  }, [employees]);

  /* =========================
     TOP DEPARTMENT
  ========================= */

  const topDepartment = departmentOverview[0];

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">
          <div className="loading-orbit">
            <div className="dashboard-spinner"></div>
          </div>

          <strong>Preparing your dashboard</strong>

          <p>Loading workforce analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* =================================================
          HERO HEADER
      ================================================= */}

      <section className="dashboard-hero">
        <div className="hero-copy">
          <span className="dashboard-eyebrow">
            <span className="eyebrow-dot"></span>
            WORKFORCE OVERVIEW
          </span>

          <h1>
            Good to see you,
            <span> Admin.</span>
          </h1>

          <p>
            Keep track of your workforce, departments and employee activity from
            one central workspace.
          </p>
        </div>

        <div className="hero-actions">
          {/* Refresh button only */}
          <button
            type="button"
            className="dashboard-refresh-btn"
            onClick={fetchEmployees}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>
      </section>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="dashboard-error">
          <div>
            <strong>Something went wrong</strong>
            <span>{error}</span>
          </div>

          <button type="button" onClick={fetchEmployees}>
            Try Again
          </button>
        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <section className="stats-grid">
        {/* TOTAL */}

        <article className="stat-card total-card">
          <div className="stat-top">
            <div className="stat-icon">
              <Users size={21} />
            </div>

            <span className="stat-mini-label">OVERALL</span>
          </div>

          <div className="stat-main">
            <span>Total Employees</span>

            <strong>{totalEmployees}</strong>
          </div>

          <div className="stat-footer">
            <span>
              <Activity size={13} />
              Organization workforce
            </span>

            <ArrowUpRight size={16} />
          </div>
        </article>

        {/* ACTIVE */}

        <article className="stat-card active-card">
          <div className="stat-top">
            <div className="stat-icon">
              <UserCheck size={21} />
            </div>

            <span className="stat-badge">{activePercentage}%</span>
          </div>

          <div className="stat-main">
            <span>Active Employees</span>

            <strong>{activeEmployees}</strong>
          </div>

          <div className="stat-progress">
            <div
              style={{
                width: `${activePercentage}%`,
              }}
            />
          </div>

          <div className="stat-footer">
            <span>Currently active</span>
            <span>{activePercentage}%</span>
          </div>
        </article>

        {/* INACTIVE */}

        <article className="stat-card inactive-card">
          <div className="stat-top">
            <div className="stat-icon">
              <UserX size={21} />
            </div>

            <span className="stat-badge">{inactivePercentage}%</span>
          </div>

          <div className="stat-main">
            <span>Inactive Employees</span>

            <strong>{inactiveEmployees}</strong>
          </div>

          <div className="stat-progress">
            <div
              style={{
                width: `${inactivePercentage}%`,
              }}
            />
          </div>

          <div className="stat-footer">
            <span>Currently inactive</span>
            <span>{inactivePercentage}%</span>
          </div>
        </article>

        {/* DEPARTMENT */}

        <article className="stat-card department-card">
          <div className="stat-top">
            <div className="stat-icon">
              <Building2 size={21} />
            </div>

            <span className="stat-mini-label">TEAMS</span>
          </div>

          <div className="stat-main">
            <span>Departments</span>

            <strong>{totalDepartments}</strong>
          </div>

          <div className="department-highlight">
            <BriefcaseBusiness size={14} />

            <span>
              {topDepartment
                ? `${topDepartment.name} leads`
                : "No departments yet"}
            </span>
          </div>
        </article>
      </section>

      {/* =================================================
          ANALYTICS GRID
      ================================================= */}

      <section className="analytics-grid">
        {/* DEPARTMENT ANALYTICS */}

        <div className="dashboard-panel department-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">ANALYTICS</span>

              <h2>Department distribution</h2>

              <p>How your workforce is distributed across teams.</p>
            </div>

            <div className="panel-header-icon">
              <Building2 size={19} />
            </div>
          </div>

          {departmentOverview.length > 0 ? (
            <div className="department-list">
              {departmentOverview.map((department, index) => (
                <div
                  className="department-row"
                  key={department.name}
                  style={{
                    "--delay": `${index * 0.08}s`,
                  }}
                >
                  <div className="department-left">
                    <div className="department-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="department-avatar">
                      {department.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="department-name">
                      <strong>{department.name}</strong>

                      <span>
                        {department.count}{" "}
                        {department.count === 1 ? "employee" : "employees"}
                      </span>
                    </div>
                  </div>

                  <div className="department-right">
                    <strong>{department.percentage}%</strong>

                    <div className="department-track">
                      <div
                        className="department-fill"
                        style={{
                          width: `${department.percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              <Building2 size={26} />

              <span>No department data available.</span>
            </div>
          )}
        </div>

        {/* STATUS ANALYTICS */}

        <div className="dashboard-panel workforce-panel">
          <div className="panel-header">
            <div>
              <span className="panel-kicker">WORKFORCE</span>

              <h2>Employee activity</h2>

              <p>Current status of your organization.</p>
            </div>

            <div className="panel-header-icon">
              <Activity size={19} />
            </div>
          </div>

          <div className="workforce-content">
            <div
              className="workforce-ring"
              style={{
                "--active-degree": `${activePercentage * 3.6}deg`,
              }}
            >
              <div className="workforce-ring-inner">
                <strong>{activePercentage}%</strong>

                <span>Active</span>
              </div>
            </div>

            <div className="workforce-details">
              <div className="workforce-total">
                <span>Total workforce</span>

                <strong>{totalEmployees}</strong>
              </div>

              <div className="workforce-item">
                <span className="workforce-label">
                  <i className="active-dot"></i>
                  Active
                </span>

                <strong>{activeEmployees}</strong>
              </div>

              <div className="workforce-item">
                <span className="workforce-label">
                  <i className="inactive-dot"></i>
                  Inactive
                </span>

                <strong>{inactiveEmployees}</strong>
              </div>
            </div>
          </div>

          <div className="workforce-message">
            <span className="message-dot"></span>

            {activePercentage >= 80
              ? "Your workforce is highly active."
              : "Review inactive employees regularly."}
          </div>
        </div>
      </section>

      {/* =================================================
          RECENT EMPLOYEES
      ================================================= */}

      <section className="dashboard-panel recent-panel">
        <div className="panel-header">
          <div>
            <span className="panel-kicker">ACTIVITY</span>

            <h2>Recent employees</h2>

            <p>Latest employee records in your organization.</p>
          </div>

          {/* Navigate to Employees page */}

          <button
            type="button"
            className="view-all-btn"
            onClick={() => navigate("/employees")}
          >
            View all
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="employee-table-wrapper">
          <table className="employee-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentEmployees.length > 0 ? (
                recentEmployees.map((employee, index) => (
                  <tr
                    key={employee.id}
                    style={{
                      "--delay": `${index * 0.07}s`,
                    }}
                  >
                    <td>
                      <div className="employee-cell">
                        <div className="employee-avatar">
                          {employee.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{employee.name}</strong>

                          <span>{employee.employeeId}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="table-department">
                        {employee.department || "—"}
                      </span>
                    </td>

                    <td>{employee.position || "—"}</td>

                    <td>
                      <span
                        className={
                          employee.status === "Active"
                            ? "employee-status active"
                            : "employee-status inactive"
                        }
                      >
                        <i></i>
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-row">
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
