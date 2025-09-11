"use client";

import React, { useState, useEffect } from "react";

export default function CustomerPage() {

  
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
    company: "Noretek Energy",
  });

  const [token, setToken] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    type: 0,
    phone: "",
    address: "",
    certifiName: "",
    certifiNo: "",
    remark: "",
    company: "Noretek Energy",
  });

  const [formMessage, setFormMessage] = useState("");
  const [formMessageType, setFormMessageType] = useState("");

  // Load token if already saved
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Handle login input change
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle customer form input change
  const handleCustomerChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Login to get token
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
      const data = await res.json();
      console.log("Login API Response:", data);

      if (data?.result?.token) {
        localStorage.setItem("token", data.result.token);
        setToken(data.result.token);
        setFormMessage("✅ Login successful. Token stored.");
        setFormMessageType("success");
      } else {
        setLoginError(data?.message || "Login failed. Check credentials.");
      }
    } catch (err) {
      setLoginError("An error occurred: " + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Submit customer creation form
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setFormMessage("");
    setFormMessageType("");
    try {
      console.log("Submitting customer data:", formData);

      const res = await fetch("http://47.107.69.132:9400/API/Customer/Create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // ✅ Wrap formData in array
        body: JSON.stringify([formData]),
      });

      const data = await res.json();
      console.log("Create Customer API Response:", data);

      if (data?.result) {
        setFormMessage("✅ Customer created successfully.");
        setFormMessageType("success");
      } else {
        setFormMessage(
          "❌ Failed to create customer: " +
            (data?.message || JSON.stringify(data) || "Unknown error")
        );
        setFormMessageType("error");
      }
    } catch (err) {
      setFormMessage("❌ Error: " + err.message);
      setFormMessageType("error");
    }
  };

  return (
    <div className="container mt-5">
      {/* LOGIN FORM */}
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

      {/* CUSTOMER FORM */}
      <div className="card shadow">
        <div className="card-header bg-primary text-white text-center">
          <h4>Create Customer</h4>
        </div>
        <div className="card-body">
          {/* Message at the top */}
          {formMessage && (
            <div
              className={`alert ${
                formMessageType === "success"
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {formMessage}
            </div>
          )}

          <form onSubmit={handleCustomerSubmit} className="row g-3">
            {Object.entries(formData).map(([key, value]) => (
              <div className="col-md-6" key={key}>
                <label htmlFor={key} className="form-label text-capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleCustomerChange}
                  required={key !== "remark"}
                  readOnly={key === "company"}
                />
              </div>
            ))}
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-success px-4">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
