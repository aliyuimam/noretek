// src/app/api/customers/route.js

import connectDB from "@/lib/mongodb";
import CustomerTable from "@/models/CustomerTable";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const customers = await CustomerTable.find().select("-password").lean();

    return NextResponse.json({
      success: true,
      customers: customers.map(c => ({
        _id: c._id.toString(),
        name: c.name,
        email: c.email,
        phone: c.phone,
        address: c.address,
        propertyName: c.propertyName,
        propertyUnit: c.propertyUnit,
      })),
    });
  } catch (err) {
    console.error("Error fetching customers:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
