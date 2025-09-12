// src/app/api/payments/webhooks/route.js
import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(request) {
  try {
    await connectDB();

    // ✅ Read raw body for signature verification
    const rawBody = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      console.warn("⚠️ Missing Paystack signature");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Verify the signature
    const expectedSignature = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("❌ Invalid Paystack signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // ✅ Parse JSON safely after verifying
    const payload = JSON.parse(rawBody);
    console.log("📩 Verified Paystack webhook received:", payload.event);

    const { reference, paid_at } = payload.data || {};

    if (!reference) {
      console.warn("⚠️ No payment reference in webhook payload");
      return NextResponse.json({ received: true });
    }

    if (payload.event === "charge.success") {
      await Payment.findOneAndUpdate(
        { reference },
        {
          status: "success",
          paid_at: paid_at || new Date(),
          updated_at: new Date(),
        },
        { new: true }
      );
      console.log("✅ Payment marked as SUCCESS:", reference);
    } else if (payload.event === "charge.failed") {
      await Payment.findOneAndUpdate(
        { reference },
        { status: "failed", updated_at: new Date() },
        { new: true }
      );
      console.log("❌ Payment marked as FAILED:", reference);
    } else {
      console.log(`ℹ️ Ignored webhook event: ${payload.event}`);
    }

    // ✅ Always respond quickly to Paystack
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("💥 Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
