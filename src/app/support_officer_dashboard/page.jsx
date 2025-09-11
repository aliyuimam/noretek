"use client";

import PriorityBadge from "@/MainComponent/PriorityBadge";
import StatusBadge from "@/MainComponent/StatusBadge";
import TicketTable from "@/MainComponent/TicketTable";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [activeContent, setActiveContent] = useState("Dashboard");
  const [tickets, setTickets] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tickets");
  const [stats, setStats] = useState({
    totalTickets: 0,
    pendingTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
  });

  // auth states
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // login form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const decodeJwtPayload = (token) => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const payload = parts[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  // check token + user on mount
  useEffect(() => {
    const check = () => {
      const token = localStorage.getItem("token");
      const stored =
        localStorage.getItem("user") || localStorage.getItem("staff") || null;

      if (!token || !stored) {
        setCheckingAuth(false);
        return;
      }

      const payload = decodeJwtPayload(token);
      if (!payload || (payload.exp && payload.exp * 1000 < Date.now())) {
        localStorage.removeItem("token");
        setCheckingAuth(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(stored);
        if (parsedUser.role === "Enrollment Officer") {
          setUser(parsedUser);
          setCheckingAuth(false);
        } else if (parsedUser.role === "Admin") {
          router.push("/admin_dashboard");
        } else if (parsedUser.role === "Support Officer") {
          router.push("/support_officer_dashboard");
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("staff");
          setCheckingAuth(false);
        }
      } catch {
        localStorage.removeItem("token");
        setCheckingAuth(false);
      }
    };

    check();
  }, [router]);

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

      const loggedUser = data.user || data.staff;
      if (!loggedUser) {
        setLoginError("Login response missing user data");
        setLoggingIn(false);
        return;
      }

      if (loggedUser.role !== "Enrollment Officer") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        if (loggedUser.role === "Admin") {
          router.push("/admin_dashboard");
        } else if (loggedUser.role === "Support Officer") {
          router.push("/support_officer_dashboard");
        } else {
          setLoginError("Access denied for this role");
        }
        setLoggingIn(false);
        return;
      }

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
    router.push("/");
  };

  // ✅ FIXED: fetch tickets from DB
  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/tickets");
      const data = await res.json();
      setTickets(Array.isArray(data.tickets) ? data.tickets : []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setTickets([]);
    }
  };

  // ✅ FIXED: fetch complaints from DB
  const fetchComplaints = async () => {
    try {
      const res = await fetch("/api/comments");
      const data = await res.json();
      setComplaints(Array.isArray(data.comments) ? data.comments : []);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setComplaints([]);
    }
  };

  // ✅ FIXED: fetch comments for a specific ticket
  const fetchComments = async (ticket_id) => {
    try {
      const res = await fetch(`/api/comments?ticket_id=${ticket_id}`);
      const data = await res.json();
      setComments(Array.isArray(data.comments) ? data.comments : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchTickets(), fetchComplaints()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    setStats({
      totalTickets: tickets.length,
      pendingTickets: tickets.filter(
        (t) => t.status === "Pending" || t.status === "Not Opened"
      ).length,
      openTickets: tickets.filter(
        (t) => t.status === "Open" || t.status === "In Progress"
      ).length,
      resolvedTickets: tickets.filter(
        (t) => t.status === "Resolved" || t.status === "Closed"
      ).length,
    });
  }, [tickets, comments]);

  if (loading) {
    return (
      <div className="container mt-4 text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header bg-dark text-white">
          <h2 className="mb-0">Support Dashboard</h2>
          <p className="mb-0">
            View all customer comments and support tickets
          </p>
        </div>

        <div className="card-body">
          {/* Statistics */}
          <div className="row mb-4">
            <div className="col-md-2 col-6 mb-4">
              <div className="card text-center border-primary">
                <div className="card-body">
                  <h3 className="text-primary">{stats.totalTickets}</h3>
                  <span className="text-muted">Total Tickets</span>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6 mb-4">
              <div className="card text-center border-warning">
                <div className="card-body">
                  <h3 className="text-warning">{stats.pendingTickets}</h3>
                  <span className="text-muted">Pending</span>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6 mb-4">
              <div className="card text-center border-danger">
                <div className="card-body">
                  <h3 className="text-danger">{stats.openTickets}</h3>
                  <span className="text-muted">Open</span>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6 mb-4">
              <div className="card text-center border-success">
                <div className="card-body">
                  <h3 className="text-success">{stats.resolvedTickets}</h3>
                  <span className="text-muted">Resolved</span>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6 mb-4">
              <div className="card text-center border-secondary">
                <div className="card-body">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={loadAllData}
                  >
                    <i className="bi bi-arrow-clockwise"></i> Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "tickets" ? "active" : ""}`}
                onClick={() => setActiveTab("tickets")}
              >
                <i className="bi bi-ticket-detailed me-2"></i>
                Tickets ({tickets.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "complaints" ? "active" : ""}`}
                onClick={() => setActiveTab("complaints")}
              >
                <i className="bi bi-chat-dots me-2"></i>
                Comments ({complaints.length})
              </button>
            </li>
          </ul>

          {/* Tickets Tab */}
          {activeTab === "tickets" && (
            <TicketTable
              tickets={tickets}
              onEdit={(ticket) => console.log("Edit:", ticket)}
              onDelete={(id) => console.log("Delete ticket:", id)}
              onViewComments={(ticket) => {
                setSelectedTicket(ticket);
                fetchComments(ticket.ticket_id || ticket._id);
              }}
            />
          )}

          {/* Complaints Tab */}
          {activeTab === "complaints" && (
            <div>
              <h4>Customer Comments</h4>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Comment #</th>
                      <th>Customer</th>
                      <th>Issue Type</th>
                      <th>Urgency</th>
                      <th>Status</th>
                      <th>Received</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((comment) => (
                      <tr key={comment.comment_id || comment.id}>
                        <td>
                          <strong>#{comment.comment_id || comment.id}</strong>
                        </td>
                        <td>
                          <strong>{comment.customer_name}</strong>
                          <br />
                          <small className="text-muted">
                            {comment.customer_email}
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-info text-capitalize">
                            {comment.comment_type?.replace("_", " ") || "other"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              comment.urgency === "critical"
                                ? "danger"
                                : comment.urgency === "high"
                                ? "warning"
                                : comment.urgency === "medium"
                                ? "info"
                                : "secondary"
                            }`}
                          >
                            {comment.urgency}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge bg-${
                              comment.status === "pending"
                                ? "warning"
                                : comment.status === "processed"
                                ? "success"
                                : "secondary"
                            }`}
                          >
                            {comment.status}
                          </span>
                        </td>
                        <td>
                          <small>
                            {new Date(comment.created_at).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() =>
                              alert(
                                `Comment Details:\n\nSubject: ${
                                  comment.subject
                                }\n\nMessage: ${
                                  comment.message
                                }\n\nMeter: ${comment.meter_number || "N/A"}`
                              )
                            }
                          >
                            <i className="bi bi-info-circle"></i> Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {complaints.length === 0 && (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-chat-dots display-4"></i>
                    <p>No customer complaints found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Ticket #{selectedTicket.ticket_id || selectedTicket._id} -{" "}
                  {selectedTicket.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedTicket(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Description:</strong> {selectedTicket.description}
                </p>
                <p>
                  <strong>Category:</strong>{" "}
                  {selectedTicket.category_name || selectedTicket.category}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <StatusBadge status={selectedTicket.status} />
                </p>

                <div className="mt-4">
                  <h6>Comments</h6>
                  {comments.length > 0 ? (
                    <div className="border rounded p-3">
                      {comments.map((c) => (
                        <div
                          key={c.comment_id || c.id}
                          className="mb-3 p-2 border-bottom"
                        >
                          <div className="d-flex justify-content-between">
                            <strong>{c.user_name}</strong>
                            <small className="text-muted">
                              {new Date(c.created_at).toLocaleString()}
                            </small>
                          </div>
                          <p className="mb-0">{c.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">No comments yet</p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedTicket(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
