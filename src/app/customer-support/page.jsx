"use client";

import Link from "next/link";
import React, { useState } from "react";

const sidebarItems = [
  { label: "Report", href: "/reports" },
  { label: "Support term", href: "/support-term" },
  { label: "Message", href: "/message" },
];

const supportData = [
  {
    sn: 1,
    date: "05/21/2025",
    customerName: "Abdul Abbas",
    customerId: "NTP-C-05754",
    homeId: "NTP-D-0044",
    meterId: "NTP-M-222",
    compliantType: "Payment",
    statement: "I have request to refilling my gas, I mak...",
    supportTicket: "TK/341753",
    status: "Attending",
  },
  {
    sn: 2,
    date: "05/21/2025",
    customerName: "Joe john",
    customerId: "NTP-C-15754",
    homeId: "NTP-D-0064",
    meterId: "NTP-M-202",
    compliantType: "Payment",
    statement: "I have request to refilling my gas, I mak...",
    supportTicket: "TK/348753",
    status: "Awaiting",
  },
  {
    sn: 3,
    date: "05/21/2025",
    customerName: "Aliyu Yusuf",
    customerId: "NTP-C-35754",
    homeId: "NTP-D-0344",
    meterId: "NTP-M-232",
    compliantType: "Payment",
    statement: "I have request to refilling my gas, I mak...",
    supportTicket: "TK/340753",
    status: "Resolved",
  },
  {
    sn: 4,
    date: "05/21/2025",
    customerName: "Aliyu Yusuf",
    customerId: "NTP-C-35754",
    homeId: "NTP-D-0344",
    meterId: "NTP-M-232",
    compliantType: "Payment",
    statement: "I have request to refilling my gas, I mak...",
    supportTicket: "TK/340753",
    status: "Not Resolving",
  },
];

function getStatusBadge(status) {
  let className = "badge rounded-pill text-bg-secondary";

  switch (status) {
    case "Attending":
      className = "badge rounded-pill text-bg-warning";
      break;
    case "Awaiting":
      className = "badge rounded-pill text-bg-primary";
      break;
    case "Resolved":
      className = "badge rounded-pill text-bg-success";
      break;
    case "Not Resolving":
      className = "badge rounded-pill text-bg-danger";
      break;
  }

  return <span className={className}>{status}</span>;
}

export default function CustomerSupport() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 4;
  const totalPages = Math.ceil(supportData.length / rowsPerPage);

  const currentData = supportData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section className="customer-support">
      <div className="min-vh-100 bg-light">
        {/* Navbar */}
        <header className="bg-white border-bottom py-2 px-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <button
              className="btn btn-link d-lg-none me-2"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="bi bi-list"></i>
            </button>
            <Link
              href="/"
              className="d-flex align-items-center text-decoration-none text-dark"
            >
              <img src="/assets/logo.png" className="logo rounded-2" alt="" />
            </Link>
          </div>

          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-search"></i>
            <i className="bi bi-bell"></i>
            <img
              src="/assets/person.png"
              className="profile rounded-5"
              alt=""
            />
          </div>
        </header>

        <div className="d-flex flex-column flex-lg-row">
          {/* Sidebar */}
          <aside
            className={`bg-white border-end p-3 ${
              sidebarOpen ? "d-block" : "d-none"
            } d-lg-block`}
            style={{ width: "250px", minHeight: "100vh" }}
          >
            <nav className="nav flex-column">
              {sidebarItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="nav-link text-dark px-0 py-2"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-grow-1 p-3">
            <div className="mb-4">
              <h2 className="h5 fw-bold">Customer Support</h2>
              <p className="text-muted">May 20th Tuesday, 2025</p>
            </div>

            {/* Filter Cards */}
            <div className="row g-3 mb-4">
              <div className="col-12 col-lg-4">
                <div className="card p-3 h-100">
                  <label className="text-muted small mb-1">Home ID</label>
                  <div className="fw-semibold">NTP-D-0044</div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="card p-3 h-100">
                  <label className="text-muted small mb-1">Customer ID</label>
                  <div className="fw-semibold">NTP-C-05754</div>
                </div>
              </div>
              <div className="col-12 col-lg-4">
                <div className="card p-3 h-100">
                  <label className="text-muted small mb-1">Meter ID</label>
                  <div className="fw-semibold">NTP-M-222</div>
                </div>
              </div>
            </div>

            {/* Support Table */}
            <div className="card">
              <div className="card-body p-0">
                {/* Scrollable Table */}
                <div
                  className="table-responsive"
                  style={{ overflowX: "auto", maxWidth: "100%" }}
                >
                  <table className="table table-striped mb-0 align-middle text-nowrap">
                    <thead className="table-primary">
                      <tr>
                        <th scope="col">S/N</th>
                        <th scope="col">Date</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Customer ID</th>
                        <th scope="col">Home ID</th>
                        <th scope="col">Meter ID</th>
                        <th scope="col">Compliant Type</th>
                        <th scope="col">Statement</th>
                        <th scope="col">Support Ticket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.map((row) => (
                        <tr key={row.sn}>
                          <td>{row.sn}</td>
                          <td>{row.date}</td>
                          <td>{row.customerName}</td>
                          <td>{row.customerId}</td>
                          <td>{row.homeId}</td>
                          <td>{row.meterId}</td>
                          <td>{row.compliantType}</td>
                          <td
                            className="text-truncate"
                            style={{ maxWidth: "150px" }}
                          >
                            {row.statement}
                          </td>
                          <td>
                            <div className="d-flex flex-column gap-1">
                              <span>{row.supportTicket}</span>
                              {getStatusBadge(row.status)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <nav className="mt-3">
              <ul className="pagination justify-content-center flex-wrap">
                {[...Array(totalPages)].map((_, idx) => (
                  <li
                    key={idx}
                    className={`page-item ${
                      currentPage === idx + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(idx + 1)}
                    >
                      {idx + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </main>
        </div>
      </div>
    </section>
  );
}
