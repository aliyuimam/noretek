"use client";

import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    company: "",
  });

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://47.107.69.132:9400/API/User/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data?.result?.token) {
        setToken(data.result.token);
        console.log("Token:", data.result.token);
        // Optionally store token
        localStorage.setItem("token", data.result.token);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label htmlFor="userId" className="form-label">
            User ID
          </label>
          <input
            type="text"
            className="form-control"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="company" className="form-label">
            Company
          </label>
          <input
            type="text"
            className="form-control"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {token && (
          <div className="alert alert-success mt-3">Token: {token}</div>
        )}
      </form>
    </div>
  );
}
