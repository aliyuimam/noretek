"use client";
import { useState, useEffect } from "react";
//import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminForm() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [staffs, setStaffs] = useState([]);
  const [visiblePasswords, setVisiblePasswords] = useState({}); // track visibility

  const [form, setForm] = useState({
    _id: null,
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "",
    isBlocked: false,
  });

  // Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Submit form
// Submit form
const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");
  setSubmitting(true);

  try {
    let res;
    if (form._id) {
      // UPDATE (PUT)
      res = await fetch("/api/staff", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form._id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          role: form.role,
        }),
      });
    } else {
      // CREATE (POST)
      res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    // if server returned non-JSON or non-OK, capture message
    const contentType = res.headers.get("content-type") || "";
    if (!res.ok) {
      // Try parse JSON body first
      if (contentType.includes("application/json")) {
        const err = await res.json();
        setMessage(`❌ ${err.message || "Server error"}`);
      } else {
        const text = await res.text();
        setMessage(`❌ ${text || "Server error"}`);
      }
    } else {
      // success path
      const data = contentType.includes("application/json") ? await res.json() : null;
      if (data && data.success) {
        setMessage(`✅ ${form._id ? "Staff updated" : "Staff registered"} successfully!`);
        resetForm();
        fetchStaffs();
      } else {
        const msg = data?.message || "Unknown server response";
        setMessage(`❌ ${msg}`);
      }
    }
  } catch (err) {
    console.error("Frontend submit error:", err);
    setMessage("❌ Network or server error (see server console)");
  } finally {
    setSubmitting(false);
  }
};


  // Reset form
  const resetForm = () => {
    setForm({
      _id: null,
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
      role: "",
      isBlocked: false,
    });
  };

  // Fetch staff list
  const fetchStaffs = async () => {
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      if (data.success) setStaffs(data.staff);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  // Toggle block/unblock
  const toggleBlock = async (id, currentStatus) => {
    try {
      const res = await fetch("/api/staff", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, block: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) fetchStaffs();
    } catch (err) {
      console.error("Error blocking/unblocking:", err);
    }
  };

  // Delete staff
  const deleteStaff = async (id) => {
    if (!confirm("Are you sure you want to delete this staff?")) return;
    try {
      const res = await fetch(`/api/staff?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchStaffs();
    } catch (err) {
      console.error("Error deleting staff:", err);
    }
  };

  // Edit staff (load into form)
  const editStaff = (s) => {
    setForm({
      _id: s._id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      address: s.address,
      password: "",
      confirmPassword: "",
      role: s.role,
      isBlocked: s.isBlocked,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toggle password visibility in table
  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container my-5">
      {/* Staff Form */}
      <div className="shadow-lg my-4 p-md-5 p-4 rounded bg-light">
        <h4 className="text-center text-primary titleColor">
          {form._id ? "Edit Staff" : "Super Admin Role"}
        </h4>

        {message && <div className="alert alert-info">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <p className="fw-bold text-muted"> Staff Information</p>
            <hr />

            {/* Name */}
            <div className="col-md-6 mb-2">
              <label className="fw-bold text-muted">Name:</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="col-md-6 mb-2">
              <label className="fw-bold text-muted">Email:</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="col-md-6 mb-2">
              <label className="fw-bold text-muted">Phone:</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Address */}
            <div className="col-md-6 mb-2">
              <label className="fw-bold text-muted">Address:</label>
              <input
                type="text"
                className="form-control"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password (only for create) */}
            {!form._id && (
              <>
                <div className="col-md-6 mb-2">
                  <label className="fw-bold text-muted">Password:</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-2">
                  <label className="fw-bold text-muted">
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            {/* Role */}
            <div className="col-md-12 mb-2">
              <label className="fw-bold text-muted">Role:</label>
              <select
                className="form-select"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Enrollment Officer">Enrollment Officer</option>
                <option value="Support Officer">Support Officer</option>
              </select>
            </div>

            {/* Block Toggle */}
            <div className="col-md-12 mb-3">
              <label className="fw-bold text-muted me-2">Blocked:</label>
              <input
                type="checkbox"
                name="isBlocked"
                checked={form.isBlocked}
                onChange={handleChange}
              />{" "}
              {form.isBlocked ? "Blocked" : "Active"}
            </div>
          </div>

          <button
            type="submit"
            className="btn primaryColor w-100"
            disabled={submitting}
          >
            {submitting ? "Saving..." : form._id ? "Update Staff" : "Register"}
          </button>

          {form._id && (
            <button
              type="button"
              className="btn primaryColor w-100 mt-2"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Staff Management Table */}
      <div className="card shadow-sm mt-5">
        <div className="card-header  border-0 primaryColor">Staff Management</div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped mb-0">
              <thead className="table-light">
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Password</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffs.length > 0 ? (
                  staffs.map((s) => (
                    <tr key={s._id}>
                      <td>{s.email}</td>
                      <td>{s.role}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${
                            s.isBlocked ? "btn-danger" : "btn-success"
                          }`}
                          onClick={() => toggleBlock(s._id, s.isBlocked)}
                        >
                          {s.isBlocked ? "Blocked" : "Active"}
                        </button>
                      </td>
                      <td>
                        <span className="me-2">
                          {visiblePasswords[s._id] ? s.password : "••••••••"}
                        </span>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => togglePasswordVisibility(s._id)}
                        >
                          {visiblePasswords[s._id] ? (
                            <i className=" bi bi-eye-slash"></i>
                          ) : (
                            <i className=" bi bi-eye"></i>
                          )}
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => editStaff(s)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteStaff(s._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No staff found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
