// src/models/PropertyUnit.jsx
import mongoose from "mongoose";

const PropertyUnitSchema = new mongoose.Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    unit_description: { type: String, required: true, trim: true },
    blockno: { type: String, required: true },
    meter_id: { type: String, default: "" },
    captured_by: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

// 🔐 Prevent duplicates: property_id + unit_description must be unique
PropertyUnitSchema.index({ property_id: 1, unit_description: 1 }, { unique: true });

// ✅ Export model (avoid overwrite in Next.js)
export default mongoose.models.PropertyUnit ||
  mongoose.model("PropertyUnit", PropertyUnitSchema);
