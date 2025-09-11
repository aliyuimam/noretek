// app/api/property/route.js
import connectDB from "@/lib/mongodb";
import Property from "@/models/Property";
import { NextResponse } from "next/server";

// GET all properties
export async function GET() {
  try {
    await connectDB();
    const properties = await Property.find().sort({ createdAt: -1 });
    return NextResponse.json(properties, { status: 200 });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST new property
export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    const {
      owner_name,
      owner_gsm,
      property_name,
      property_location,
      property_address,
      captured_by,
      date_captured,
    } = data;

    if (
      !owner_name ||
      !owner_gsm ||
      !property_name ||
      !property_location ||
      !property_address ||
      !captured_by ||
      !date_captured
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existing = await Property.findOne({ property_name });
    if (existing) {
      return NextResponse.json(
        { message: "Property name already exists" },
        { status: 409 }
      );
    }

    await Property.create(data);

    return NextResponse.json(
      { message: "Property added successfully" },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT update property
export async function PUT(req) {
  try {
    await connectDB();
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "Property ID is required" },
        { status: 400 }
      );
    }

    const updated = await Property.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updated) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Property updated successfully", property: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE property
export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { message: "Property ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Property.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Property deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
