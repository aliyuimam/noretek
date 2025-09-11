"use client";
import { useEffect, useState } from "react";


export default function CommentList({ ticketId, currentCustomer }) {
  const [comments, setComments] = useState([]);

  const loadComments = async () => {
    const res = await fetch(`/api/support_comments?ticket_id=${ticketId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    loadComments();
  }, [ticketId]);

  const deleteComment = async (id) => {
    if (!confirm("Delete this comment?")) return;
    await fetch(`/api/support_comments?comment_id=${id}`, { method: "DELETE" });
    loadComments();
  };

  return (
    <div>
      <CommentForm ticketId={ticketId} currentCustomer={currentCustomer} onSaved={loadComments} />
      <ul className="list-group mt-2">
        {comments.map((c) => (
          <li key={c.comment_id} className="list-group-item d-flex justify-content-between align-items-start">
            <div>
              <strong>{c.created_by}</strong>: {c.comment}
              <br />
              <small className="text-muted">{new Date(c.created_at).toLocaleString()}</small>
            </div>
            <button className="btn btn-sm btn-danger" onClick={() => deleteComment(c.comment_id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
