// src/models/supportTicket.js
import mongoose from "mongoose";

const SupportTicketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 255 },
    description: { type: String },

    category: {
      type: String,
      enum: ["General Inquiry", "Billing Issues", "Technical Problems", "Others"],
      default: "General Inquiry",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "On Hold", "Resolved", "Closed"],
      default: "Open",
    },

    created_by: { type: String }, // store user email or id
    meter_id: { type: String },   // store assigned meter

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    closed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

export default mongoose.models.SupportTicket ||
  mongoose.model("SupportTicket", SupportTicketSchema);
