'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import Meter from '../meter/page';
import Tariff from '../tariff/page';
import Customer from '../customer/page';
import Account from '../account/page';
import Vend from '../vend/page';

export default function CalinavLayout() {
  const router = useRouter();
  const [active, setActive] = useState('customer');
  const [showLogin, setShowLogin] = useState(true);
  const [token, setToken] = useState('');
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
    company: "Noretek Energy",
  });
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formMessageType, setFormMessageType] = useState("");

  // Sync token from localStorage after hydration
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") || "");
    }
  }, []);

  // Login handlers
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    setFormMessage("");
    setFormMessageType("");
    try {
      const res = await fetch("http://47.107.69.132:9400/API/User/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();

      if (data?.result?.token) {
        localStorage.setItem("token", data.result.token);
        setToken(data.result.token);
        setShowLogin(false);
        setActive('customer');
        setFormMessage("✅ Login successful. Redirecting...");
        setFormMessageType("success");
        setTimeout(() => {
          setShowLogin(false);
          setActive('customer');
        }, 800);
      } else {
        setLoginError(data?.message || "Login failed. Check credentials.");
      }
    } catch (err) {
      setLoginError("An error occurred: " + err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setToken("");
    setShowLogin(true);
    setActive('customer');
    setFormMessage("");
    setFormMessageType("");
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar/Navbar */}
      <aside style={{
        width: '250px',
        background: '#023e8a',
        color: '#fff',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Calin Admin</h2>

        <button onClick={() => setActive('meter')} style={buttonStyle(active === 'meter')}>
          Meter
        </button>
        <button onClick={() => setActive('tariff')} style={buttonStyle(active === 'tariff')}>
          Tariff
        </button>
        <button onClick={() => setActive('customer')} style={buttonStyle(active === 'customer')}>
          Customer
        </button>
        <button onClick={() => setActive('account')} style={buttonStyle(active === 'account')}>
          Account
        </button>
        <button onClick={() => setActive('vend')} style={buttonStyle(active === 'vend')}>
          Vend
        </button>

        {/* Login/Logout */}
        <div style={{ marginTop: '2rem' }}>
          {token ? (
            <button
              className="btn btn-outline-light w-100"
              style={{ marginBottom: '1rem' }}
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button
              className="btn btn-outline-light w-100"
              style={{ marginBottom: '1rem' }}
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
          )}
        </div>

        <Link href="/" style={{ color: '#ccc', marginTop: 'auto', textDecoratio:"none" }}>
          ← Back to Home
        </Link>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, padding: '2rem' }}>
        {/* Show Login Form */}
        {showLogin && !token && (
          <div className="card mb-5 shadow-sm border-0" style={{ maxWidth: 500, margin: "0 auto" }}>
            <div className="card-header primaryColor text-center">
              <h4>Login</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                  <label className="form-label ">User ID:</label>
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
                  <label className="form-label">Password:</label>
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
                  <label className="form-label">Company:</label>
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
                {formMessage && (
                  <div className={`alert mt-3 alert-${formMessageType === "success" ? "success" : "danger"}`}>
                    {formMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Main dashboard content */}
        {!showLogin && token && (
          <>
            {active === 'meter' && <Meter />}
            {active === 'tariff' && <Tariff />}
            {active === 'customer' && <Customer />}
            {active === 'account' && <Account />}
            {active === 'vend' && <Vend />}
          </>
        )}
      </main>
    </div>
  );
}

// Inline button styling for active/inactive states
function buttonStyle(isActive) {
  return {
    background: isActive ? '#444' : 'transparent',
    border: 'none',
    color: '#fff',
    textAlign: 'left',
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal',
     borderLeft: isActive ? '4px solid #00f0ff' : '4px solid transparent',
  };
}