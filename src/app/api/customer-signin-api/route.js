// app/api/login/route.js
import connectDB from "@/lib/mongodb";
import CustomerTable from "@/models/CustomerTable";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        { status: 400 }
      );
    }

    const customer = await CustomerTable.findOne({ email });
    if (!customer) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, customer.password);
    if (!match) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        { status: 401 }
      );
    }

    // ✅ Force role to Customer for frontend consistency
    return new Response(
      JSON.stringify({
        message: "Login successful",
        role: "Customer",
        customerId: customer._id.toString(),
        name: customer.name,
        email: customer.email,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}
