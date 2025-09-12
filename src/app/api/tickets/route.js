// src/app/api/tickets/route.js
import connectDB from "@/lib/mongodb";
import SupportTicket from "@/models/supportTicket";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const tickets = await SupportTicket.find().lean();
    return NextResponse.json({
      success: true,
      tickets: tickets.map(t => ({
        _id: t._id.toString(),
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority,
        status: t.status,
        created_by: t.created_by,
        meter_id: t.meter_id,
        created_at: t.created_at,
        updated_at: t.updated_at,
        closed_at: t.closed_at,
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...cleanBody } = body;

    // add created_by and meter_id from localStorage (frontend sends them)
    const ticket = await SupportTicket.create(cleanBody);

    return NextResponse.json(
      { success: true, ticket },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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
