"use client";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const res = await fetch("http://47.107.69.132:9400/API/Customer/Read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pageIndex: 0,
          pageSize: 10, // ✅ only fetch 10
          filter: {},
          sortBy: "createDateRange[0]",
          sortDirection: "desc", // ✅ most recent first
        }),
      });

      const data = await res.json();

      if (data?.data?.items) {
        setCustomers(data.data.items);
        setTotalCount(data.data.totalCount || data.data.items.length);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  }

  return (
    <div className="container my-4">
      <h2 className="mb-3">Total Customers: {totalCount}</h2>

      <div className="row">
        {customers.map((customer, idx) => (
          <div key={idx} className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{customer.customerName}</h5>
                <p className="card-text">
                  <strong>Phone:</strong> {customer.phoneNumber || "N/A"}
                </p>
                <p className="card-text">
                  <strong>Email:</strong> {customer.email || "N/A"}
                </p>
                <p className="card-text">
                  <strong>Joined:</strong>{" "}
                  {customer.createDateRange?.[0]
                    ? new Date(customer.createDateRange[0]).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
