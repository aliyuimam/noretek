// src/app/api/customers/[id]/route.js

import connectDB from "@/lib/mongodb";
import CustomerTable from "@/models/CustomerTable";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Customer ID not provided" }, { status: 400 });
    }

    const customer = await CustomerTable.findById(id).select("-password").lean();
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        propertyName: customer.propertyName,
        propertyUnit: customer.propertyUnit,
      },
    });
  } catch (err) {
    console.error("Error fetching customer:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
