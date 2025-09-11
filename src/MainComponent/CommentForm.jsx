"use client";
import React, { useState } from "react";

export default function CommentForm({ ticketId, customerId, onSave, onClose }) {
  const [form, setForm] = useState({
    ticket_id: ticketId,
    customer_id: customerId,
    comment: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.comment.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        onSave?.(data.comment || data);
        setForm({ ...form, comment: "" });
        if (onClose) onClose();
      } else {
        setError(data.error || "Failed to add comment");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="card-title mb-0">Add Comment</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows={3}
              value={form.comment}
              onChange={(e) =>
                setForm({ ...form, comment: e.target.value })
              }
              placeholder="Type your comment here..."
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Comment"}
            </button>
            {onClose && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
