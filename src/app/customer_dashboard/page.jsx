"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TicketForm from "@/MainComponent/TicketForm";

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userData, setUserData] = useState({
    _id: "",
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

  // Handle ticket submission
  const handleTicketSubmit = async (formData) => {
    setIsLoading(true);
    setSaveStatus("saving");

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          created_by: userData._id, // created_by can be empty if not logged in
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create ticket");
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (error) {
      console.error("Error creating ticket:", error);
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user data from localStorage or API
  useEffect(() => {
    const fetchUserData = () => {
      setIsLoading(true);
      try {
        const storedEmail = localStorage.getItem("userEmail");
        const storedUserId = localStorage.getItem("userId");
        if (storedEmail) setEmail(storedEmail);

        const storedUserData = localStorage.getItem("userData");
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData);
          setUserData({ ...parsedData, _id: storedUserId || "" });
        } else if (storedEmail) {
          setUserData((prev) => ({
            ...prev,
            _id: storedUserId || "",
            email: storedEmail,
            meterId: localStorage.getItem("meterNumber") || "Not assigned",
          }));
        }

        const storedNotifications = localStorage.getItem("notificationSettings");
        if (storedNotifications) {
          setNotificationSettings(JSON.parse(storedNotifications));
        }

        if (storedEmail) {
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
      const response = await fetch(`/api/payments/history?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("meterNumber");
    localStorage.removeItem("lastToken");
    localStorage.removeItem("lastMeter");
    localStorage.removeItem("lastUnits");
    localStorage.removeItem("lastAmount");
    localStorage.removeItem("purchasedTokens");
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
      const updatedUserData = { ...userData, email: email };
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
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSaveStatus("password_changed");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error changing password:", error);
      setSaveStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
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
      console.error("Error saving notification settings:", error);
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
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#b7e1fda7", zIndex: 9999 }}
        >
          <div className="spinner-border titleColor" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {saveStatus && (
        <div
          className={`alert alert-${saveStatus.includes("error") ? "danger" : "success"
            } alert-dismissible fade show position-fixed top-0 end-0 m-3`}
          style={{ zIndex: 9998 }}
          role="alert"
        >
          {saveStatus === "saving" && "Saving changes..."}
          {saveStatus === "saved" && "Changes saved successfully!"}
          {saveStatus === "password_changed" && "Password changed successfully!"}
          {saveStatus === "password_mismatch" && "New passwords don't match!"}
          {saveStatus === "error" && "An error occurred. Please try again."}
          <button type="button" className="btn-close" onClick={() => setSaveStatus("")}></button>
        </div>
      )}
      <nav className="navbar navbar-expand-lg navbar-dark primaryColor">
        <div className="container-fluid d-flex align-items-center justify-content-between flex-wrap px-2">
          <button className="btn text-white me-3 d-lg-none" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>
          <a className="navbar-brand text-white me-auto" href="#">
            Dashboard
          </a>
          <ul className="navbar-nav d-flex flex-row ms-auto">
            <li className="nav-item mx-2">
              <a className="nav-link text-white text-truncate" href="">
                <i className="bi bi-person me-2"></i>
                {email}
              </a>
            </li>
            <li className="nav-item mx-2">
              <button className="btn btn-outline-light" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-1"></i>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      <div className="d-flex">
        <div
          className={`sidebar primaryColor p-2 ${sidebarOpen ? "d-block" : "d-none"} d-lg-block`}
          style={{ minHeight: "100vh", width: "250px" }}
        >
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <a
                className={`nav-link text-white ${activeSection === "dashboard" ? "active bg-secondary rounded" : ""
                  }`}
                href="#"
                onClick={() => setActiveSection("dashboard")}
              >
                <i className="bi bi-speedometer2 me-2"></i>Dashboard
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className={`nav-link text-white ${activeSection === "transactions" ? "active bg-secondary rounded" : ""
                  }`}
                href="#"
                onClick={() => setActiveSection("transactions")}
              >
                <i className="bi bi-cash me-2"></i>Transaction History
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className={`nav-link text-white ${activeSection === "buy" ? "active bg-secondary rounded" : ""
                  }`}
                href="#"
                onClick={() => setActiveSection("buy")}
              >
                <i className="bi bi-credit-card me-2"></i>Buy Token
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className={`nav-link text-white ${activeSection === "support" ? "active bg-secondary rounded" : ""
                  }`}
                href="#"
                onClick={() => setActiveSection("support")}
              >
                <i className="bi bi-phone me-2"></i>Contact Support
              </a>
            </li>
            <li className="nav-item mb-2">
              <a
                className={`nav-link text-white ${activeSection === "Comments" ? "active bg-secondary rounded" : ""
                  }`}
                href="/CommentList"
                onClick={() => setActiveSection("Comments")}
              >
                <i className="bi bi-chat-left-dots me-2"></i>View Comment
              </a>
            </li>
            <li className="nav-item mt-3"></li>
            <li className="nav-item mt-3">
              <a
                className={`nav-link text-white ${activeSection === "settings" ? "active bg-secondary rounded" : ""
                  }`}
                href="#"
                onClick={() => setActiveSection("settings")}
              >
                <i className="bi bi-gear me-2"></i>Settings
              </a>
            </li>
          </ul>
        </div>
        <div id="main" className="flex-grow-1 p-4 bg-light">
          {activeSection === "dashboard" && (
            <div className="container">
              <div className="text-center mb-5">
                <h2 className="mb-3 titleColor">🎉 Welcome to Your Dashboard</h2>
                <p className="lead">This is your secure user area.</p>
                <p className="text-muted">
                  You can manage your tokens and settings from the sections below.
                </p>
              </div>
              <div className="row g-4">
                <div className="col-12 col-lg-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <i className="bi bi-lightning-charge fs-1 titleColor me-3"></i>
                      <div>
                        <h5 className="card-title mb-1 titleColor">My Meter ID</h5>
                        <p className="card-text text-muted">{userData.meterId || "Loading..."}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <i className="bi bi-credit-card fs-1 titleColor me-3"></i>
                      <div>
                        <h5 className="card-title mb-1 titleColor">Buy Token</h5>
                        <p className="card-text text-muted">Purchase electricity tokens</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-body d-flex align-items-center">
                      <i className="bi bi-clock-history fs-1 titleColor me-3"></i>
                      <div>
                        <h5 className="card-title mb-1 titleColor">Recent Transactions</h5>
                        <p className="card-text text-muted">View your transaction history</p>
                      </div>
                    </div>
                  </div>
                </div>
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
          {activeSection === "settings" && (
            <div className="container">
              <h2 className="mb-4 titleColor">Account Settings</h2>
              <div className="row">
                <div className="col-md-6">
                  <div className="card shadow-sm mb-4">
                    <div className="card-header primaryColor">
                      <h5 className="mb-0">Profile Information</h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handleProfileUpdate}>
                        <div className="mb-3">
                          <label htmlFor="firstName" className="form-label">First Name:</label>
                          <input
                            type="text"
                            className="form-control shadow-none"
                            id="firstName"
                            value={userData.firstName}
                            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="lastName" className="form-label">Last Name:</label>
                          <input
                            type="text"
                            className="form-control shadow-none"
                            id="lastName"
                            value={userData.lastName}
                            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email Address:</label>
                          <input
                            type="email"
                            className="form-control shadow-none"
                            id="email"
                            value={email}
                            disabled
                            style={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}
                          />
                          <div className="form-text">This is the email you used to login. It cannot be changed.</div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="meterId" className="form-label">Meter ID</label>
                          <input
                            type="text"
                            className="form-control shadow-none"
                            id="meterId"
                            value={userData.meterId}
                            disabled
                            style={{ backgroundColor: "#f2f2f2", fontWeight: "bold" }}
                          />
                          <div className="form-text">Your unique meter identifier. Contact support to change.</div>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="phone" className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control shadow-none"
                            id="phone"
                            value={userData.phone}
                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="address" className="form-label">Address</label>
                          <textarea
                            className="form-control shadow-none"
                            id="address"
                            rows="3"
                            value={userData.address}
                            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                          ></textarea>
                        </div>
                        <button type="submit" className="btn primaryColor align-self-end">
                          Update Profile
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card shadow-sm mb-4">
                    <div className="card-header primaryColor">
                      <h5 className="mb-0">Change Password</h5>
                    </div>
                    <div className="card-body">
                      <form onSubmit={handlePasswordChange}>
                        <div className="mb-3">
                          <label htmlFor="currentPassword" className="form-label">Current Password</label>
                          <input
                            type="password"
                            className="form-control shadow-none"
                            id="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, currentPassword: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="newPassword" className="form-label">New Password</label>
                          <input
                            type="password"
                            className="form-control shadow-none"
                            id="newPassword"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, newPassword: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                          <input
                            type="password"
                            className="form-control shadow-none"
                            id="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                            }
                            required
                          />
                        </div>
                        <button type="submit" className="btn primaryColor">Change Password</button>
                      </form>
                    </div>
                  </div>
                  <div className="card shadow-sm">
                    <div className="card-header primaryColor">
                      <h5 className="mb-0">Notification Preferences</h5>
                    </div>
                    <div className="card-body">
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input shadow-none"
                          type="checkbox"
                          id="emailNotifications"
                          name="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onChange={handleNotificationChange}
                        />
                        <label className="form-check-label" htmlFor="emailNotifications">
                          Email Notifications
                        </label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input shadow-none"
                          type="checkbox"
                          id="smsNotifications"
                          name="smsNotifications"
                          checked={notificationSettings.smsNotifications}
                          onChange={handleNotificationChange}
                        />
                        <label className="form-check-label" htmlFor="smsNotifications">
                          SMS Notifications
                        </label>
                      </div>
                      <div className="form-check mb-3">
                        <input
                          className="form-check-input shadow-none"
                          type="checkbox"
                          id="promotionalEmails"
                          name="promotionalEmails"
                          checked={notificationSettings.promotionalEmails}
                          onChange={handleNotificationChange}
                        />
                        <label className="form-check-label" htmlFor="promotionalEmails">
                          Promotional Emails
                        </label>
                      </div>
                      <button type="button" className="btn primaryColor" onClick={saveNotificationSettings}>
                        Save Preferences
                      </button>
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
                              <td>
                                {new Date(payment.createdAt || payment.created_at).toLocaleDateString()}
                              </td>
                              <td>₦{payment.amount}</td>
                              <td>
                                <span
                                  className={`badge ${payment.status === "success"
                                      ? "bg-success"
                                      : payment.status === "pending"
                                        ? "bg-warning"
                                        : "bg-danger"
                                    }`}
                                >
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
              <div className="row">
                <div className="col-md-8 mx-auto">
                  <div className="card shadow-sm">
                    <div className="card-body text-center py-5">
                      <i className="bi bi-credit-card fs-1 titleColor mb-3" style={{ fontSize: "3rem" }}></i>
                      <h3 className="titleColor">Token Purchase</h3>
                      <p className="text-muted mb-4">
                        Click the button below to navigate to the token purchase page where you can buy electricity tokens.
                      </p>
                      <button
                        className="btn primaryColor btn-lg"
                        onClick={navigateToPaymentDashboard}
                      >
                        Go to Payment Dashboard
                      </button>
                      <div className="mt-4">
                        <div className="alert alert-info">
                          <h6 className="alert-heading">What to expect:</h6>
                          <ul className="mb-0 ps-3">
                            <li>Secure payment processing</li>
                            <li>Instant token generation</li>
                            <li>Transaction history tracking</li>
                            <li>Email confirmation</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeSection === "support" && (
            <div className="container">
              <h2 className="mb-4 titleColor">Contact Support</h2>
              <div className="card shadow-sm">
                <div className="card-body">
                  <TicketForm
                    onSave={handleTicketSubmit}
                    currentCustomer={{ id: userData._id, ...userData }}
                    editingTicket={null}
                    setEditingTicket={() => { }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}