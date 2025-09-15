"use client";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PropertyUnitForm() {
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [meters, setMeters] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [filterProperty, setFilterProperty] = useState("");
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    property_id: "",
    unit_description: "",
    blockno: "",
    meter_id: "",
    captured_by: "",
    date: "",
  });

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (loggedUser?.name || loggedUser?.email) {
      setUser(loggedUser);
      setForm((prev) => ({
        ...prev,
        captured_by: loggedUser.name || loggedUser.email,
        date: new Date().toISOString().split("T")[0],
      }));
    }
    fetchUnits();
    fetchProperties();
    fetchMeters();
  }, []);

  const fetchUnits = async () => {
    const res = await fetch("/api/property_unit");
    setUnits(await res.json());
  };

  const fetchProperties = async () => {
    const res = await fetch("/api/property");
    const data = await res.json();
    setProperties(data);
  };

  const fetchMeters = async () => {
    try {
      const res = await fetch("/api/noretek-meter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      });

      const data = await res.json();

      if (data.success) {
        setMeters(data.meters || []);
        // ✅ Save refreshed token for future requests
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
      } else {
        setError(data.message || "Failed to fetch meters");
      }
    } catch (err) {
      setError("Error fetching meters: " + err.message);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔍 Frontend duplicate validation before API call
    const blockExists = units.some(
      (u) => u.property_id?._id === form.property_id && u.blockno === form.blockno && u._id !== editId
    );
    if (blockExists) {
      setError(`Block ${form.blockno} already exists in this property`);
      return;
    }

    const unitExists = units.some(
      (u) =>
        u.property_id?._id === form.property_id &&
        u.blockno === form.blockno &&
        u.unit_description === form.unit_description &&
        u._id !== editId
    );
    if (unitExists) {
      setError(`Unit "${form.unit_description}" already exists in Block ${form.blockno}`);
      return;
    }

    const method = editId ? "PUT" : "POST";
    const res = await fetch("/api/property_unit", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editId ? { id: editId, ...form } : form),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || "Error saving unit");
      return;
    }

    setForm({
      property_id: "",
      unit_description: "",
      blockno: "",
      meter_id: "",
      captured_by: user?.name || user?.email || "",
      date: new Date().toISOString().split("T")[0],
    });
    setEditId(null);
    fetchUnits();
    setError("");
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
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this unit?")) return;
    await fetch("/api/property_unit", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchUnits();
  };

  const displayedUnits =
    filterProperty === ""
      ? []
      : units.filter((u) => u.property_id?._id === filterProperty);

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center titleColor">Property Unit Management</h3>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button className="btn-close float-end" onClick={() => setError("")}></button>
        </div>
      )}

      {/* Form */}
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
                >
                  <option value="">Select Meter</option>
                  {meters
                    .filter(
                      (m) =>
                        !units.some((u) => u.meter_id === m.meterId && u._id !== editId)
                    )
                    .map((meter) => (
                      <option key={meter.meterId} value={meter.meterId}>
                        {meter.meterId}
                      </option>
                    ))}
                </select>
              </div>

              {/* Captured By */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Captured By</label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  name="captured_by"
                  value={form.captured_by}
                  disabled
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
                  disabled
                />
              </div>
            </div>
            <button type="submit" className="btn backgro w-100">
              {editId ? "Update Unit" : "Add Unit"}
            </button>
          </form>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-3">
        <label className="form-label fw-bold">Filter by Property</label>
        <select
          className="form-select shadow-none"
          value={filterProperty}
          onChange={(e) => setFilterProperty(e.target.value)}
        >
          <option value="">-- Select Property --</option>
          {properties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.property_name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card border border-top shadow-sm">
        <div className="card-header titleColor fw-bold">Property Unit List</div>
        <div className="card-body p-0 table-responsive">
          <table className="table table-striped mb-0">
            <thead className="table-hover table-primary">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Unit Description</th>
                <th>Block No</th>
                <th>Meter ID</th>
                <th>Captured By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedUnits.length > 0 ? (
                displayedUnits.map((u, idx) => (
                  <tr key={u._id}>
                    <td>{idx + 1}</td>
                    <td>{u.property_id?.property_name || "N/A"}</td>
                    <td>{u.unit_description}</td>
                    <td>{u.blockno}</td>
                    <td>{u.meter_id}</td>
                    <td>{u.captured_by}</td>
                    <td>{u.date ? new Date(u.date).toLocaleDateString() : "N/A"}</td>
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
                    {filterProperty === ""
                      ? "Please select a property"
                      : "No units found for this property"}
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
