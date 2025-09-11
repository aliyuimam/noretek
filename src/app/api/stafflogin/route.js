import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import Staff from "@/models/Staff";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email & password required" },
        { status: 400 }
      );
    }

    const staff = await Staff.findOne({ email });

    // Check if user exists
    if (!staff) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { staffId: staff._id.toString(), role: staff.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: staff._id.toString(),
        name: staff.name,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
