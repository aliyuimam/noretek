import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    certifiName: {
      type: String,
      default: "", // ✅ not required
    },
    certifiNo: {
      type: String,
      default: "", // ✅ not required
    },
    role: {
      type: String,
      enum: ["Customer"],
      required: true,
    },
    propertyName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    propertyUnit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PropertyUnit",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js hot reload
export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);
