"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Logging in...");

    try {
      const res = await fetch("/api/stafflogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        // Save token + user data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setStatus("Login successful ✅ Redirecting...");

        // Role-based redirection
        switch (data.user.role) {
          case "Admin":
            router.push("/admin_dashboard");
            break;
          case "Enrollment Officer":
            router.push("/enrollmentOfficer");
            break;
          case "Support Officer":
            router.push("/support_officer_dashboard");
            break;
          default:
            router.push("/dashboard"); // fallback
        }
      } else {
        setStatus("❌ " + data.error);
      }
    } catch (err) {
      setStatus("⚠️ Something went wrong");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center">Staff Login</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-dark w-100">
          Login
        </button>
        {status && <p className="text-center mt-3">{status}</p>}
      </form>
    </div>
  );
}
