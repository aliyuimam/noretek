"use client";
import React, { useState, useEffect } from "react";

export default function TicketForm({ onSave, editingTicket, setEditingTicket }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
    category: "General Inquiry",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const priorityOptions = ["Low", "Medium", "High", "Critical"];
  const categoryOptions = [
    "General Inquiry",
    "Biling Issues",
    "Technical Problems",
    "Others",
  ];

  useEffect(() => {
    if (editingTicket) {
      setForm({
        title: editingTicket.title || "",
        description: editingTicket.description || "",
        priority: editingTicket.priority || "Low",
        category: editingTicket.category || "General Inquiry",
        _id: editingTicket._id, // keep _id for updates only
      });
    } else {
      setForm({
        title: "",
        description: "",
        priority: "Low",
        category: "General Inquiry",
      });
    }
  }, [editingTicket]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let ticketData = { ...form };

      if (!editingTicket) {
        // 🚀 ensure _id is not sent when creating
        delete ticketData._id;
      }

      const response = await fetch("/api/tickets", {
        method: editingTicket ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();

      if (response.ok) {
        onSave(data.ticket || data);
        if (!editingTicket) {
          setForm({
            title: "",
            description: "",
            priority: "Low",
            category: "General Inquiry",
          });
        }
        if (editingTicket) setEditingTicket(null);
      } else {
        setError(data.error || "Failed to save ticket");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-2">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Title *"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Description *"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            disabled={isSubmitting}
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            disabled={isSubmitting}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-1">
          <button
            className="btn btn-primary w-100"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "..." : editingTicket ? "Update" : "Create"}
          </button>
          {editingTicket && (
            <button
              type="button"
              className="btn btn-secondary w-100 mt-2"
              onClick={() => setEditingTicket(null)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
