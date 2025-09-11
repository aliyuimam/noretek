import mongoose from "mongoose";

const PropertyUnitSchema = new mongoose.Schema(
  {
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    unit_description: { type: String, required: true },
    blockno: { type: String, required: true },
    meter_id: { type: String, default: "" },
    captured_by: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.PropertyUnit ||
  mongoose.model("PropertyUnit", PropertyUnitSchema);
