// src/app/api/payments/initialize/route.js
import { NextResponse } from "next/server";
import { initializeTransaction } from "@/lib/paystack";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";   // ✅ FIX: Import model

export async function POST(request) {
  try {
    await connectDB();

    const { email, amount, metadata } = await request.json();

    if (!email || !amount) {
      return NextResponse.json(
        { status: false, message: "Email and amount are required" },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { status: false, message: "Minimum amount is ₦100" },
        { status: 400 }
      );
    }

    // ✅ Always enforce purchase_type and meter_id
    const enrichedMetadata = {
      ...metadata,
      purchase_type: "electricity_token",
    };

    const payload = {
      email,
      amount: amount * 100, // Paystack requires kobo
      metadata: enrichedMetadata,
      callback_url: `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/customer_payment_dashboard`,
    };

    const response = await initializeTransaction(payload);

    if (response?.status) {
      const reference = response.data.reference;

      try {
        const existing = await Payment.findOne({ reference });

        if (!existing) {
          const transactionId = `txn_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;

          const paymentData = {
            reference,
            user_id: enrichedMetadata?.user_id || null,
            customer_email: email.toLowerCase(),
            customer_name: enrichedMetadata?.customer_name || null,
            customer_phone: enrichedMetadata?.customer_phone || null,
            amount: amount,
            currency: "NGN",
            channel: "paystack",
            transaction_id: transactionId,
            payment_method: "card",
            metadata: {
              ...enrichedMetadata,
              authorization_url: response.data.authorization_url,
              callback_url: payload.callback_url,
            },
            status: "pending",
            meter_id: enrichedMetadata?.meterId || enrichedMetadata?.meterNumber || null, // ✅ Fix
            meter_number: enrichedMetadata?.meterNumber || enrichedMetadata?.meterId || null,
            initiated_at: new Date(),
          };

          await Payment.create(paymentData);
        }
      } catch (dbError) {
        console.error("Database error while saving payment:", dbError);
      }
    } else {
      return NextResponse.json(
        {
          status: false,
          message:
            response.message ||
            "Failed to initialize transaction with Paystack",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Initialize error:", error);
    return NextResponse.json(
      {
        status: false,
        message: error.message || "Failed to initialize transaction",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: false, message: "Method not allowed" },
    { status: 405 }
  );
}
