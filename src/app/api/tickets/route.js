
import connectDB from "@/lib/mongodb";
import supportTicket from "@/models/supportTicket";
import { NextResponse } from "next/server";

// GET: Fetch all tickets
export async function GET() {
  try {
    await connectDB();
    const tickets = await supportTicket.find().lean();
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
        created_at: t.created_at,
        updated_at: t.updated_at,
        closed_at: t.closed_at,
      })),
    });
  } catch (err) {
    console.error("Error fetching tickets:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Create a new ticket
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // 🚀 Remove _id if present to avoid duplicate key errors
    const { _id, ...cleanBody } = body;

    // Map category_id to category if present
    if (cleanBody.category_id) {
      cleanBody.category = mapCategoryIdToCategory(cleanBody.category_id);
      delete cleanBody.category_id;
    }

    const ticket = await supportTicket.create(cleanBody);
    return NextResponse.json({
      success: true,
      ticket: {
        _id: ticket._id.toString(),
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        created_by: ticket.created_by,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        closed_at: ticket.closed_at,
      },
    }, { status: 201 });
  } catch (err) {
    console.error("Error creating ticket:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT: Update a ticket by ID
export async function PUT(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, ...updateData } = body;
    if (!_id) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }

    // Map category_id to category if present
    if (updateData.category_id) {
      updateData.category = mapCategoryIdToCategory(updateData.category_id);
      delete updateData.category_id;
    }

    const ticket = await supportTicket.findByIdAndUpdate(_id, updateData, { new: true });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      ticket: {
        _id: ticket._id.toString(),
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        created_by: ticket.created_by,
        created_at: ticket.created_at,
        updated_at: ticket.updated_at,
        closed_at: ticket.closed_at,
      },
    });
  } catch (err) {
    console.error("Error updating ticket:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Delete a ticket by ID (expects ?id=xxx in query)
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
    }
    const ticket = await supportTicket.findByIdAndDelete(id);
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Ticket deleted" });
  } catch (err) {
    console.error("Error deleting ticket:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Helper to map category_id to category string
function mapCategoryIdToCategory(category_id) {
  switch (category_id) {
    case "general":
      return "General Inquiry";
    case "billing":
      return "Biling Issues";
    case "technical":
      return "Technical Problems";
    case "others":
      return "Others";
    default:
      return "General Inquiry";
  }
}
