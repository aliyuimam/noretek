"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TicketForm from "@/MainComponent/TicketForm";

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    meterId: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    promotionalEmails: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState("");
  const [payments, setPayments] = useState([]);

  const router = useRouter();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // 🔹 Fetch user profile from API
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
          setEmail(storedEmail);

          const res = await fetch(`/api/user/profile?email=${storedEmail}`);
          if (res.ok) {
            const data = await res.json();
            if (data.success) {
              setUserData(data.user);
            }
          } else {
            console.warn("API profile fetch failed, falling back to localStorage");
            const storedUserData = localStorage.getItem("userData");
            if (storedUserData) {
              setUserData(JSON.parse(storedUserData));
            }
          }

          // Fetch payments
          refreshPayments(storedEmail);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const refreshPayments = async (email) => {
    try {
      const response = await fetch(
        `/api/payments/history?email=${encodeURIComponent(email)}`
      );
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/customer-signin");
    router.refresh();
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveStatus("saving");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedUserData = { ...userData, email };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      setUserData(updatedUserData);

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSaveStatus("password_mismatch");
      setTimeout(() => setSaveStatus(""), 3000);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSaveStatus("password_changed");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({ ...notificationSettings, [name]: checked });
  };

  const saveNotificationSettings = async () => {
    setIsLoading(true);
    setSaveStatus("saving");
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (error) {
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToPaymentDashboard = () => {
    router.push("/customer_payment_dashboard");
  };

  return (
    <>
      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
             style={{ backgroundColor: "#b7e1fda7", zIndex: 9999 }}>
          <div className="spinner-border titleColor" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* ✅ Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark primaryColor">
        <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap px-2">
          <button className="btn text-white me-3 d-lg-none" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>
          <a className="navbar-brand text-white me-auto" href="#">Dashboard</a>
          <ul className="navbar-nav d-flex flex-row ms-auto">
            <li className="nav-item mx-2">
              <span className="nav-link text-white text-truncate">
                <i className="bi bi-person me-2"></i>{email}
              </span>
            </li>
            <li className="nav-item mx-2">
              <button className="btn btn-outline-light" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* ✅ Layout */}
      <div className="d-flex">
        {/* Sidebar */}
        <div className={`sidebar primaryColor p-2 ${sidebarOpen ? "d-block" : "d-none"} d-lg-block`}
             style={{ minHeight: "100vh", width: "250px" }}>
          <ul className="nav flex-column">
            {["dashboard", "transactions", "buy", "support", "settings"].map((section) => (
              <li key={section} className="nav-item mb-2">
                <a href="#"
                   className={`nav-link text-white ${
                     activeSection === section ? "active bg-secondary rounded" : ""
                   }`}
                   onClick={() => setActiveSection(section)}>
                  <i className={`bi me-2 ${
                    section === "dashboard" ? "bi-speedometer2" :
                    section === "transactions" ? "bi-cash" :
                    section === "buy" ? "bi-credit-card" :
                    section === "support" ? "bi-phone" : "bi-gear"
                  }`}></i>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ✅ Main Content */}
        <div id="main" className="flex-grow-1 p-4 bg-light">
          {activeSection === "dashboard" && (
            <div className="container">
              <div className="row g-4">
                {/* Meter ID */}
                <div className="col-12 col-lg-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <i className="bi bi-lightning-charge fs-1 titleColor me-3"></i>
                      <div>
                        <h5 className="card-title mb-1 titleColor">My Meter ID</h5>
                        <p className="card-text text-muted">
                          {userData.meterId || "Not assigned"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Buy Token */}
                <div className="col-12 col-lg-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <i className="bi bi-credit-card fs-1 titleColor me-3"></i>
                      <div>
                        <h5 className="card-title mb-1 titleColor">Buy Token</h5>
                        <button className="btn primaryColor mt-2"
                                onClick={navigateToPaymentDashboard}>
                          Go to Payment Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Recent Transactions */}
                <div className="col-12 col-lg-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <i className="bi bi-clock-history fs-1 titleColor me-3"></i>
                      <div>
                        <h5 className="card-title mb-1 titleColor">Recent Transactions</h5>
                        <p className="card-text text-muted">
                          {payments.length > 0 ? `${payments.length} transactions` : "No transactions yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Settings */}
                <div className="col-12 col-lg-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <i className="bi bi-gear fs-1 titleColor me-3"></i>
                      <div>
                        <h5 className="card-title mb-1 titleColor">Settings</h5>
                        <p className="card-text text-muted">Manage your account settings.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "transactions" && (
            <div className="container">
              <h2 className="mb-4 titleColor">Transaction History</h2>
              <div className="card shadow-sm">
                <div className="card-body">
                  {payments.length === 0 ? (
                    <p className="text-center text-muted display-5">No transactions yet.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead className="table-primary">
                          <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Reference</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment) => (
                            <tr key={payment._id || payment.id}>
                              <td>{new Date(payment.createdAt || payment.created_at).toLocaleDateString()}</td>
                              <td>₦{payment.amount}</td>
                              <td>
                                <span className={`badge ${
                                  payment.status === "success"
                                    ? "bg-success"
                                    : payment.status === "pending"
                                    ? "bg-warning"
                                    : "bg-danger"
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                              <td className="small">{payment.reference}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === "buy" && (
            <div className="container">
              <h2 className="mb-4 titleColor">Buy Tokens</h2>
              <div className="alert alert-info">
                Navigate to the payment dashboard to purchase tokens securely.
              </div>
              <button className="btn primaryColor btn-lg"
                      onClick={navigateToPaymentDashboard}>
                Go to Payment Dashboard
              </button>
            </div>
          )}

          {activeSection === "support" && (
            <div className="container">
              <h2 className="mb-4 titleColor">Contact Support</h2>
              <div className="card shadow-sm">
                <div className="card-body">
                  <TicketForm />
                </div>
              </div>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="container">
              <h2 className="mb-4 titleColor">Account Settings</h2>
              {/* Profile Update + Notifications remain same */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
