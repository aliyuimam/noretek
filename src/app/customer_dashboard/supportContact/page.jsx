"use client";

import React, { useState } from "react";

export default function CustomerSupportForm() {
  const [formData, setFormData] = useState({
    sn: "",
    date: "",
    customerName: "",
    customerId: "",
    homeId: "",
    meterId: "",
    compliantType: "",
    statement: "",
    supportTicket: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Form submitted successfully!");
  };

  return (
    <section className="min-vh-100 bg-light p-3">
      <div className="container bg-white p-4 rounded shadow">
        <h2 className="mb-4 fw-bold">Customer Support Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* S/N */}
            <div className="col-12 col-lg-6">
              <label className="form-label">S/N</label>
              <input
                type="number"
                name="sn"
                className="form-control"
                value={formData.sn}
                onChange={handleChange}
                required
              />
            </div>

            {/* Date */}
            <div className="col-12 col-lg-6">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Customer Name */}
            <div className="col-12 col-lg-6">
              <label className="form-label">Customer Name</label>
              <input
                type="text"
                name="customerName"
                className="form-control"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Customer ID */}
            <div className="col-12 col-lg-6">
              <label className="form-label">Customer ID</label>
              <input
                type="text"
                name="customerId"
                className="form-control"
                value={formData.customerId}
                onChange={handleChange}
                required
              />
            </div>

            {/* Home ID */}
            <div className="col-12 col-lg-6">
              <label className="form-label">Home ID</label>
              <input
                type="text"
                name="homeId"
                className="form-control"
                value={formData.homeId}
                onChange={handleChange}
                required
              />
            </div>

            {/* Meter ID */}
            <div className="col-12 col-lg-6">
              <label className="form-label">Meter ID</label>
              <input
                type="text"
                name="meterId"
                className="form-control"
                value={formData.meterId}
                onChange={handleChange}
                required
              />
            </div>

            {/* Compliant Type */}
            <div className="col-12 col-lg-6">
              <label className="form-label">Compliant Type</label>
              <input
                type="text"
                name="compliantType"
                className="form-control"
                value={formData.compliantType}
                onChange={handleChange}
                required
              />
            </div>

             {/* Support Ticket */}
            <div className="col-12 col-lg-6">
              <label className="form-label">Support Ticket</label>
              <input
                type="text"
                name="supportTicket"
                className="form-control"
                value={formData.supportTicket}
                onChange={handleChange}
                required
              />
            </div>

            {/* Statement */}
            <div className="col-12 col-lg-12">
              <label className="form-label">Statement</label>
              <textarea
                name="statement"
                className="form-control"
                value={formData.statement}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>

           
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button type="submit" className="btn btn-primary w-100 w-lg-auto">
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
