// src/app/api/payments/verify/route.js
import { connectDB, getConnectionStatus } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import axios from "axios";

export async function GET(request) {
  try {
    if (getConnectionStatus() !== 1) await connectDB();

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return new Response(
        JSON.stringify({ error: "Payment reference is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let payment = await Payment.findOne({ reference });

    // 🔍 Always verify with Paystack
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;

    const paystackRes = await axios.get(verifyUrl, {
      headers: { Authorization: `Bearer ${paystackSecret}` },
    });

    const paystackData = paystackRes.data?.data;
    const paystackStatus = paystackData?.status;

    if (paystackStatus === "success") {
      if (!payment) {
        // 🆕 Create new payment record if missing
        payment = new Payment({
          reference,
          status: "success",
          amount: paystackData.amount / 100,
          currency: paystackData.currency || "NGN",
          customer_email: paystackData.customer?.email || "unknown@example.com",
          customer_name: paystackData.customer?.first_name 
            ? `${paystackData.customer.first_name} ${paystackData.customer.last_name || ""}`.trim() 
            : null,
          customer_phone: paystackData.customer?.phone || null,

          // 🔑 Meter info from Paystack metadata
          meter_id: paystackData.metadata?.meterId || null,
          meter_number: paystackData.metadata?.meterNumber || null,

          // Optional fields
          metadata: paystackData.metadata || { purchase_type: "electricity_token" },
          transaction_id: paystackData.id?.toString(),
          gateway_response: paystackData,
          initiated_at: new Date(paystackData.created_at),
          paid_at: new Date(paystackData.paid_at),
          verified_at: new Date(),
        });
      } else {
        // Update existing payment
        payment.status = "success";
        payment.paid_at = payment.paid_at || new Date(paystackData.paid_at);
        payment.verified_at = new Date();
        payment.gateway_response = paystackData;
      }

      await payment.save();

      return new Response(
        JSON.stringify({ success: true, status: "success", data: payment }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // ❌ Failed or pending
    if (payment) {
      payment.status = paystackStatus || "failed";
      payment.gateway_response = paystackData;
      await payment.save();
    }

    return new Response(
      JSON.stringify({
        success: false,
        status: paystackStatus || "unknown",
        data: payment,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Verify error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
