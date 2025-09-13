// src/app/customer_payment_dashboard/page.jsx
"use client";
import PaymentForm from "@/MainComponent/PaymentForm";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Create a separate component that uses useSearchParams
function CustomerPaymentDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [viewingToken, setViewingToken] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [tokenHistory, setTokenHistory] = useState([]);
  const [meterInfo, setMeterInfo] = useState(null);
  const [tariffInfo, setTariffInfo] = useState(null);
  const [meterId, setMeterId] = useState(null); // ✅ NEW

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (typeof window === "undefined") {
          setLoading(false);
          return;
        }

        // ✅ Get email from URL parameters or localStorage
        const urlEmail = searchParams?.get("email");
        const storedEmail = localStorage.getItem("userEmail");
        const storedId = localStorage.getItem("userId");
        const userEmail = urlEmail || storedEmail;

        if (!userEmail) {
          window.location.href = "/customer-signin";
          return;
        }

        setUser({ email: userEmail, id: storedId });

        // ✅ Fetch profile to get userId & meterId
        const profileRes = await fetch(
          `/api/user/profile?email=${encodeURIComponent(userEmail)}`
        );
        const profileData = await profileRes.json();
        if (profileData.success && profileData.user) {
          if (!storedId) {
            localStorage.setItem("userId", profileData.user.id);
            setUser({ email: profileData.user.email, id: profileData.user.id });
          }
          if (profileData.user.meterId) {
            setMeterId(profileData.user.meterId); // ✅ fix
            setMeterInfo({
              customerName: profileData.user.name,
              meterNumber: profileData.user.meterId,
              status: "active",
            });
          }
        }

        // Fetch payments
        await refreshPayments(userEmail);

        // Fetch token history
        await fetchTokenHistory(userEmail);

        // Payment verification
        const reference =
          searchParams?.get("reference") || searchParams?.get("trxref");
        const paymentSuccess = searchParams?.get("payment_success");

        if (reference && !paymentSuccess) {
          console.log(
            "🔄 Payment verification needed for reference:",
            reference
          );
          verifyPayment(reference, userEmail);
        } else if (paymentSuccess === "true") {
          const token = localStorage.getItem("lastToken");
          const meter = localStorage.getItem("lastMeter");
          const units = localStorage.getItem("lastUnits");

          if (token && meter) {
            setGeneratedToken({
              token,
              meterNumber: meter,
              units: units || "0",
              reference: searchParams?.get("ref") || "",
              amount: localStorage.getItem("lastAmount") || "0",
            });
            setShowSuccessModal(true);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const verifyPayment = async (reference, userEmail) => {
      setVerifyingPayment(true);
      try {
        console.log("🔍 Verifying payment with reference:", reference);

        const response = await fetch(
          `/api/payments/verify?reference=${reference}`
        );
        const data = await response.json();

        console.log("📦 Verification API response:", data);

        if (data.status && data.data.status === "success") {
          console.log("💰 Payment successful, generating token...");

          const meterNumber =
            data.data.metadata?.meterNumber ||
            localStorage.getItem("meterNumber");
          const amount = data.data.amount / 100;

          if (!meterNumber) {
            throw new Error("Meter number not found for token generation");
          }

          // Generate token
          try {
            const tokenData = await generateVendToken(
              meterNumber,
              amount,
              reference
            );

            const tokenInfo = {
              token: tokenData.token,
              meterNumber: meterNumber,
              units: tokenData.units || "0",
              amount: amount,
              reference: reference,
              customerName: userEmail,
              timestamp: new Date().toISOString(),
            };

            setGeneratedToken(tokenInfo);

            localStorage.setItem("lastToken", tokenData.token);
            localStorage.setItem("lastMeter", meterNumber);
            localStorage.setItem("lastUnits", tokenData.units || "0");
            localStorage.setItem("lastAmount", amount.toString());

            await saveTokenToDatabase(tokenInfo);
            setShowSuccessModal(true);

            // Clean URL
            const newUrl = new URL(window.location);
            newUrl.searchParams.delete("reference");
            newUrl.searchParams.delete("trxref");
            newUrl.searchParams.set("payment_success", "true");
            window.history.replaceState({}, "", newUrl);
          } catch (vendError) {
            console.error("Vend token generation failed:", vendError);
            setGeneratedToken({
              token: generateNumericToken(),
              meterNumber: meterNumber,
              units: calculateUnits(amount, 55),
              amount: amount,
              reference: reference,
              customerName: userEmail,
              status: "pending",
            });
            setShowSuccessModal(true);
            setError("Payment successful! Token generation is in progress.");
          }

          await refreshPayments(userEmail);
          await fetchTokenHistory(userEmail);
        } else {
          setError(
            data.message ||
              `Payment failed. Status: ${data.data?.status || "unknown"}`
          );
        }
      } catch (error) {
        console.error("💥 Payment verification error:", error);
        setError("Payment verification failed. Please try again.");
      } finally {
        setVerifyingPayment(false);
      }
    };

    const generateVendToken = async (meterNumber, amount, reference) => {
      try {
        const vendResponse = await fetch(
          "http://47.107.69.132:9400/API/Token/CreditToken/Generate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              meterId: meterNumber,
              amount: amount,
              authorizationPassword: "Ntk0001@#",
              serialNumber: reference,
              company: "Noretek Energy",
              isVendByTotalPaid: true,
              isPreview: false,
            }),
          }
        );

        if (vendResponse.ok) {
          const vendData = await vendResponse.json();
          if (vendData.result && vendData.result.token) {
            return {
              token: vendData.result.token,
              units: vendData.result.totalUnit,
            };
          }
        }

        const vendResponse2 = await fetch(
          "http://47.107.69.132:9400/API/Token/CreditToken/GenerateS2",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              meterId: meterNumber,
              amount: amount,
              authorizationPassword: "Ntk0001@#",
              serialNumber: reference,
              company: "Noretek Energy",
              isVendByTotalPaid: true,
              isPreview: false,
            }),
          }
        );

        if (vendResponse2.ok) {
          const vendData2 = await vendResponse2.json();
          if (vendData2.result && vendData2.result.token) {
            return {
              token: vendData2.result.token,
              units: vendData2.result.totalUnit,
            };
          }
        }

        throw new Error("Both vend API endpoints failed");
      } catch (error) {
        console.error("Vend API error:", error);
        throw error;
      }
    };

    const generateNumericToken = () => {
      let token = "";
      for (let i = 0; i < 20; i++) token += Math.floor(Math.random() * 10);
      return token;
    };

    const calculateUnits = (amount, tariffRate) => (amount / tariffRate).toFixed(2);

    const saveTokenToDatabase = async (tokenInfo) => {
      try {
        const response = await fetch("/api/tokens/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tokenInfo),
        });
        if (!response.ok) console.error("Failed to save token");
      } catch (error) {
        console.error("Error saving token:", error);
      }
    };

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
        console.error("Error refreshing payments:", error);
      }
    };

    const fetchTokenHistory = async (email) => {
      try {
        const response = await fetch(
          `/api/tokens/history?email=${encodeURIComponent(email)}`
        );
        if (response.ok) {
          const data = await response.json();
          setTokenHistory(data.tokens || []);
        }
      } catch (error) {
        console.error("Error fetching token history:", error);
      }
    };

    fetchData();
  }, [searchParams]);

  const formatToken = (token) => {
    if (!token) return "N/A";
    const numericToken = token.replace(/\D/g, "").substring(0, 20);
    const paddedToken = numericToken.padEnd(20, "0");
    return paddedToken.replace(
      /(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})/,
      "$1 $2 $3 $4 $5"
    );
  };

  if (loading || verifyingPayment) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">
          {verifyingPayment
            ? "Processing your payment and generating token..."
            : "Loading your dashboard..."}
        </p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Success Modal with Receipt */}
      {showSuccessModal && generatedToken && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="fas fa-check-circle me-2"></i>
                  Payment Successful!
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowSuccessModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="receipt p-4 border rounded">
                  <div className="text-center mb-4">
                    <h3 className="text-primary fw-bold">Noretek Energy</h3>
                    <h5 className="text-dark">ELECTRICITY TOKEN RECEIPT</h5>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p>
                        <strong>Customer:</strong>{" "}
                        {meterInfo?.customerName ||
                          generatedToken.customerName ||
                          user?.email}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Meter Number:</strong>{" "}
                        {generatedToken.meterNumber}
                      </p>
                    </div>
                  </div>
                  <div className="bg-dark text-light p-4 rounded text-center mb-4">
                    <h6 className="mb-2 text-warning">YOUR ELECTRICITY TOKEN</h6>
                    <h2 className="display-5 font-monospace text-white mb-0">
                      {formatToken(generatedToken.token)}
                    </h2>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p>
                        <strong>Amount Paid:</strong> ₦{generatedToken.amount}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Units Purchased:</strong> {generatedToken.units}{" "}
                        kWh
                      </p>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p>
                        <strong>Tariff Rate:</strong> ₦
                        {tariffInfo?.rate || 55} per kWh
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Reference:</strong> {generatedToken.reference}
                      </p>
                    </div>
                  </div>
                  <div className="alert alert-info mt-4">
                    <h6 className="mb-2">How to use your token:</h6>
                    <ol className="mb-0 small">
                      <li>Press the 'Enter' button on your meter</li>
                      <li>Enter the 20-digit token when prompted</li>
                      <li>Press 'Enter' again to confirm</li>
                      <li>
                        Wait for the meter to validate and load the units
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      generatedToken.token.replace(/\s/g, "")
                    );
                    alert("Token copied to clipboard!");
                  }}
                >
                  <i className="fas fa-copy me-2"></i>Copy Token
                </button>
                <button className="btn btn-primary" onClick={() => window.print()}>
                  <i className="fas fa-print me-2"></i>Print Receipt
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => setShowSuccessModal(false)}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Token Modal */}
      {viewingToken && generatedToken && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-info text-white">
                <h5 className="modal-title">
                  <i className="fas fa-key me-2"></i>
                  Purchased Token
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setViewingToken(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="receipt p-4 border rounded">
                  <div className="text-center mb-4">
                    <h3 className="text-primary fw-bold">Noretek Energy</h3>
                    <h5 className="text-dark">ELECTRICITY TOKEN RECEIPT</h5>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p>
                        <strong>Customer:</strong>{" "}
                        {meterInfo?.customerName ||
                          generatedToken.customerName ||
                          user?.email}
                      </p>
                      <p>
                        <strong>Reference:</strong> {generatedToken.reference}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Meter Number:</strong>{" "}
                        {generatedToken.meterNumber}
                      </p>
                      <p>
                        <strong>Purchase Date:</strong>{" "}
                        {selectedPayment?.created_at
                          ? new Date(
                              selectedPayment.created_at
                            ).toLocaleDateString()
                          : new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="bg-dark text-light p-4 rounded text-center mb-4">
                    <h6 className="mb-2 text-warning">YOUR ELECTRICITY TOKEN</h6>
                    <h2 className="display-5 font-monospace text-white mb-0">
                      {formatToken(generatedToken.token)}
                    </h2>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p>
                        <strong>Amount Paid:</strong> ₦{generatedToken.amount}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Units Purchased:</strong>{" "}
                        {generatedToken.units} kWh
                      </p>
                    </div>
                  </div>
                  <div className="alert alert-info mt-4">
                    <h6 className="mb-2">How to use your token:</h6>
                    <ol className="mb-0 small">
                      <li>Press the 'Enter' button on your meter</li>
                      <li>Enter the 20-digit token when prompted</li>
                      <li>Press 'Enter' again to confirm</li>
                      <li>
                        Wait for the meter to validate and load the units
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      generatedToken.token.replace(/\s/g, "")
                    );
                    alert("Token copied to clipboard!");
                  }}
                >
                  <i className="fas fa-copy me-2"></i>Copy Token
                </button>
                <button className="btn btn-primary" onClick={() => window.print()}>
                  <i className="fas fa-print me-2"></i>Print Receipt
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewingToken(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="row mb-4">
        <div className="col">
          <button
            className="btn btn-outline-primary mb-3"
            onClick={() => router.push("/customer_dashboard")}
          >
            <i className="fas fa-arrow-left me-2"></i>Back to Dashboard
          </button>
          <h2 className="h4 text-primary">Electricity Token Purchase</h2>
          <p className="text-muted h5">Welcome back, {user?.email}</p>
        </div>
      </div>

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show mb-4"
          role="alert"
        >
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError("")}
          ></button>
        </div>
      )}

      {/* Meter Information */}
      {meterInfo && (
        <div className="card mb-4">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">
              <i className="fas fa-info-circle me-2"></i>
              Meter Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Customer Name:</strong> {meterInfo.customerName}
                </p>
                <p>
                  <strong>Meter Number:</strong> {meterInfo.meterNumber}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Email:</strong> {meterInfo.userEmail || user?.email}
                </p>
                <p>
                  <strong>Status:</strong>
                  <span
                    className={`badge ${
                      meterInfo.status === "active"
                        ? "bg-success"
                        : "bg-warning"
                    } ms-2`}
                  >
                    {meterInfo.status}
                  </span>
                </p>
              </div>
            </div>
            {tariffInfo && (
              <div className="mt-3 p-3 bg-light rounded">
                <h6>Tariff Information</h6>
                <p className="mb-1">
                  <strong>Tariff Plan:</strong> {tariffInfo.name}
                </p>
                <p className="mb-0">
                  <strong>Rate:</strong> ₦{tariffInfo.rate} per kWh
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="row mb-5">
        <div className="col-md-6">
          {/* ✅ Always passes presetMeter */}
          <PaymentForm
            userEmail={user?.email}
            userId={user?.id}
            presetMeter={meterId}
          />
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-history me-2"></i> Payment History
              </h5>
            </div>
            <div className="card-body">
              {payments.length === 0 ? (
                <div className="alert alert-info">No payments yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-primary">
                      <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id}>
                          <td>
                            {new Date(p.created_at).toLocaleDateString()}
                          </td>
                          <td>₦{p.amount}</td>
                          <td>{p.status}</td>
                          <td>{p.reference}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Token History */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="fas fa-key me-2"></i>
                Token History
              </h5>
            </div>
            <div className="card-body">
              {tokenHistory.length === 0 ? (
                <div className="alert alert-info">
                  No token history yet. Purchase tokens to see them here!
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-info">
                      <tr>
                        <th>Date</th>
                        <th>Meter Number</th>
                        <th>Token</th>
                        <th>Units</th>
                        <th>Amount</th>
                        <th>Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tokenHistory.map((token) => (
                        <tr key={token._id || token.reference}>
                          <td>
                            {new Date(
                              token.timestamp || token.createdAt
                            ).toLocaleDateString()}
                          </td>
                          <td>{token.meterNumber}</td>
                          <td className="font-monospace small">
                            {formatToken(token.token)}
                          </td>
                          <td>{token.units} kWh</td>
                          <td>₦{token.amount}</td>
                          <td className="small text-muted">
                            {token.reference}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </div>
  );
}

// Main component with Suspense boundary
export default function CustomerPaymentDashboard() {
  return (
    <Suspense
      fallback={
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading payment dashboard...</p>
        </div>
      }
    >
      <CustomerPaymentDashboardContent />
    </Suspense>
  );
}
