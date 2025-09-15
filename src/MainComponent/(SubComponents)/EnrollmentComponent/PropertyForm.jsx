"use client";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PropertyForm() {
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    owner_name: "",
    owner_gsm: "",
    property_name: "",
    property_location: "",
    property_address: "",
    captured_by: "",
    date_captured: new Date().toISOString().split("T")[0], // ✅ default today
  });
  const [editId, setEditId] = useState(null);
  const [showTable, setShowTable] = useState(true);

  // ✅ Set captured_by from logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setForm((prev) => ({
          ...prev,
          captured_by: parsed.name || parsed.email || "Unknown User",
        }));
      } catch {
        setForm((prev) => ({ ...prev, captured_by: "Unknown User" }));
      }
    }
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    const res = await fetch("/api/property");
    const data = await res.json();

    // Sort by _id ascending
    const sortedData = [...data].sort((a, b) =>
      a._id.localeCompare(b._id)
    );

    setProperties(sortedData);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      // Update
      await fetch("/api/property", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, ...form }),
      });
    } else {
      // Create
      await fetch("/api/property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({
      owner_name: "",
      owner_gsm: "",
      property_name: "",
      property_location: "",
      property_address: "",
      captured_by: form.captured_by, // ✅ persist logged-in user
      date_captured: new Date().toISOString().split("T")[0], // ✅ reset to today
    });
    setEditId(null);
    fetchProperties();
  };

  const handleEdit = (p) => {
    setForm({
      owner_name: p.owner_name,
      owner_gsm: p.owner_gsm,
      property_name: p.property_name,
      property_location: p.property_location,
      property_address: p.property_address,
      captured_by: p.captured_by,
      date_captured: p.date_captured.split("T")[0],
    });
    setEditId(p._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;
    await fetch("/api/property", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchProperties();
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center titleColor">Property Management</h3>

      {/* Add / Update Property Form */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header fw-bold backgro">
          {editId ? "Update Property" : "Add New Property"}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {[
                { label: "Owner Name", name: "owner_name" },
                { label: "Owner GSM", name: "owner_gsm" },
                { label: "Property Name", name: "property_name" },
                { label: "Location", name: "property_location" },
                { label: "Address", name: "property_address" },
              ].map((field, idx) => (
                <div
                  className={`col-md-${
                    field.name === "property_address" ? 12 : 6
                  } mb-3`}
                  key={idx}
                >
                  <label className="form-label">{field.label}</label>
                  <input
                    type="text"
                    className="form-control shadow-none"
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              {/* Captured By (Disabled) */}
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

              {/* Date Captured (Default = Today) */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Date Captured</label>
                <input
                  type="date"
                  className="form-control shadow-none"
                  name="date_captured"
                  value={form.date_captured}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn backgro w-100">
              {editId ? "Update Property" : "Add Property"}
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      {showTable && (
        <div className="card shadow-sm border-0">
          <div className="card-body p-0">
            <div className="table-responsive ">
              <table className="table table-striped mb-0 ">
                <thead className=" table-hover table-primary border-0">
                  <tr>
                    <th>#</th>
                    <th>Owner</th>
                    <th>GSM</th>
                    <th>Property Name</th>
                    <th>Location</th>
                    <th>Address</th>
                    <th>Captured By</th>
                    <th>Date Captured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.length > 0 ? (
                    properties.map((p, index) => (
                      <tr key={p._id}>
                        <td>{index + 1}</td>
                        <td>{p.owner_name}</td>
                        <td>{p.owner_gsm}</td>
                        <td>{p.property_name}</td>
                        <td>{p.property_location}</td>
                        <td>{p.property_address}</td>
                        <td>{p.captured_by}</td>
                        <td>
                          {new Date(p.date_captured).toLocaleDateString()}
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEdit(p)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(p._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No property found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
