// src/app/api/payments/verify/route.js
import { connectDB, getConnectionStatus } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import axios from "axios";

export async function GET(request) {
  try {
    const connectionStatus = getConnectionStatus();
    if (connectionStatus !== 1) await connectDB();

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return new Response(
        JSON.stringify({ error: "Payment reference is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    let payment = await Payment.findOne({ reference });
    if (!payment) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Payment not found",
          reference,
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (payment.status === "success") {
      return new Response(
        JSON.stringify({
          success: true,
          status: payment.status,
          data: payment,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;

    const paystackRes = await axios.get(verifyUrl, {
      headers: { Authorization: `Bearer ${paystackSecret}` },
    });

    const paystackStatus = paystackRes.data?.data?.status;

    if (paystackStatus === "success") {
      payment.status = "success";
      await payment.save();

      return new Response(
        JSON.stringify({ success: true, status: "success", data: payment }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          status: paystackStatus,
          data: payment,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
