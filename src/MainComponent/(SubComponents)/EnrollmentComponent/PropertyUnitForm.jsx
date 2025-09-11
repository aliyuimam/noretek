"use client";

import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PropertyUnitForm() {
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [editId, setEditId] = useState(null);

  const meterOptions = ["MTR001", "MTR002", "MTR003", "MTR004"];

  const [form, setForm] = useState({
    property_id: "",
    unit_description: "",
    blockno: "",
    meter_id: "",
    captured_by: "",
    date: "",
  });

  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    fetchUnits();
    fetch("/api/property")
      .then((res) => res.json())
      .then((data) => {
        // Sort properties by _id ascending
        const sortedProps = [...data].sort((a, b) =>
          a._id.localeCompare(b._id)
        );
        setProperties(sortedProps);
      });
  }, []);

  const fetchUnits = async () => {
    const res = await fetch("/api/property_unit");
    setUnits(await res.json());
    // Sort units in ascending order by property, unit_description, blockno, meter_id
    const sortedData = [...data].sort((a, b) => {
      const propA = a.property_id?.property_name || "";
      const propB = b.property_id?.property_name || "";
      if (propA.localeCompare(propB) !== 0) return propA.localeCompare(propB);

      if (a.unit_description.localeCompare(b.unit_description) !== 0)
        return a.unit_description.localeCompare(b.unit_description);

      if (a.blockno.localeCompare(b.blockno) !== 0)
        return a.blockno.localeCompare(b.blockno);

      return (a.meter_id || "").localeCompare(b.meter_id || "");
    });

    setUnits(sortedData);
  };


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
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

    await fetch("/api/property_unit", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchUnits();
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center titleColor">Property Unit Management</h3>

      <div className="d-md-none mb-3 text-center">
        <button
          className="btn backgro"
          onClick={() => setShowForm(!showForm)}
        >
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
                  <label className="form-label ">Property</label>
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
                  <label className="form-label">Meter ID </label>
                  <select
                    className="form-select shadow-none "
                    name="meter_id"
                    value={form.meter_id}
                    onChange={handleChange}
                  >
                    <option value="" >Select Meter</option>
                    {meterOptions.map((m) => (
                      <option key={m} value={m}>
                        {m}
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
              <button type="submit" className="btn backgro w-100">
                {editId ? "Update Unit" : "Add Unit"}
              </button>
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

                    {/* Serial Unit Description */}
                    <td>{`UNIT-${String(idx + 1).padStart(3, "0")}`}</td>

                    {/* Serial Block No */}
                    <td>{`BLK-${String(idx + 1).padStart(3, "0")}`}</td>

                    {/* Serial Meter ID */}
                    <td>{`MTR-${String(idx + 1).padStart(3, "0")}`}</td>
                    <td>{u.captured_by}</td>
                    <td>{new Date(u.date).toLocaleDateString()}</td>
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
    </div>
  );
}
