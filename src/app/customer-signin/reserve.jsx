"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/login", form);
      setMessage(res.data.message);

      if (res.data.role === "admin") {
        router.push("/admin_dashboard");
      } else if (res.data.role === "enrollment officer") {
        router.push("/enrollmentOffice");
      } else {
        router.push("/customer_dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="shadow-lg p-4 p-md-5 rounded w-100"
        style={{ maxWidth: 600 }}
      >
        <h2 className="mb-4 text-center titleColor text-uppercase  font-monospace">Login</h2>

        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="fw-bold">Email:</label>
            <input
              type="email"
              className="form-control shadow-none p-2"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="fw-bold ">Password:</label>
            <input
              type="password"
              className="form-control shadow-none p-2"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn primaryColor rounded w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
