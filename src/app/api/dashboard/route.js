// src/app/api/dashboard/route.js
import connectDB from "@/lib/mongodb";
import CustomerTable from "@/models/CustomerTable";
import Property from "@/models/Property";
import PropertyUnit from "@/models/PropertyUnit";
import Payment from "@/models/Payment";
import SupportTicket from "@/models/supportTicket";

function toISO(value) {
  try {
    const d = value ? new Date(value) : null;
    return d && !isNaN(d.getTime()) ? d.toISOString() : null;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    await connectDB();

    const [
      totalCustomers,
      totalProperties,
      totalUnits,
      totalPayments,
      totalTickets,
      lastPayments,
      lastProperties,
      lastTickets,
    ] = await Promise.all([
      CustomerTable.countDocuments(),
      Property.countDocuments(),
      PropertyUnit.countDocuments(),
      Payment.countDocuments(),
      SupportTicket.countDocuments(),
      // ✅ Payments (timestamps: created_at)
      Payment.find().sort({ created_at: -1 }).limit(5).lean(),
      // ✅ Properties (timestamps: createdAt; also have date_captured)
      Property.find().sort({ createdAt: -1 }).limit(5).lean(),
      // ✅ Tickets (timestamps: created_at)
      SupportTicket.find().sort({ created_at: -1 }).limit(5).lean(),
    ]);

    const payload = {
      success: true,
      totals: {
        totalCustomers: totalCustomers || 0,
        totalProperties: totalProperties || 0,
        totalUnits: totalUnits || 0,
        totalPayments: totalPayments || 0,
        totalTickets: totalTickets || 0,
      },
      recent: {
        payments: (lastPayments || []).map((p) => ({
          _id: p._id?.toString(),
          reference: p.reference,
          amount: p.amount,
          status: p.status,
          created_at: toISO(p.created_at || p.createdAt),
        })),
        tickets: (lastTickets || []).map((t) => ({
          _id: t._id?.toString(),
          title: t.title,
          status: t.status,
          created_at: toISO(t.created_at || t.createdAt),
        })),
        properties: (lastProperties || []).map((prop) => ({
          _id: prop._id?.toString(),
          property_name: prop.property_name,
          owner_name: prop.owner_name,
          property_location: prop.property_location,
          property_address: prop.property_address,
          // 👇 Use createdAt if present, otherwise fall back to date_captured
          created_at: toISO(prop.createdAt || prop.date_captured),
        })),
      },
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Dashboard API error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error",
        error: err.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
