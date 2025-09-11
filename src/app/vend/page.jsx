"use client";

import React, { useState, useEffect, useRef } from "react";

export default function CustomerTokenPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState("");
  
  // Login form state
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
    company: "Noretek Energy"
  });
  
  // Customer accounts state
  const [customers, setCustomers] = useState([]);
  const [customerTokens, setCustomerTokens] = useState([]);
  
  // Token generation state
  const [rechargeData, setRechargeData] = useState({
    meterId: "",
    amount: "",
    authorizationPassword: "",
    serialNumber: "",
    company: "Noretek Energy",
    isVendByTotalPaid: true
  });
  const [generatedToken, setGeneratedToken] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Refs for printing
  const receiptRef = useRef();

  // Initialize authentication from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      setAuthToken(savedToken);
      setIsAuthenticated(true);
      fetchCustomerAccounts(savedToken);
    }
  }, []);

  // Handle login form changes
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("http://47.107.69.132:9400/API/User/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result.token) {
          const token = data.result.token;
          
          // Store the token
          localStorage.setItem("authToken", token);
          setAuthToken(token);
          setIsAuthenticated(true);
          
          // Fetch customer accounts
          fetchCustomerAccounts(token);
          
          setMessage("Login successful!");
        } else {
          throw new Error(data.message || "Authentication failed");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      setMessage("Login failed: " + error.message);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch customer accounts
  const fetchCustomerAccounts = async (token) => {
    setLoading(true);
    try {
      const response = await fetch("http://47.107.69.132:9400/API/Account/Read", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageNumber: 1,
          pageSize: 50,
          company: "Noretek Energy"
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result.data) {
          setCustomers(data.result.data);
        } else {
          setMessage("No customer accounts found in response");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      setMessage("Error fetching customer accounts: " + error.message);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tokens for a specific customer
  const fetchCustomerTokens = async (customerId, meterId, customer) => {
    setLoading(true);
    setSelectedCustomer(customer);
    
    try {
      const response = await fetch("http://47.107.69.132:9400/API/Token/CreditTokenRecord/Read", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meterId: meterId,
          company: "Noretek Energy",
          pageNumber: 1,
          pageSize: 20
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result.data) {
          setCustomerTokens(data.result.data);
          setShowTokenModal(true);
        } else {
          setMessage("No tokens found for this customer");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      setMessage("Error fetching customer tokens: " + error.message);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle recharge form changes
  const handleRechargeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRechargeData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };
  

  // Generate token for a customer
  const generateToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("http://47.107.69.132:9400/API/Token/CreditToken/Generate", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rechargeData,
          amount: Number(rechargeData.amount),
          isPreview: false
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          setGeneratedToken(data.result);
          setMessage("Token generated successfully!");
          
          // Refresh customer accounts to update balances
          fetchCustomerAccounts(authToken);
        } else {
          throw new Error(data.message || "Token generation failed");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      setMessage("Error generating token: " + error.message);
      console.error("Token generation error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Open recharge modal for a customer
  const openRechargeModal = (customer) => {
    setRechargeData({
      meterId: customer.meterNo || customer.meterId || "",
      amount: "",
      authorizationPassword: "",
      serialNumber: "",
      company: "Noretek Energy",
      isVendByTotalPaid: true
    });
    setGeneratedToken(null);
    setMessage("");
    setSelectedCustomer(customer);
    setShowRechargeModal(true);
  };

  // Print receipt
  const printReceipt = () => {
    const printContent = receiptRef.current;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Token Receipt</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              background-color: #fff;
            }
            .receipt { 
              border: 1px solid #000; 
              padding: 20px; 
              max-width: 400px;
              margin: 0 auto;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .receipt-title {
              font-size: 18px;
              margin-bottom: 10px;
            }
            .divider { 
              border-top: 1px dashed #000; 
              margin: 15px 0; 
            }
            .receipt-item { 
              display: flex; 
              justify-content: space-between; 
              margin: 8px 0; 
            }
            .token-display {
              font-family: 'Courier New', monospace;
              font-size: 18px;
              font-weight: bold;
              letter-spacing: 2px;
              text-align: center;
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
              border: 1px dashed #ccc;
            }
            .footer { 
              text-align: center; 
              margin-top: 20px; 
              font-size: 12px; 
              border-top: 1px solid #000;
              padding-top: 10px;
            }
            @media print {
              body { margin: 0; }
              .receipt { border: none; padding: 15px; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setAuthToken("");
    setIsAuthenticated(false);
    setCustomers([]);
    setCustomerTokens([]);
    setMessage("You have been logged out");
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Format token for display
  const formatToken = (token) => {
    if (!token) return 'N/A';
    return token.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="container-fluid " style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark primaryColor mb-4">
        <div className="container">
          <span className="navbar-brand fw-bold">
            <i className="fas fa-bolt me-2"></i>Noretek Energy Token Manager
          </span>
          {isAuthenticated && (
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-1"></i> Logout
            </button>
          )}
        </div>
      </nav>

      <div className="container">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-12">
            <h1 className="display-5 fw-bold text-dark">Customer Token Management</h1>
            <p className="lead">View and manage tokens for registered customer accounts</p>
          </div>
        </div>

        {/* Login Form (shown when not authenticated) */}
        {!isAuthenticated && (
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-header primaryColor text-center">
                  <h4>Login to Access System</h4>
                </div>
                <div className="card-body">
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label className="form-label">User ID:</label>
                      <input
                        type="text"
                        className="form-control shadow-none"
                        name="userId"
                        value={loginData.userId}
                        onChange={handleLoginChange}
                        required
                        placeholder="Enter your user ID"
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
                        placeholder="Enter your password"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Company:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="company"
                        value={loginData.company}
                        onChange={handleLoginChange}
                        required
                        readOnly
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn primaryColor w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Accounts (shown when authenticated) */}
        {isAuthenticated && (
          <>
            {/* Stats Cards */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="card stats-card text-center">
                  <i className="fas fa-users fa-2x titleColor mb-2"></i>
                  <div className="stats-number">{customers.length}</div>
                  <div className="stats-label">Registered Customers</div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card stats-card text-center">
                  <i className="fas fa-bolt fa-2x text-success mb-2"></i>
                  <div className="stats-number">
                    {customers.filter(customer => customer.balance > 0).length}
                  </div>
                  <div className="stats-label">Active Accounts</div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card stats-card text-center">
                  <i className="fas fa-dollar-sign fa-2x text-warning mb-2"></i>
                  <div className="stats-number">
                    ${customers.reduce((acc, customer) => acc + (customer.balance || 0), 0).toFixed(2)}
                  </div>
                  <div className="stats-label">Total Amount Consumed</div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card stats-card text-center">
                  <i className="fas fa-history fa-2x text-info mb-2"></i>
                  <div className="stats-number">
                    {customers.filter(customer => !customer.balance || customer.balance <= 0).length}
                  </div>
                  <div className="stats-label">Inactive Accounts</div>
                </div>
              </div>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"} mb-4`}>
                {message}
              </div>
            )}

            {/* Customer Accounts Table */}
            <div className="card shadow">
              <div className="card-header primaryColor d-flex justify-content-between align-items-center">
                <h5 className="mb-0"><i className="fas fa-list-alt me-2"></i>Registered Customer Accounts</h5>
                <button 
                  className="btn btn-outline-light btn-sm" 
                  onClick={() => fetchCustomerAccounts(authToken)}
                  disabled={loading}
                >
                  <i className="fas fa-sync-alt me-1"></i> Refresh
                </button>
              </div>
              <div className="card-body">
                {loading && !showTokenModal && !showRechargeModal ? (
                  <div className="text-center my-5">
                    <div className="spinner-border titleColor" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading customer accounts...</p>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th className="titleColor">Customer Name</th>
                            <th className="titleColor">Meter Number</th>
                            <th className="titleColor">Account Number</th>
                            <th className="titleColor">Balance</th>
                            <th className="titleColor">Status</th>
                            <th className="titleColor">Last Update</th>
                            <th className="titleColor">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customers.length > 0 ? (
                            customers.map((customer, index) => (
                              <tr key={`customer-${customer.id || customer.accountNo || index}`}>
                                <td className="fw-bold">{customer.customerName || customer.name || 'N/A'}</td>
                                <td>{customer.meterNo || customer.meterId || 'N/A'}</td>
                                <td>{customer.accountNo || 'N/A'}</td>
                                <td>${customer.balance?.toFixed(2) || '0.00'}</td>
                                <td>
                                  <span className={`badge ${(customer.balance > 0) ? 'bg-success' : 'bg-warning'}`}>
                                    {(customer.balance > 0) ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td>{formatDate(customer.updateTime || customer.lastUpdate)}</td>
                                <td>
                                  <div className="btn-group">
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={() => fetchCustomerTokens(customer.id, customer.meterNo || customer.meterId, customer)}
                                      title="View Tokens"
                                      disabled={loading}
                                    >
                                      <i className="fas fa-key me-1"></i> Tokens
                                    </button>
                                    <button
                                      className="btn btn-success btn-sm"
                                      onClick={() => openRechargeModal(customer)}
                                      title="Recharge"
                                      disabled={loading}
                                    >
                                      <i className="fas fa-bolt me-1"></i> Recharge
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="text-center py-4">
                                No customer accounts found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* Token Modal */}
        {showTokenModal && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className="fas fa-key me-2"></i>
                    Token History for {selectedCustomer?.customerName || selectedCustomer?.name || 'Customer'}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowTokenModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {loading ? (
                    <div className="text-center my-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2">Loading tokens...</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Token Value</th>
                            <th>Amount</th>
                            <th>Units</th>
                            <th>Generated On</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customerTokens.length > 0 ? (
                            customerTokens.map((token, index) => (
                              <tr key={`token-${token.id || index}`}>
                                <td className="font-monospace">{formatToken(token.token)}</td>
                                <td>${token.totalPaid?.toFixed(2) || '0.00'}</td>
                                <td>{token.totalUnit || '0'} kWh</td>
                                <td>{formatDate(token.createDate)}</td>
                                <td>
                                  <span className="badge bg-success">
                                    {token.status || 'Completed'}
                                  </span>
                                </td>
                                <td>
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={() => {
                                      setGeneratedToken(token);
                                      setTimeout(printReceipt, 100);
                                    }}
                                  >
                                    <i className="fas fa-print me-1"></i> Print
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center py-4">
                                No tokens found for this customer.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowTokenModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recharge Modal */}
        {showRechargeModal && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    <i className="fas fa-bolt me-2"></i>
                    Recharge Meter: {rechargeData.meterId}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close btn-close-white" 
                    onClick={() => setShowRechargeModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={generateToken}>
                    <div className="mb-3">
                      <label className="form-label">Amount (USD)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={rechargeData.amount}
                        onChange={handleRechargeChange}
                        required
                        step="0.01"
                        min="0"
                        placeholder="Enter amount"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Authorization Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="authorizationPassword"
                        value={rechargeData.authorizationPassword}
                        onChange={handleRechargeChange}
                        placeholder="Optional authorization password"
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Serial Number</label>
                      <input
                        type="text"
                        className="form-control"
                        name="serialNumber"
                        value={rechargeData.serialNumber}
                        onChange={handleRechargeChange}
                        placeholder="Optional serial number"
                      />
                    </div>
                    
                    <div className="mb-3 form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isVendByTotalPaid"
                        checked={rechargeData.isVendByTotalPaid}
                        onChange={handleRechargeChange}
                        id="isVendByTotalPaid"
                      />
                      <label className="form-check-label" htmlFor="isVendByTotalPaid">
                        Vend by Total Paid
                      </label>
                    </div>
                    
                    <button 
                      type="submit"
                      className="btn btn-success w-100 py-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Generating Token...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-bolt me-2"></i>Generate Token
                        </>
                      )}
                    </button>
                  </form>

                  {generatedToken && (
                    <div className="mt-4 p-3 bg-light rounded">
                      <h6>Generated Token</h6>
                      <div className="token-display font-monospace text-center p-2 mb-3">
                        {formatToken(generatedToken.token)}
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <strong>Amount:</strong> ${generatedToken.totalPaid?.toFixed(2) || '0.00'}
                        </div>
                        <div className="col-md-6">
                          <strong>Units:</strong> {generatedToken.totalUnit || '0'} kWh
                        </div>
                      </div>
                      <div className="text-center mt-3">
                        <button className="btn btn-primary me-2" onClick={printReceipt}>
                          <i className="fas fa-print me-1"></i> Print Receipt
                        </button>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => setShowRechargeModal(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Template (Hidden) */}
        <div ref={receiptRef} style={{ display: 'none' }}>
          <div className="receipt">
            <div className="header">
              <div className="company-name">Noretek Energy</div>
              <div className="receipt-title">ELECTRICITY TOKEN RECEIPT</div>
              <div>47.107.69.132:9400</div>
            </div>
            
            <div className="receipt-item">
              <span>Customer Name:</span>
              <span>{selectedCustomer?.customerName || selectedCustomer?.name || 'N/A'}</span>
            </div>
            
            <div className="receipt-item">
              <span>Meter Number:</span>
              <span>{selectedCustomer?.meterNo || selectedCustomer?.meterId || 'N/A'}</span>
            </div>
            
            <div className="receipt-item">
              <span>Account Number:</span>
              <span>{selectedCustomer?.accountNo || 'N/A'}</span>
            </div>
            
            <div className="divider"></div>
            
            {generatedToken && (
              <>
                <div className="receipt-item">
                  <span>Token:</span>
                  <span className="font-monospace">{formatToken(generatedToken.token)}</span>
                </div>
                
                <div className="receipt-item">
                  <span>Amount Paid:</span>
                  <span>${generatedToken.totalPaid?.toFixed(2) || '0.00'}</span>
                </div>
                
                <div className="receipt-item">
                  <span>Units:</span>
                  <span>{generatedToken.totalUnit || '0'} kWh</span>
                </div>
                
                {generatedToken.tax && (
                  <div className="receipt-item">
                    <span>Tax:</span>
                    <span>${generatedToken.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                )}
                
                <div className="divider"></div>
              </>
            )}
            
            <div className="receipt-item">
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="receipt-item">
              <span>Time:</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            
            <div className="footer">
              <div>Thank you for your purchase!</div>
              <div>For assistance, contact support@noretekenergy.com</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-dark text-white py-4 mt-5">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h5>Noretek Energy</h5>
                <p>Token Management System</p>
              </div>
              <div className="col-md-6 text-md-end">
                <p>Contact: support@noretekenergy.com</p>
               
              </div>
            </div>
            <hr />
            <div className="text-center">
              <p className="mb-0">© 2025 Noretek Energy. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Add Font Awesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <style jsx>{`
        .stats-card {
          text-align: center;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .stats-card:hover {
          transform: translateY(-5px);
        }
        
        .stats-number {
          font-size: 2rem;
          font-weight: 700;
          margin: 10px 0;
        }
        
        .stats-label {
          font-size: 0.9rem;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .table th {
          background-color: #f8f9fa;
          border-top: none;
          font-weight: 600;
        }
        
        .badge {
          font-size: 0.8rem;
          padding: 0.4em 0.6em;
        }
        
        .font-monospace {
          font-family: 'Courier New', monospace;
          letter-spacing: 1px;
        }
        
        .token-display {
          font-family: 'Courier New', monospace;
          font-size: 1.2rem;
          font-weight: bold;
          background: linear-gradient(120deg, #f6d365, #fda085);
          color: #fff;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
}