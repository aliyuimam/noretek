import connectDB from "@/lib/mongodb";
import support_comment from "@/models/Comment";
import { NextResponse } from "next/server";

// ✅ CREATE Comment
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { ticket_id, customer_id, comment, user_name, user_role } = body;

    if (!ticket_id || !comment) {
      return NextResponse.json(
        { success: false, message: "Ticket ID and comment are required" },
        { status: 400 }
      );
    }

    const payload = { ticket_id, comment };
    if (customer_id) payload.customer_id = customer_id;
    if (user_name) payload.user_name = user_name;
    if (user_role) payload.user_role = user_role;

    const newComment = await support_comment.create(payload);

    await newComment.populate("customer_id", "name email");
    await newComment.populate("ticket_id", "title");

    return NextResponse.json(
      { success: true, message: "Comment added", comment: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Comment POST error:", error);
    return NextResponse.json(
      { success: false, message: "Error creating comment" },
      { status: 500 }
    );
  }
}

// ✅ GET All Comments (or filter by ticket_id)
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const ticketId = searchParams.get("ticket_id");
    const customerId = searchParams.get("customer_id"); // ✅ new filter

    const filter = {};
    if (ticketId) filter.ticket_id = ticketId;
    if (customerId) filter.customer_id = customerId; // ✅ only user’s comments

    const comments = await support_comment
      .find(filter)
      .populate("customer_id", "name email")
      .populate("ticket_id", "title")
      .sort({ created_at: 1 });

    const formatted = comments.map((c) => ({
      id: c._id,
      comment_id: c._id,
      ticket_id: c.ticket_id?._id,
      comment: c.comment,
      created_at: c.created_at,
      user_name: c.user_name || c.customer_id?.name || "Unknown",
      user_email: c.customer_id?.email || null,
      user_role: c.user_role || (c.customer_id ? "customer" : "support_officer"),
    }));

    return NextResponse.json({ success: true, comments: formatted });
  } catch (error) {
    console.error("Comment GET error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching comments" },
      { status: 500 }
    );
  }
}


// ✅ UPDATE Comment (PUT)
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, comment } = body;

    const updated = await support_comment
      .findByIdAndUpdate(id, { comment }, { new: true })
      .populate("customer_id", "name email")
      .populate("ticket_id", "title");

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment updated",
      comment: updated,
    });
  } catch (error) {
    console.error("Comment PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Error updating comment" },
      { status: 500 }
    );
  }
}

// ✅ DELETE Comment
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const deleted = await support_comment.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error("Comment DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting comment" },
      { status: 500 }
    );
  }
}
