"use client";
import { useEffect, useState } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/customer-signup-api")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.customers);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Customer List</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Certifi Name</th>
              <th>Certifi No</th>
              <th>Property Name</th>
              <th>Property Unit</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u, i) => (
                <tr key={u._id}>
                  <td>{i + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.address}</td>
                  <td>{u.certifiName}</td>
                  <td>{u.certifiNo}</td>
                  <td>{u.propertyName?.name || "N/A"}</td>
                  <td>{u.propertyUnit?.unitNo || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
