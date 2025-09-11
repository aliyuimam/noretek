import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    name: String,
  },
  { timestamps: true }
);

const WalletSchema = new Schema(
  {
    userEmail: { type: String, index: true, required: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TxnSchema = new Schema(
  {
    userEmail: { type: String, index: true },
    reference: String,
    type: { type: String, enum: ["topup", "wallet_debit", "card_purchase"] },
    amount: Number,
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    meta: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Wallet =
  mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);
export const Txn = mongoose.models.Txn || mongoose.model("Txn", TxnSchema);
