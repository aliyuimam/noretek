"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [submitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // ✅ call the existing API route
      const res = await axios.post("/api/customer-signin-api", form);

      // API returns { message, role } on success
      setMessage(res.data.message);

      // Optional: save user email / role in localStorage
  localStorage.setItem("userEmail", form.email);
  localStorage.setItem("userRole", res.data.role);


      // Redirect after a small delay
      if (res.data.role === "Customer") {
        setMessage("Signin successful! Redirecting...");
        setTimeout(() => {
          router.push("/customer_dashboard"); // ✅ redirect to dashboard
        }, 1500);
      } else {
        // fallback dashboard
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="shadow-lg p-4 p-md-5 rounded w-100"
        style={{ maxWidth: 600 }}
      >
        <h4 className="mb-4 text-center titleColor text-uppercase font-monospace">
          Customer Sign In
        </h4>

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
            <label className="fw-bold">Password:</label>
            <input
              type="password"
              className="form-control shadow-none p-2"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="btn primaryColor font-monospace rounded w-100"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
