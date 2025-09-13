// src/app/api/tickets/route.js
import connectDB from "@/lib/mongodb";
import SupportTicket from "@/models/supportTicket";
import { NextResponse } from "next/server";

// src/app/api/tickets/route.js
export async function GET() {
  try {
    await connectDB();
    const tickets = await SupportTicket.find().lean();
    return NextResponse.json({
      success: true,
      tickets: tickets.map((t) => ({
        _id: t._id.toString(),
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority,
        status: t.status,
        created_by: t.created_by,
        meter_id: t.meter_id,
        createdAt: t.created_at,   // 👈 normalized camelCase
        updatedAt: t.updated_at,
        closedAt: t.closed_at,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


// ✅ POST (create ticket)
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, created_by, meter_id, ...cleanBody } = body;

    // Always ensure created_by and meter_id are set
    const ticket = await SupportTicket.create({
      ...cleanBody,
      created_by: created_by || "anonymous",
      meter_id: meter_id || "Not assigned",
    });

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ PUT (update ticket)
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    const ticket = await SupportTicket.findByIdAndUpdate(_id, updateData, { new: true });
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

    return NextResponse.json({ success: true, ticket });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ DELETE (delete ticket)
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });

    const ticket = await SupportTicket.findByIdAndDelete(id);
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

    return NextResponse.json({ success: true, message: "Ticket deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
