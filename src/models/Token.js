// models/Token.js
import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      trim: true,
    },
    meterNumber: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    units: {
      type: Number,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    customerName: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomerTable',
    },
    status: {
      type: String,
      enum: ["generated", "used", "expired"],
      default: "generated",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
TokenSchema.index({ reference: 1 }, { unique: true });
TokenSchema.index({ customerEmail: 1 });
TokenSchema.index({ meterNumber: 1 });
TokenSchema.index({ status: 1 });
TokenSchema.index({ expiresAt: 1 });

export default mongoose.models.Token || mongoose.model("Token", TokenSchema);