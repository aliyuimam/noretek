// src/app/api/property_unit/route.js
import connectDB from "@/lib/mongodb";
import PropertyUnit from "@/models/PropertyUnit";

// GET all units
// GET all units
export async function GET() {
  try {
    await connectDB();
    const units = await PropertyUnit.find()
      .populate("property_id", "property_name") // 👈 only property_name & _id
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(units), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}


// POST new unit
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { property_id, unit_description, blockno, meter_id, captured_by, date } = body;

    if (!property_id || !unit_description || !blockno || !captured_by || !date) {
      return new Response(JSON.stringify({ message: "Required fields missing" }), {
        status: 400,
      });
    }

    // 🔐 Check if meter already assigned
    if (meter_id) {
      const existingUnit = await PropertyUnit.findOne({ meter_id });
      if (existingUnit) {
        return new Response(JSON.stringify({ message: "This meter is already assigned to another unit" }), {
          status: 400,
        });
      }
    }

    await PropertyUnit.create({
      property_id,
      unit_description,
      blockno,
      meter_id,
      captured_by,
      date,
    });

    return new Response(JSON.stringify({ message: "Unit added successfully" }), {
      status: 201,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// PUT update unit
export async function PUT(request) {
  try {
    await connectDB();
    const { id, ...updates } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ message: "Unit ID is required" }), {
        status: 400,
      });
    }

    // 🔐 If meter_id is being updated, check uniqueness
    if (updates.meter_id) {
      const existingUnit = await PropertyUnit.findOne({
        meter_id: updates.meter_id,
        _id: { $ne: id }, // exclude current unit
      });
      if (existingUnit) {
        return new Response(JSON.stringify({ message: "This meter is already assigned to another unit" }), {
          status: 400,
        });
      }
    }

    const updated = await PropertyUnit.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return new Response(JSON.stringify({ message: "Unit not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Unit updated successfully", unit: updated }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// DELETE a unit
export async function DELETE(request) {
  try {
    await connectDB();
    const { id } = await request.json();
    await PropertyUnit.findByIdAndDelete(id);
    return new Response(JSON.stringify({ message: "Unit deleted successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
