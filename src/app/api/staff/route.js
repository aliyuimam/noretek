import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb"; // matches your file
import Staff from "@/models/Staff";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

function safeStaffObject(doc) {
  if (!doc) return doc;
  // doc may be a Mongoose doc or plain object
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj.password;
  return obj;
}

// CREATE Staff (Signup)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, phone, address, password, confirmPassword, role } = body;

    // Basic validation
    if (!name || !email || !phone || !address || !password || !confirmPassword || !role) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, message: "Passwords do not match" }, { status: 400 });
    }

    // Check if email is already used
    const existing = await Staff.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, message: "Email already registered" }, { status: 400 });
    }

    // Create staff (password will be hashed by your model pre-save hook)
    const staff = await Staff.create({
      name,
      email,
      phone,
      address,
      password,
      role,
      isBlocked: false,
    });

    // Generate token (optional)
    const token = jwt.sign({ id: staff._id, email: staff.email, role: staff.role }, JWT_SECRET, { expiresIn: "7d" });

    // Return staff without password
    return NextResponse.json(
      { success: true, message: "Staff created successfully", staff: safeStaffObject(staff), token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Staff POST error:", error);
    // Return error message for development debugging (safe: not exposing secrets)
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}

// GET All Staff
export async function GET() {
  try {
    await connectDB();
    const staffList = await Staff.find().lean();
    const safeList = staffList.map((s) => {
      const { password, ...rest } = s;
      return rest;
    });
    return NextResponse.json({ success: true, staff: safeList });
  } catch (error) {
    console.error("Staff GET error:", error);
    return NextResponse.json({ success: false, message: error.message || "Error fetching staff" }, { status: 500 });
  }
}

// UPDATE Staff (PUT)
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, name, email, phone, address, role } = body;

    const updated = await Staff.findByIdAndUpdate(id, { name, email, phone, address, role }, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Staff not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Staff updated", staff: safeStaffObject(updated) });
  } catch (error) {
    console.error("Staff PUT error:", error);
    return NextResponse.json({ success: false, message: error.message || "Error updating staff" }, { status: 500 });
  }
}

// PATCH → Block/Unblock staff
export async function PATCH(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, block } = body;
    const updated = await Staff.findByIdAndUpdate(id, { isBlocked: block }, { new: true });
    if (!updated) {
      return NextResponse.json({ success: false, message: "Staff not found" }, { status: 404 });
    }
    const statusMsg = block ? "Staff blocked" : "Staff unblocked";
    return NextResponse.json({ success: true, message: statusMsg, staff: safeStaffObject(updated) });
  } catch (error) {
    console.error("Staff PATCH error:", error);
    return NextResponse.json({ success: false, message: error.message || "Error blocking/unblocking staff" }, { status: 500 });
  }
}

// DELETE → Remove staff by ID
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const deleted = await Staff.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Staff not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Staff deleted" });
  } catch (error) {
    console.error("Staff DELETE error:", error);
    return NextResponse.json({ success: false, message: error.message || "Error deleting staff" }, { status: 500 });
  }
}
