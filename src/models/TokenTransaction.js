// src/models/TokenTransaction.js
import mongoose from "mongoose";

const TokenTransactionSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true, required: true }, // Paystack ref
    meterNumber: { type: String, required: true },
    customerEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    token: { type: String }, // electricity token
    units: { type: Number }, // kWh or similar
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.TokenTransaction ||
  mongoose.model("TokenTransaction", TokenTransactionSchema);
