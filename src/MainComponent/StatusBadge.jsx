"use client";
import React from "react";

export default function StatusBadge({ status }) {
  const statusConfig = {
    Open: { class: "bg-primary", icon: "bi-circle" },
    "In Progress": { class: "bg-info", icon: "bi-arrow-repeat" },
    Resolved: { class: "bg-success", icon: "bi-check-circle" },
    Closed: { class: "bg-secondary", icon: "bi-lock" },
    Pending: { class: "bg-warning", icon: "bi-hourglass-split" }
  };

  const config =
    statusConfig[status] || { class: "bg-dark", icon: "bi-question-circle" };

  return (
    <span className={`badge ${config.class}`}>
      <i className={`${config.icon} me-1`}></i>
      {status || "Unknown"}
    </span>
  );
}
