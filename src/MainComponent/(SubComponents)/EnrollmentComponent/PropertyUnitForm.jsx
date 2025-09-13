"use client";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PropertyUnitForm() {
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [meters, setMeters] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔐 API login credentials
  const loginData = {
    userId: "0001",
    password: "Ntk0001@#",
    company: "Noretek Energy",
  };
  const [token, setToken] = useState("");

  const [form, setForm] = useState({
    property_id: "",
    unit_description: "",
    blockno: "",
    meter_id: "",
    captured_by: "",
    date: "",
  });

  // Auto login immediately on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    } else {
      handleAutoLogin();
    }
  }, []);

  // Fetch data whenever token is available
  useEffect(() => {
    if (token) {
      fetchUnits();
      fetchProperties();
      fetchMeters();
    }
  }, [token]);

  const handleAutoLogin = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/noretek-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (!res.ok) throw new Error(`Login failed: ${res.status}`);

      const data = await res.json();
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setError("");
      } else {
        setError("Auto-login failed. Please try again.");
      }
    } catch (err) {
      setError("Login error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await fetch("/api/property_unit");
      setUnits(await res.json());
    } catch (err) {
      setError("Error fetching units: " + err.message);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/property");
      const data = await res.json();
      const sortedProps = [...data].sort((a, b) => a._id.localeCompare(b._id));
      setProperties(sortedProps);
    } catch (err) {
      setError("Error fetching properties: " + err.message);
    }
  };

  const fetchMeters = async () => {
    try {
      const res = await fetch("/api/noretek-meter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        setToken("");
        handleAutoLogin();
        return;
      }

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setMeters(data?.meters || []);
    } catch (err) {
      setError("Error fetching meters: " + err.message);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await fetch("/api/property_unit", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editId, ...form }),
        });
      } else {
        await fetch("/api/property_unit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setForm({
        property_id: "",
        unit_description: "",
        blockno: "",
        meter_id: "",
        captured_by: "",
        date: "",
      });
      setEditId(null);
      fetchUnits();
    } catch (err) {
      setError("Error saving unit: " + err.message);
    }
  };

  const handleEdit = (unit) => {
    setForm({
      property_id: unit.property_id?._id || "",
      unit_description: unit.unit_description,
      blockno: unit.blockno,
      meter_id: unit.meter_id || "",
      captured_by: unit.captured_by,
      date: unit.date ? new Date(unit.date).toISOString().split("T")[0] : "",
    });
    setEditId(unit._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this unit?")) return;
    try {
      await fetch("/api/property_unit", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchUnits();
    } catch (err) {
      setError("Error deleting unit: " + err.message);
    }
  };

  if (loading && !token) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2">Connecting to API...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center titleColor">Property Unit Management</h3>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button
            type="button"
            className="btn-close float-end"
            onClick={() => setError("")}
            aria-label="Close"
          />
        </div>
      )}

      <div className="d-md-none mb-3 text-center">
        <button className="btn backgro" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Form" : "Add New Unit"}
        </button>
      </div>

      {(showForm || window.innerWidth >= 768) && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header backgro">
            {editId ? "Edit Property Unit" : "Add New Property Unit"}
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Property Dropdown */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Property</label>
                  <select
                    className="form-control shadow-none"
                    name="property_id"
                    value={form.property_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Property</option>
                    {properties.map((p, idx) => (
                      <option key={p._id} value={p._id}>
                        {String(idx + 1).padStart(4, "0")}PU - {p.property_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit Description */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Unit Description</label>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    name="unit_description"
                    value={form.unit_description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Block No */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Block No</label>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    name="blockno"
                    value={form.blockno}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Meter ID */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Meter ID</label>
                  <select
                    className="form-select shadow-none"
                    name="meter_id"
                    value={form.meter_id}
                    onChange={handleChange}
                    disabled={!token || meters.length === 0}
                  >
                    <option value="">Select Meter</option>
                    {meters
                      .filter(
                        (m) =>
                          !units.some(
                            (u) =>
                              u.meter_id === m.meterId && u._id !== editId
                          )
                      )
                      .map((meter) => (
                        <option key={meter.meterId} value={meter.meterId}>
                          {meter.meterId}
                        </option>
                      ))}
                  </select>
                  {!token && (
                    <div className="form-text text-warning">
                      Login required to load meters
                    </div>
                  )}
                  {token && meters.length === 0 && (
                    <div className="form-text text-warning">
                      No meters available or error loading meters
                    </div>
                  )}
                </div>

                {/* Captured By */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Captured By</label>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    name="captured_by"
                    value={form.captured_by}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Date */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control shadow-none"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn backgro w-100"
                disabled={!token}
              >
                {editId ? "Update Unit" : "Add Unit"}
              </button>
              {!token && (
                <div className="alert alert-warning mt-3 mb-0">
                  API authentication required to save data
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card border border-top shadow-sm">
        <div className="card-header titleColor fw-bold">Property Unit List</div>
        <div className="card-body p-0 table-responsive">
          <table className="table table-striped mb-0">
            <thead className="table-hover table-primary">
              <tr>
                <th>#</th>
                <th>Property</th>
                <th>Unit Description</th>
                <th>Block No</th>
                <th>Meter ID</th>
                <th>Captured By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.length > 0 ? (
                units.map((u, idx) => (
                  <tr key={u._id}>
                    <td>{idx + 1}</td>
                    <td>{u.property_id?.property_name || "N/A"}</td>
                    <td>{u.unit_description}</td>
                    <td>{u.blockno}</td>
                    <td>{u.meter_id}</td>
                    <td>{u.captured_by}</td>
                    <td>
                      {u.date ? new Date(u.date).toLocaleDateString() : "N/A"}
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(u)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No unit found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .backgro {
          background-color: #0d6efd;
          color: white;
        }
        .titleColor {
          color: #0d6efd;
        }
      `}</style>
    </div>
  );
}
