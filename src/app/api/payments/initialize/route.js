// src/app/api/payments/initialize/route.js
import connectDB from "@/lib/mongodb";
import Payment from "@/lib/Payment";
import { initializeTransaction } from "@/lib/paystack";
import { NextResponse } from "next/server";


export async function POST(request) {
  try {
    // ✅ Connect to MongoDB using the correct function
    await connectDB();
    console.log("✅ MongoDB connected successfully");

    const { email, amount, metadata } = await request.json();

    // ✅ Input validation
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

    // ✅ Prepare Paystack payload
    const payload = {
      email,
      amount: amount * 100, // Paystack expects amount in kobo
      metadata: metadata || {},
      callback_url: `${
        process.env.NEXTAUTH_URL || "http://localhost:3000"
      }/customer_payment_dashboard`,
    };

    console.log("🚀 Initializing payment with callback:", payload.callback_url);
    console.log("🚀 Initializing transaction with data:", {
      email: payload.email,
      amount: payload.amount,
      metadata: payload.metadata,
      callback_url: payload.callback_url
    });

    // ✅ Call Paystack
    const response = await initializeTransaction(payload);

    if (response?.status) {
      const reference = response.data.reference;
      console.log("✅ Payment initialized with reference:", reference);
      console.log("📦 Paystack initialization response:", response);

      try {
        // ✅ Check if already exists (avoid duplicates if Paystack retries)
        const existing = await Payment.findOne({ reference });

        if (!existing) {
          // ✅ Generate a unique transaction_id to avoid null duplicate key errors
          const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          // ✅ Create payment record with all required fields
          const paymentData = {
            reference,
            user_id: metadata?.user_id || null,
            customer_email: email.toLowerCase(),
            customer_name: metadata?.customer_name || null,
            customer_phone: metadata?.customer_phone || null,
            amount: amount,
            currency: "NGN",
            channel: "paystack",
            transaction_id: transactionId, // ✅ Prevent null duplicate key error
            payment_method: "card",
            metadata: {
              ...metadata,
              authorization_url: response.data.authorization_url,
              callback_url: payload.callback_url,
              purchase_type: 'electricity_token' // ✅ Ensure this is set
            },
            status: "pending",
            // ✅ Add meter information if available
            meter_id: metadata?.meterNumber || null,
            meter_number: metadata?.meterNumber || null,
            initiated_at: new Date()
          };

          await Payment.create(paymentData);
          console.log("💾 Payment record created in MongoDB:", reference);
        } else {
          console.log("♻️ Payment already exists in DB:", reference);
        }
      } catch (dbError) {
        console.error("❌ Database error while saving payment:", dbError);
        // ✅ Don't fail the entire request if DB save fails
        // Paystack transaction is already initialized, so we should return success
        console.log("⚠️ Continuing with Paystack response despite DB error");
      }
    } else {
      console.error("❌ Paystack initialization failed:", response);
      return NextResponse.json(
        {
          status: false,
          message: response.message || "Failed to initialize transaction with Paystack",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("💥 Payment initialization error:", error);
    return NextResponse.json(
      {
        status: false,
        message: error.message || "Failed to initialize transaction",
      },
      { status: 500 }
    );
  }
}

// ✅ Add other HTTP methods to prevent errors
export async function GET() {
  return NextResponse.json(
    { status: false, message: "Method not allowed" },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { status: false, message: "Method not allowed" },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { status: false, message: "Method not allowed" },
    { status: 405 }
  );
}