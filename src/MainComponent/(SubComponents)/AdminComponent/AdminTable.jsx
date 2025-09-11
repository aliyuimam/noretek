"use client";
import { useState, useEffect } from "react";

export default function AdminTables() {
  const [staffs, setStaffs] = useState([]);
  const [showTable, setShowTable] = useState(true);

  // Filters
  const [staffsNameFilter, setStaffsNameFilter] = useState("");
  const [staffsRoleFilter, setStaffsRoleFilter] = useState("");

  // Fetch staff data
  const fetchStaffs = async () => {
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      if (data.success) {
        setStaffs(data.staff); // ✅ only take staff array
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  // Filtered data
  const filterStaffs = staffs.filter(
    (s) =>
      s.name?.toLowerCase().includes(staffsNameFilter.toLowerCase()) &&
      (staffsRoleFilter
        ? s.role?.toLowerCase().includes(staffsRoleFilter.toLowerCase())
        : true)
  );

  return (
    <div className="container my-4">
      {/* Staff Filters */}
      <div className="mb-3 row">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by Name"
            value={staffsNameFilter}
            onChange={(e) => setStaffsNameFilter(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by Role"
            value={staffsRoleFilter}
            onChange={(e) => setStaffsRoleFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Staff Table */}
      {showTable && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Blocked</th>
                    <th>Password</th>
                  </tr>
                </thead>
                <tbody>
                  {filterStaffs.length > 0 ? (
                    filterStaffs.map((s, index) => (
                      <tr key={s._id}>
                        <td>{index + 1}</td>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{s.phone}</td>
                        <td>{s.address}</td>
                        <td>{s.role}</td>
                        <td>{s.isBlocked ? "Yes" : "No"}</td>
                        {/* Masked password */}
                        <td>{"•".repeat(8)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No staff found
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
