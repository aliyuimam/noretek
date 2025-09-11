"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    dateOfBirth: "",
    accountType: "",
    propertyType: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white text-center">
          <h4>Create User Account</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            {Object.entries(formData).map(([key, value]) => (
              <div className="col-md-6" key={key}>
                <label htmlFor={key} className="form-label text-capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={key}
                  name={key}
                  value={value}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  required={key !== "notes"}
                />
              </div>
            ))}
            <div className="col-12 text-center">
              <button type="submit" className="btn btn-success px-4">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
