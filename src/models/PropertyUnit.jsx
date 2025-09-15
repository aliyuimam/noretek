// src/models/PropertyUnit.js
import mongoose from "mongoose";

const PropertyUnitSchema = new mongoose.Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    unit_description: { type: String, required: true, trim: true },
    blockno: { type: String, required: true, trim: true },
    meter_id: { type: String, default: "" }, // will enforce uniqueness below
    captured_by: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

// 🔐 Prevent duplicate block in the same property
PropertyUnitSchema.index(
  { property_id: 1, blockno: 1 },
  { unique: true, partialFilterExpression: { blockno: { $exists: true, $ne: null } } }
);

// 🔐 Prevent duplicate unit inside the same block of a property
PropertyUnitSchema.index(
  { property_id: 1, blockno: 1, unit_description: 1 },
  { unique: true, partialFilterExpression: { unit_description: { $exists: true, $ne: null } } }
);

// 🔐 Ensure each meter_id is unique globally (but allow empty values)
PropertyUnitSchema.index(
  { meter_id: 1 },
  { unique: true, partialFilterExpression: { meter_id: { $type: "string", $ne: "" } } }
);

export default mongoose.models.PropertyUnit ||
  mongoose.model("PropertyUnit", PropertyUnitSchema);
