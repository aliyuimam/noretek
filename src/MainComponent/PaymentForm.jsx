"use client";
import { useState, useEffect } from "react";

export default function PaymentForm({ userEmail, userId, presetMeter }) {
  const [amount, setAmount] = useState("");
  const [meterNumber, setMeterNumber] = useState(presetMeter || "");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [fetchingMeter, setFetchingMeter] = useState(!presetMeter);

  // Fetch user data including meter number only if preset not passed
  useEffect(() => {
    if (presetMeter) {
      setMeterNumber(presetMeter);
      setFetchingMeter(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        setFetchingMeter(true);

        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No auth token found in localStorage");
          setFetchingMeter(false);
          return;
        }

        const response = await fetch("/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          console.error("❌ Failed to fetch profile:", response.status);
          setFetchingMeter(false);
          return;
        }

        const data = await response.json();
        if (data.success && data.user) {
          setUserData(data.user);
          if (data.user.meterId) {
            setMeterNumber(data.user.meterId);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setFetchingMeter(false);
      }
    };

    fetchUserData();
  }, [userEmail, presetMeter]);

  const initializePayment = async (email, amount, meterNumber, userId = null) => {
    try {
      if (!meterNumber || meterNumber.trim() === "") {
        throw new Error("Meter number is required");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("userEmail", email);
        localStorage.setItem("meterNumber", meterNumber);
        if (userId) {
          localStorage.setItem("userId", userId);
        }
      }

      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount,
          metadata: { meterNumber: meterNumber.trim(), user_id: userId },
        }),
      });

      const data = await response.json();

      if (data.status) {
        if (typeof window !== "undefined") {
          window.location.href = data.data.authorization_url;
        }
      } else {
        throw new Error(data.message || "Payment initialization failed");
      }
    } catch (error) {
      console.error("💥 Payment initialization error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || amount < 100) {
      alert("Minimum amount is ₦100");
      return;
    }
    if (!meterNumber || meterNumber.trim() === "") {
      alert("Please enter your meter number");
      return;
    }

    setLoading(true);
    try {
      await initializePayment(userEmail, parseFloat(amount), meterNumber, userId);
    } catch (error) {
      alert("Payment failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bColor">
        <h5 className="mb-0">Purchase Meter Token</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input type="email" className="form-control" value={userEmail} disabled />
          </div>

          {/* Meter Number */}
          <div className="mb-3">
            <label className="form-label">Meter Number:</label>
            {fetchingMeter ? (
              <div className="d-flex align-items-center">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                <span>Loading your meter number...</span>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  className="form-control shadow-none"
                  value={meterNumber}
                  readOnly // 🔒 makes sure it cannot be typed/changed
                  required
                />
                {userData?.meterId && (
                  <div className="form-text text-success">
                    Your registered meter: {userData.meterId}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Amount */}
          <div className="mb-3">
            <label className="form-label">Amount (NGN):</label>
            <input
              type="number"
              className="form-control shadow-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="100"
              step="50"
              required
              placeholder="Enter amount"
            />
            <div className="form-text titleColor"></div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn bColor w-100 font-monospace"
            disabled={loading || fetchingMeter}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Processing...
              </>
            ) : (
              "Pay Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
