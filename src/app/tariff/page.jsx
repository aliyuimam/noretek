"use client";

import React, { useState, useEffect } from "react";

export default function TariffPage() {
  // Login state
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
    company: "Noretek Energy",
  });
  const [token, setToken] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Tariff form state
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    tariffId: "",
    tariffName: "",
    price: "",
    tax: "",
    repaymentRatio: "",
    monthlyCost: "",
    company: "Noretek Energy",
    remark: "",
  });
  const [formMessage, setFormMessage] = useState("");
  const [formMessageType, setFormMessageType] = useState("");

  // Table state
  const [tariffs, setTariffs] = useState([]);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
    totalPages: 1,
    totalRecords: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("tariffId");
  const [sortOrder, setSortOrder] = useState("asc");

  // Initialize token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);
useEffect(() => {
  if (token) fetchTariffs();
}, [token, pagination.pageNumber, pagination.pageSize, searchTerm, sortField, sortOrder]);
  // Fetch tariffs when token or filters change
  useEffect(() => {
    if (token) fetchTariffs();
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

  // Tariff form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === "price" || name === "tax" || name === "repaymentRatio" || name === "monthlyCost" 
        ? value === "" ? "" : Number(value) 
        : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");
    setFormMessageType("");
    setLoading(true);
    
    try {
      const endpoint = isEditing 
        ? "http://47.107.69.132:9400/API/Tariff/Update" 
        : "http://47.107.69.132:9400/API/Tariff/Create";
      
      // Format the data according to API requirements
      const requestData = isEditing 
        ? { 
            ...formData,
            price: formData.price ? Number(formData.price) : 0,
            tax: formData.tax ? Number(formData.tax) : 0,
            repaymentRatio: formData.repaymentRatio ? Number(formData.repaymentRatio) : 0,
            monthlyCost: formData.monthlyCost ? Number(formData.monthlyCost) : 0
          }
        : { 
            ...formData,
            price: formData.price ? Number(formData.price) : 0,
            tax: formData.tax ? Number(formData.tax) : 0,
            repaymentRatio: formData.repaymentRatio ? Number(formData.repaymentRatio) : 0,
            monthlyCost: formData.monthlyCost ? Number(formData.monthlyCost) : 0
          };
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(isEditing ? [requestData] : [requestData]),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data?.result !== undefined) {
        setFormMessage(`✅ Tariff ${isEditing ? 'updated' : 'created'} successfully.`);
        setFormMessageType("success");
        resetForm();
        fetchTariffs();
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
      tariffId: "",
      tariffName: "",
      price: "",
      tax: "",
      repaymentRatio: "",
      monthlyCost: "",
      company: "Noretek Energy",
      remark: "",
    });
    setIsEditing(false);
  };

  // Table functions
  const fetchTariffs = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://47.107.69.132:9400/API/Tariff/Read", {
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
      setTariffs(data?.result?.data || []);
      
      if (data?.result?.pagination) {
        setPagination(prev => ({
          ...prev,
          totalPages: data.result.pagination.totalPages || 1,
          totalRecords: data.result.pagination.totalRecords || 0,
        }));
      }
    } catch (err) {
      setTariffs([]);
      setFormMessage("❌ Error fetching tariffs: " + err.message);
      setFormMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, pageNumber: newPage }));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, pageNumber: 1 }));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleEdit = (tariff) => {
    setFormData({
      tariffId: tariff.tariffId ?? "",
      tariffName: tariff.tariffName ?? "",
      price: tariff.price ?? "",
      tax: tariff.tax ?? "",
      repaymentRatio: tariff.repaymentRatio ?? "",
      monthlyCost: tariff.monthlyCost ?? "",
      company: tariff.company ?? "Noretek Energy",
      remark: tariff.remark ?? "",
    });
    setIsEditing(true);
    setFormMessage("");
    setFormMessageType("");
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
        <div className="card mb-5 shadow-sm">
          <div className="card-header primaryColor text-center">
            <h4>Login to Get Token</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleLoginSubmit}>
              <div className="mb-3">
                <label className="form-label">User ID</label>
                <input
                  type="text"
                  className="form-control shadow-none"
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
                  className="form-control shadow-none"
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
                  className="form-control shadow-none"
                  name="company"
                  value={loginData.company}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn primaryColor w-100"
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

      {/* TARIFF FORM */}
      {token && (
        <div className="card mb-5 shadow-sm">
          <div className="card-header primaryColor  text-center">
            <h4>{isEditing ? "Edit Tariff" : "Create New Tariff"}</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} className="row g-3">
              {[
                ["tariffId", "Tariff ID:", "text", true],
                ["tariffName", "Tariff Name:", "text", true],
                ["price", "Price:", "number", true],
                ["tax", "Tax:", "number", true],
                ["repaymentRatio", "Repayment Ratio:", "number", true],
                ["monthlyCost", "Monthly Cost:", "number", true],
                ["company", "Company:", "text", false],
                ["remark", "Remark:", "text", false],
              ].map(([key, label, type, required]) => (
                <div className="col-md-6" key={key}>
                  <label className="form-label">{label}</label>
                  <input
                    type={type}
                    className="form-control shadow-none"
                    name={key}
                    value={formData[key] ?? ""}
                    onChange={handleChange}
                    required={required}
                    readOnly={key === "company" || (isEditing && key === "tariffId")}
                    step={type === "number" ? "0.01" : undefined}
                  />
                </div>
              ))}
              <div className="col-12">
                <button 
                  type="submit" 
                  className="btn primaryColor w-100"
                  disabled={loading}
                >
                  {loading ? "Processing..." : (isEditing ? "Update Tariff" : "Create Tariff")}
                </button>
                {isEditing && (
                  <button 
                    type="button" 
                    className="btn btn-secondary w-100 mt-2"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
              {formMessage && (
                <div className={`alert mt-3 alert-${formMessageType === "success" ? "success" : "danger"}`}>
                  {formMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* TARIFF TABLE */}
      {token && (
        <div className="card shadow">
          <div className="card-header primaryColor text-white">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <h5 className="mb-0">Tariff Management</h5>
              <div className="d-flex flex-wrap gap-2">
                <form onSubmit={handleSearch} className="d-flex">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search tariffs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="btn titleColor bg-light border-opacity-50 border" type="submit">
                      Search
                    </button>
                  </div>
                </form>
                <select
                  className="form-select shadow-none"
                  value={`${sortField}:${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split(':');
                    setSortField(field);
                    setSortOrder(order);
                  }}
                >
                  <option value="tariffId:asc">Sort by Tariff ID (A-Z)</option>
                  <option value="tariffId:desc">Sort by Tariff ID (Z-A)</option>
                  <option value="tariffName:asc">Sort by Name (A-Z)</option>
                  <option value="tariffName:desc">Sort by Name (Z-A)</option>
                  <option value="price:desc">Sort by Highest Price</option>
                  <option value="price:asc">Sort by Lowest Price</option>
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
                      <th onClick={() => handleSort("tariffId")} className="cursor-pointer titleColor">
                        Tariff ID {sortField === "tariffId" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </th>
                      <th onClick={() => handleSort("tariffName")} className="cursor-pointer titleColor">
                        Name {sortField === "tariffName" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </th>
                      <th onClick={() => handleSort("price")} className="cursor-pointer titleColor">
                        Price {sortField === "price" && (
                          <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                        )}
                      </th>
                      <th className="titleColor">Tax</th>
                      <th className="titleColor">Repayment Ratio</th>
                      <th className="titleColor">Monthly Cost</th>
                      <th className="titleColor">Company</th>
                      <th className="titleColor">Remark</th>
                      <th className="titleColor">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tariffs.length > 0 ? (
                      tariffs.map((tariff, index) => (
                        <tr key={index}>
                          <td>{tariff.tariffId}</td>
                          <td>{tariff.tariffName}</td>
                          <td>{tariff.price}</td>
                          <td>{tariff.tax}</td>
                          <td>{tariff.repaymentRatio}</td>
                          <td>{tariff.monthlyCost}</td>
                          <td>{tariff.company}</td>
                          <td>{tariff.remark}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleEdit(tariff)}
                              disabled={loading}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center text-muted display-5 py-4">
                          No tariffs found
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
                    {pagination.totalRecords} tariffs
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
                      onChange={(e) => setPagination(prev => ({
                        ...prev,
                        pageSize: Number(e.target.value),
                        pageNumber: 1
                      }))}
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