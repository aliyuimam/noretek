"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

import PropertyForm from "@/MainComponent/(SubComponents)/EnrollmentComponent/PropertyForm";
import PropertyUnitForm from "@/MainComponent/(SubComponents)/EnrollmentComponent/PropertyUnitForm";
import PropertyTablesEnrollment from "@/MainComponent/(SubComponents)/EnrollmentComponent/PropertyTablesEnrollment";
import PropertyUnitTablesEnrollment from "@/MainComponent/(SubComponents)/EnrollmentComponent/PropertyUnitTablesEnrollment";
import CustomerSignUp from "@/MainComponent/(SubComponents)/EnrollmentComponent/CreateCustomer";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const router = useRouter();

  const [activeContent, setActiveContent] = useState("Dashboard");

  // auth states
  const [user, setUser] = useState(null); // parsed user object
  const [checkingAuth, setCheckingAuth] = useState(true);

  // login form states (shown when not authenticated)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Helper: decode JWT payload to check expiry (no extra lib)
  const decodeJwtPayload = (token) => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = parts[1];
      // base64url -> base64
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(json);
    } catch (e) {
      return null;
    }
  };

  // check token + user on mount
  useEffect(() => {
    const check = () => {
      const token = localStorage.getItem("token");
      // support both "user" and "staff" keys (some parts used both)
      const stored =
        localStorage.getItem("user") || localStorage.getItem("staff") || null;

      if (!token || !stored) {
        setCheckingAuth(false);
        return; // not authenticated => show login form
      }

      const payload = decodeJwtPayload(token);
      if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
        // token invalid/expired
        localStorage.removeItem("token");
        setCheckingAuth(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(stored);
        // role enforcement: only Enrollment Officer can stay here
        if (parsedUser.role === "Enrollment Officer") {
          setUser(parsedUser);
          setCheckingAuth(false);
        } else if (parsedUser.role === "Admin") {
          // redirect admin to admin dashboard
          router.push("/admin_dashboard");
        } else if (parsedUser.role === "Support Officer") {
          router.push("/support_dashboard");
        } else {
          // unknown role -> clear and show login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("staff");
          setCheckingAuth(false);
        }
      } catch (e) {
        localStorage.removeItem("token");
        setCheckingAuth(false);
      }
    };

    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // login handler (shows inline form if not logged in)
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);

    try {
      const res = await fetch("/api/stafflogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setLoginError(data.error || "Invalid credentials");
        setLoggingIn(false);
        return;
      }

      // prefer data.user but accept data.staff too
      const loggedUser = data.user || data.staff;
      if (!loggedUser) {
        setLoginError("Login response missing user data");
        setLoggingIn(false);
        return;
      }

      // role check
      if (loggedUser.role !== "Enrollment Officer") {
        // route other roles to their dashboards
        if (loggedUser.role === "Admin") {
          // store and redirect
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(loggedUser));
          router.push("/admin_dashboard");
          return;
        } else if (loggedUser.role === "Support Officer") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(loggedUser));
          router.push("/support_dashboard");
          return;
        } else {
          setLoginError("Access denied for this role");
          setLoggingIn(false);
          return;
        }
      }

      // store token + user and show enrollment dashboard
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(loggedUser));
      setUser(loggedUser);
      setEmail("");
      setPassword("");
      setLoggingIn(false);
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Server error");
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("staff");
    setUser(null);
    router.push("/"); // or router.push("/stafflogin") if you prefer
  };

  // Sidebar menu items (unchanged)
  const sidebarMenu = [
    {
      title: "Adding Form",
      children: [
        { name: "Add Property", key: "Add Property" },
        { name: "Add Property Unit", key: "Add Property Unit" },
        { name: "Create Customer", key: "Create Customer" },
      ],
    },
  ];

  // content renderer (unchanged)
  const renderContent = () => {
    switch (activeContent) {
      case "Add Property":
        return (
          <div className="card mb-4">
            <div className="card-body">
              <PropertyForm />
            </div>
          </div>
        );
      case "Add Property Unit":
        return (
          <div className="card mb-4">
            <div className="card-body">
              <PropertyUnitForm />
            </div>
          </div>
        );
      case "Create Customer":
        return (
          <div className="card mb-4">
            <div className="card-body">
              <CustomerSignUp />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // while we check token, show loader
  if (checkingAuth) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div>⏳ Checking authentication...</div>
      </div>
    );
  }

  // if not authenticated show inline login form
  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="card p-4 shadow" style={{ width: 400 }}>
          <h4 className="mb-3 text-center">Staff Login (Enrollment)</h4>

          {loginError && <div className="alert alert-danger">{loginError}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-dark w-100" type="submit" disabled={loggingIn}>
              {loggingIn ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated: render dashboard (keeps original layout, adds email + logout)
  return (
    <div className="customer-support d-flex flex-column min-vh-100">
      {/* Navbar (Sticky) */}
      <nav className="navbar navbar-light bg-white sticky-top px-3">
        <button
          className="btn shadow-none border-0 d-lg-none"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
          aria-controls="mobileSidebar"
        >
          <i className="bi bi-list"></i>
        </button>

        <a
          href="/"
          className="d-flex align-items-center text-decoration-none text-dark"
        >
          <img
            src="/assets/logo.png"
            className="logo rounded-2 d-none d-md-block"
            alt="Noretek Energy Ltd"
            width={120}
          />
        </a>

        <div className="d-flex align-items-center gap-3 ms-auto">
          <i className="bi bi-search"></i>
          <i className="bi bi-bell"></i>
          <span className="fw-semibold">{user.email}</span>
          <button onClick={handleLogout} className="btn btn-sm btn-outline-danger">
            Logout
          </button>
        </div>
      </nav>

      <div className="d-flex flex-grow-1">
        {/* Sidebar - Desktop */}
        <aside
          className="bg-white border-end p-3 d-none d-lg-block"
          style={{ width: "250px" }}
        >
          <div className="accordion" id="sidebarMenu">
            <ul className="navbar-nav">
              <li className="nav-item mx-3">
                <a
                  href="/enrollmentOfficer"
                  className="nav-link btn-link fw-bold shadow-sm"
                >
                  EnrollmentOfficer
                </a>
              </li>
            </ul>

            {sidebarMenu.map((section, idx) => (
              <div className="accordion-item border-0" key={idx}>
                <h2 className="accordion-header" id={`heading${idx}`}>
                  <button
                    className="accordion-button collapsed fw-semibold shadow-none border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${idx}`}
                  >
                    {section.title}
                  </button>
                </h2>
                {section.children.length > 0 && (
                  <div id={`collapse${idx}`} className="accordion-collapse collapse">
                    <div className="accordion-body p-2">
                      <ul className="list-unstyled mb-0">
                        {section.children.map((child, i) => (
                          <li key={i} className="p-1">
                            <button
                              onClick={() => setActiveContent(child.key)}
                              className="btn btn-link text-decoration-none p-0"
                            >
                              {child.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Sidebar - Mobile (Offcanvas) */}
        <div className="offcanvas offcanvas-start" tabIndex="-1" id="mobileSidebar">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title">Menu</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
          </div>

          <div className="offcanvas-body">
            <div className="accordion border-0" id="mobileSidebarMenu">
              {sidebarMenu.map((section, idx) => (
                <div className="accordion-item border-0" key={idx}>
                  <h2 className="accordion-header">
                    <button
                      className="accordion-button collapsed fw-semibold shadow-none border-0"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#mobileCollapse${idx}`}
                    >
                      {section.title}
                    </button>
                  </h2>
                  {section.children.length > 0 && (
                    <div id={`mobileCollapse${idx}`} className="accordion-collapse collapse">
                      <div className="accordion-body p-2">
                        <ul className="list-unstyled mb-0">
                          {section.children.map((child, i) => (
                            <li key={i} className="p-1">
                              <button
                                onClick={() => {
                                  setActiveContent(child.key);
                                  document.getElementById("mobileSidebar")?.classList.remove("show");
                                }}
                                className="btn btn-link text-decoration-none p-0"
                              >
                                {child.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-grow-1 p-4 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">{activeContent}</h4>
            <span className="text-muted">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Default Dashboard stats */}
          {activeContent === "Dashboard" && (
            <>
              <div className="row mb-4">
                <div className="col-lg-12 col-md-6 mb-3">
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <h5 className="card-title">Property Information</h5>
                      <PropertyTablesEnrollment />
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-6 mb-3">
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <h5 className="card-title">Property Unit Information</h5>
                      <PropertyUnitTablesEnrollment />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Render Dynamic Content */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
