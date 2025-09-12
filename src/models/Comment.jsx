import mongoose from "mongoose";

const SupportCommentSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SupportTicket", // Reference to SupportTicket collection
      required: true,
    },

    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // Reference to Customer collection
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },

    created_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

export default mongoose.models.SupportComment ||
  mongoose.model("SupportComment", SupportCommentSchema);
