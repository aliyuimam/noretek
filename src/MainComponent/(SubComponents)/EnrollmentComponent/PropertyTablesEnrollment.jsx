"use client";
import { useState, useEffect } from "react";

export default function PropertyTablesEnrollment() {
  const [properties, setProperties] = useState([]);
  const [showTable, setShowTable] = useState(true);

  // Filters
  const [propertyNameFilter, setPropertyNameFilter] = useState("");
  const [propertyDateFilter, setPropertyDateFilter] = useState("");

  // Fetch Property data
  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/property");
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Filtered data
  const filteredProperties = properties.filter(
    (p) =>
      p.property_name
        ?.toLowerCase()
        .includes(propertyNameFilter.toLowerCase()) &&
      (propertyDateFilter
        ? new Date(p.date_captured).toLocaleDateString() ===
          new Date(propertyDateFilter).toLocaleDateString()
        : true)
  );

  return (
    <div className="container my-4">
      {/* Property Filters */}
      <div className="mb-3 row">
        <div className="col-md-6 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by Property Name"
            value={propertyNameFilter}
            onChange={(e) => setPropertyNameFilter(e.target.value)}
          />
        </div>
        <div className="col-md-6 mb-2">
          <input
            type="date"
            className="form-control"
            value={propertyDateFilter}
            onChange={(e) => setPropertyDateFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Property Table */}
      {showTable && (
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Owner</th>
                    <th>GSM</th>
                    <th>Property Name</th>
                    <th>Location</th>
                    <th>Address</th>
                    <th>Captured By</th>
                    <th>Date Captured</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((p, index) => (
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
