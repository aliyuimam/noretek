"use client";

import React, { useState, useEffect } from "react";

export default function MeterPage() {
  // Login state
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
    company: "Noretek Energy",
  });
  const [token, setToken] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Meter form state
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    meterId: "",
    type: 0,
    communicationWay: 0,
    protocolType: 0,
    protocolVersion: "",
    company: "Noretek Energy",
    lat: 0,
    lng: 0,
    remark: "",
  });
  const [formMessage, setFormMessage] = useState("");
  const [formMessageType, setFormMessageType] = useState("");

  // Table state
  const [meters, setMeters] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("meterId");
  const [sortOrder, setSortOrder] = useState("asc");

  // Options for dropdowns with numeric values
  const meterTypes = [
  
    { value: 2, label: "Gas" }
  ];

  const communicationWays = [
    { value: 0, label: "GPRS" },
    { value: 1, label: "PLC" },
    { value: 2, label: "LoRa" },
    { value: 3, label: "RS485" }
  ];

  const protocolTypes = [
    { value: 0, label: "DLMS(WRAPPER)" },
    { value: 1, label: "MODBUS" },
    { value: 2, label: "IEC" }
  ];

  // Initialize token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  // Fetch meters when token or filters change
  useEffect(() => {
    if (token) {
      console.log("Fetching meters with:", { 
        pageNumber: pagination.pageNumber, 
        pageSize: pagination.pageSize, 
        searchTerm, 
        sortField, 
        sortOrder 
      });
      fetchMeters();
    }
  }, [token, pagination.pageNumber, pagination.pageSize, searchTerm, sortField, sortOrder]);

  // Login handlers
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("http://47.107.69.132:9400/API/User/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      if (data?.result?.token) {
        localStorage.setItem("token", data.result.token);
        setToken(data.result.token);
      } else {
        setLoginError(data?.message || "Login failed. Check credentials.");
      }
    } catch (err) {
      setLoginError("An error occurred: " + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Meter form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric fields - ensure they are numbers
    if (["type", "communicationWay", "protocolType", "lat", "lng"].includes(name)) {
      const numericValue = value === "" ? 0 : parseInt(value, 10);
      setFormData(prev => ({ ...prev, [name]: isNaN(numericValue) ? 0 : numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");
    setFormMessageType("");
    setLoading(true);
    
    try {
      // Prepare data for API - ensure proper types
      const submitData = {
        meterId: formData.meterId,
        type: Number(formData.type),
        communicationWay: Number(formData.communicationWay),
        protocolType: Number(formData.protocolType),
        protocolVersion: formData.protocolVersion || "",
        company: formData.company,
        lat: formData.lat ? Number(formData.lat) : 0,
        lng: formData.lng ? Number(formData.lng) : 0,
        remark: formData.remark || ""
      };

      const res = await fetch("http://47.107.69.132:9400/API/Meter/Create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([submitData]),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data?.result !== undefined) {
        setFormMessage("✅ Meter created successfully.");
        setFormMessageType("success");
        resetForm();
      } else {
        const errorMsg = data?.message || "Operation failed";
        setFormMessage(`❌ ${errorMsg}`);
        setFormMessageType("error");
      }
    } catch (err) {
      setFormMessage("❌ Error: " + err.message);
      setFormMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      meterId: "",
      type: 0,
      communicationWay: 0,
      protocolType: 0,
      protocolVersion: "",
      company: "Noretek Energy",
      lat: 0,
      lng: 0,
      remark: "",
    });
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    setToken("");
    setMeters([]);
  };

  // Table functions
  const fetchMeters = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://47.107.69.132:9400/API/Meter/Read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          createDateRange: [],
          updateDateRange: [],
          pageNumber: pagination.pageNumber,
          pageSize: pagination.pageSize,
          company: "Noretek Energy",
          searchTerm: searchTerm,
          sortField: sortField,
          sortOrder: sortOrder,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("API response:", data);
      setMeters(data?.result?.data || []);
      
      if (data?.result?.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: data.result.pagination.totalPages || 1,
          totalRecords: data.result.pagination.totalRecords || 0,
        }));
      }
    } catch (err) {
      setMeters([]);
      setFormMessage("❌ Error fetching meters: " + err.message);
      setFormMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    console.log("Changing page to:", newPage);
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, pageNumber: newPage }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
  };

  const handleSort = (field) => {
    console.log("Sorting by:", field);
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    console.log("Changing page size to:", newSize);
    setPagination(prev => ({
      ...prev,
      pageSize: newSize,
      pageNumber: 1
    }));
  };

  // Helper function to get label from value
  const getLabelFromValue = (value, options) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <div className="container mt-5">
      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .card {
          border: none;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .card-header {
          border-bottom: 1px solid rgba(0,0,0,0.1);
          padding: 1rem 1.5rem;
        }
        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
          border-color: #80bdff;
        }
        .btn {
          border-radius: 5px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .btn:disabled {
          opacity: 0.65;
        }
        .table th {
          border-top: none;
          font-weight: 600;
          color: #495057;
          background-color: #f8f9fa;
        }
        .alert {
          border: none;
          border-radius: 5px;
          padding: 0.75rem 1.25rem;
        }
        .spinner-border {
          width: 3rem;
          height: 3rem;
        }
        .input-group {
          width: auto;
        }
      `}</style>

      {/* LOGIN FORM */}
      {!token && (
        <div className="card mb-5 shadow">
          <div className="card-header bg-dark text-white text-center">
            <h4>Login to Get Token</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label">User ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="userId"
                  value={loginData.userId}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-control"
                  name="company"
                  value={loginData.company}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loginLoading}
              >
                {loginLoading ? "Logging in..." : "Login"}
              </button>
              {loginError && (
                <div className="alert alert-danger mt-3">{loginError}</div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* METER FORM */}
      {token && (
        <div className="card mb-5 shadow-sm">
          <div className="card-header primaryColor  fw-bold text-center">
            <h4>Create New Meter</h4>
          </div>
          <div className="card-body">
            {/* Success/Error message at the TOP */}
            {formMessage && (
              <div className={`alert alert-${formMessageType === "success" ? "success" : "danger"} mb-4`}>
                {formMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Meter ID *</label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  name="meterId"
                  value={formData.meterId}
                  onChange={handleChange}
                  required
                  placeholder="Enter unique meter ID"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label shadow-none">Type *</label>
                <select
                  className="form-control shadow-none"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  {meterTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label ">Communication Way *</label>
                <select
                  className="form-control shadow-none"
                  name="communicationWay"
                  value={formData.communicationWay}
                  onChange={handleChange}
                  required
                >
                  {communicationWays.map(way => (
                    <option key={way.value} value={way.value}>
                      {way.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Protocol Type *</label>
                <select
                  className="form-control shadow-none"
                  name="protocolType"
                  value={formData.protocolType}
                  onChange={handleChange}
                  required
                >
                  {protocolTypes.map(protocol => (
                    <option key={protocol.value} value={protocol.value}>
                      {protocol.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Protocol Version</label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  name="protocolVersion"
                  value={formData.protocolVersion}
                  onChange={handleChange}
                  placeholder="e.g., 1.0"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  name="company"
                  value={formData.company}
                  readOnly
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Latitude</label>
                <input
                  type="number"
                  className="form-control shadow-none"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  step="any"
                  placeholder="0.000000"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Longitude</label>
                <input
                  type="number"
                  className="form-control shadow-none"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  step="any"
                  placeholder="0.000000"
                />
              </div>

              <div className="col-12">
                <label className="form-label">Remark</label>
                <textarea
                  className="form-control shadow-none"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Optional remarks"
                ></textarea>
              </div>

              <div className="col-12">
                <button type="submit" className="btn primaryColor fw-bold w-100" disabled={loading}>
                  {loading ? "Creating..." : "Create Meter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* METER TABLE */}
      {token && (
        <div className="card shadow mb-5">
          <div className="card-header primaryColor text-white">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h5 className="mb-0">Meter Management</h5>
              <div className="d-flex flex-wrap gap-2">
                <form onSubmit={handleSearch} className="d-flex">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control shadow-none"
                      placeholder="Search meters..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn titleColor bg-light border-opacity-50 border" type="submit" disabled={loading}>
                      Search
                    </button>
                  </div>
                </form>
                <select
                  className="form-select "
                  value={`${sortField}:${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split(':');
                    setSortField(field);
                    setSortOrder(order);
                  }}
                  disabled={loading}
                >
                  <option value="meterId:asc">Sort by Meter ID (A-Z)</option>
                  <option value="meterId:desc">Sort by Meter ID (Z-A)</option>
                  <option value="type:asc">Sort by Type (A-Z)</option>
                  <option value="type:desc">Sort by Type (Z-A)</option>
                  <option value="createDate:desc">Newest First</option>
                  <option value="createDate:asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
          <div className="card-body table-responsive">
            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <table className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort("meterId")} className="cursor-pointer titleColor">
                        Meter ID {sortField === "meterId" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </th>
                      <th onClick={() => handleSort("type")} className="cursor-pointer titleColor">
                        Type {sortField === "type" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </th>
                      <th className="titleColor">Communication Way</th>
                      <th className="titleColor">Protocol Type</th>
                      <th className="titleColor">Protocol Version</th>
                      <th className="titleColor">Latitude</th>
                      <th className="titleColor">Longitude</th>
                      <th className="titleColor">Company</th>
                      <th className="titleColor">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meters.length > 0 ? (
                      meters.map((meter, index) => (
                        <tr key={index}>
                          <td>{meter.meterId}</td>
                          <td>{getLabelFromValue(meter.type, meterTypes)}</td>
                          <td>{getLabelFromValue(meter.communicationWay, communicationWays)}</td>
                          <td>{getLabelFromValue(meter.protocolType, protocolTypes)}</td>
                          <td>{meter.protocolVersion || "-"}</td>
                          <td>{meter.lat || "-"}</td>
                          <td>{meter.lng || "-"}</td>
                          <td>{meter.company}</td>
                          <td>{meter.remark || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center text-muted display-5 py-4">
                          No meters found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {/* Pagination controls */}
                <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-3">
                  <div className="text-nowrap">
                    Showing {(pagination.pageNumber - 1) * pagination.pageSize + 1} to{' '}
                    {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalRecords)} of{' '}
                    {pagination.totalRecords} meters
                  </div>
                  <div className="btn-group">
                    <button
                      className="btn primaryColor"
                      onClick={() => handlePageChange(pagination.pageNumber - 1)}
                      disabled={pagination.pageNumber === 1 || loading}
                    >
                      Previous
                    </button>
                    <span className="btn btn-light disabled">
                      Page {pagination.pageNumber} of {pagination.totalPages}
                    </span>
                    <button
                      className="btn primaryColor"
                      onClick={() => handlePageChange(pagination.pageNumber + 1)}
                      disabled={pagination.pageNumber === pagination.totalPages || loading}
                    >
                      Next
                    </button>
                  </div>
                  <div className="form-group">
                    <select
                      className="form-select"
                      value={pagination.pageSize}
                      onChange={handlePageSizeChange}
                      disabled={loading}
                    >
                      <option value="5">5 per page</option>
                      <option value="10">10 per page</option>
                      <option value="20">20 per page</option>
                      <option value="50">50 per page</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}