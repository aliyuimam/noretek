import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    owner_name: { type: String, required: true },
    owner_gsm: { type: String, required: true },
    property_name: { type: String, required: true, unique: true },
    property_location: { type: String, required: true },
    property_address: { type: String, required: true },
    captured_by: { type: String, required: true },
    date_captured: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Property ||
  mongoose.model("Property", PropertySchema);
