import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const StaffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Enrollment Officer", "Support Officer"],
      required: true,
      // unique: true, // ❌ only leave if you truly want one person per role
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔐 Hash password before saving if modified or new
StaffSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Add a helper method to check password later
StaffSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Staff || mongoose.model("Staff", StaffSchema);
