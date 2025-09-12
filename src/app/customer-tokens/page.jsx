"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "@/contexts/SessionContext";
import { useRouter } from "next/navigation";

export default function CustomerTokensPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const receiptRef = useRef();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [meterInfo, setMeterInfo] = useState(null);
  const [tokenHistory, setTokenHistory] = useState([]);
  const [generatedToken, setGeneratedToken] = useState(null);

  const [rechargeData, setRechargeData] = useState({
    amount: "",
    authorizationPassword: "",
    serialNumber: "",
    company: "Noretek Energy",
    isVendByTotalPaid: true
  });

  // Fetch meter info and token history when user is authenticated
  useEffect(() => {
    if (status === "authenticated" && session?.user?.meterId) {
      fetchMeterInfo();
      fetchTokenHistory();
    }
  }, [status, session]);

  const fetchMeterInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/meter-info?meterId=${session.user.meterId}`);
      
      if (response.ok) {
        const data = await response.json();
        setMeterInfo(data);
      } else {
        setError("Failed to fetch meter information");
      }
    } catch (error) {
      setError("Error fetching meter information");
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenHistory = async () => {
    try {
      const response = await fetch(`/api/token-history?meterId=${session.user.meterId}`);
      
      if (response.ok) {
        const data = await response.json();
        setTokenHistory(data.history || []);
      }
    } catch (error) {
      console.error("Error fetching token history:", error);
    }
  };

  const handleRechargeChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRechargeData(prev => ({ 
      ...prev, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  const generateToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/generate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...rechargeData,
          meterId: session.user.meterId,
          amount: Number(rechargeData.amount),
          userId: session.user.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGeneratedToken(data.token);
          setSuccess("Token generated successfully!");
          fetchTokenHistory(); // Refresh history
        } else {
          setError(data.message || "Token generation failed");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Token generation failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = () => {
    const printContent = receiptRef.current;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Token Receipt - ${generatedToken.reference}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .receipt { border: 1px solid #000; padding: 20px; max-width: 400px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .company-name { font-size: 24px; font-weight: bold; }
            .token-display { font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; 
                            text-align: center; background: #f0f0f0; padding: 15px; margin: 15px 0; 
                            border: 1px dashed #ccc; letter-spacing: 2px; }
            .divider { border-top: 1px dashed #000; margin: 15px 0; }
            .receipt-item { display: flex; justify-content: space-between; margin: 8px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; border-top: 1px solid #000; padding-top: 10px; }
            @media print { body { margin: 0; } .receipt { border: none; padding: 15px; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  if (status === "loading") {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/customer-signin");
    return null;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="h4 mb-0">
                <i className="fas fa-bolt me-2"></i>
                Electricity Token Generation
              </h2>
            </div>
            <div className="card-body">
              {/* Meter Information */}
              {meterInfo && (
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title">Meter Information</h5>
                        <p><strong>Meter ID:</strong> {meterInfo.meterId}</p>
                        <p><strong>Customer:</strong> {meterInfo.customerName}</p>
                        <p><strong>Property:</strong> {meterInfo.propertyName}</p>
                        <p><strong>Unit:</strong> {meterInfo.unitDescription}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title">Account Status</h5>
                        <p><strong>Balance:</strong> ₦{meterInfo.balance?.toFixed(2) || '0.00'}</p>
                        <p><strong>Status:</strong> 
                          <span className={`badge ${meterInfo.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                            {meterInfo.status || 'Unknown'}
                          </span>
                        </p>
                        <p><strong>Last Token:</strong> {meterInfo.lastTokenDate || 'Never'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error/Success Messages */}
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              {/* Token Generation Form */}
              <div className="card mb-4">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">Generate New Token</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={generateToken}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Amount (₦)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="amount"
                          value={rechargeData.amount}
                          onChange={handleRechargeChange}
                          required
                          min="100"
                          step="100"
                          placeholder="Enter amount"
                        />
                        <div className="form-text">Minimum amount: ₦100</div>
                      </div>
                      
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Authorization Password (Optional)</label>
                        <input
                          type="password"
                          className="form-control"
                          name="authorizationPassword"
                          value={rechargeData.authorizationPassword}
                          onChange={handleRechargeChange}
                          placeholder="Enter authorization password"
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Serial Number (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="serialNumber"
                        value={rechargeData.serialNumber}
                        onChange={handleRechargeChange}
                        placeholder="Enter serial number"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-success w-100 py-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Generating Token...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-bolt me-2"></i>
                          Generate Token
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Generated Token Display */}
              {generatedToken && (
                <div className="card mb-4 border-success">
                  <div className="card-header bg-success text-white">
                    <h5 className="mb-0">Generated Token</h5>
                  </div>
                  <div className="card-body text-center">
                    <div className="token-display mb-3">
                      {generatedToken.token}
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <strong>Amount:</strong> ₦{generatedToken.amount}
                      </div>
                      <div className="col-md-6">
                        <strong>Units:</strong> {generatedToken.units} kWh
                      </div>
                    </div>
                    <button className="btn btn-primary me-2" onClick={printReceipt}>
                      <i className="fas fa-print me-1"></i> Print Receipt
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedToken.token);
                        alert('Token copied to clipboard!');
                      }}
                    >
                      <i className="fas fa-copy me-1"></i> Copy Token
                    </button>
                  </div>
                </div>
              )}

              {/* Token History */}
              <div className="card">
                <div className="card-header bg-dark text-white">
                  <h5 className="mb-0">Token History</h5>
                </div>
                <div className="card-body">
                  {tokenHistory.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Token</th>
                            <th>Amount</th>
                            <th>Units</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tokenHistory.map((token, index) => (
                            <tr key={index}>
                              <td>{new Date(token.date).toLocaleDateString()}</td>
                              <td className="font-monospace">{token.token}</td>
                              <td>₦{token.amount}</td>
                              <td>{token.units} kWh</td>
                              <td>
                                <span className="badge bg-success">Used</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-muted">No token history found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden receipt template for printing */}
      <div ref={receiptRef} style={{ display: 'none' }}>
        <div className="receipt">
          <div className="header">
            <div className="company-name">Noretek Energy</div>
            <div>Electricity Token Receipt</div>
          </div>
          
          {generatedToken && (
            <>
              <div className="receipt-item">
                <span>Customer:</span>
                <span>{session.user.name}</span>
              </div>
              <div className="receipt-item">
                <span>Meter ID:</span>
                <span>{session.user.meterId}</span>
              </div>
              <div className="divider"></div>
              <div className="token-display">{generatedToken.token}</div>
              <div className="divider"></div>
              <div className="receipt-item">
                <span>Amount:</span>
                <span>₦{generatedToken.amount}</span>
              </div>
              <div className="receipt-item">
                <span>Units:</span>
                <span>{generatedToken.units} kWh</span>
              </div>
              <div className="receipt-item">
                <span>Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="receipt-item">
                <span>Time:</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </>
          )}
          <div className="footer">
            <div>Thank you for your purchase!</div>
            <div>For assistance: support@noretekenergy.com</div>
          </div>
        </div>
      </div>

      {/* Add Font Awesome */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
    </div>
  );
}