// app/api/payments/generates/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Token from "@/models/Token";

export async function POST(request) {
  await connectDB();

  try {
    const { reference, amount, meterNumber } = await request.json();

    if (!reference || !amount || !meterNumber) {
      return NextResponse.json(
        { success: false, message: "Reference, amount, and meter number are required" },
        { status: 400 }
      );
    }

    // ✅ Validate payment
    const payment = await Payment.findOne({ reference });
    if (!payment || payment.status !== "success") {
      return NextResponse.json(
        { success: false, message: "Payment not found or not successful" },
        { status: 400 }
      );
    }

    // ✅ Check if token already exists
    const existingToken = await Token.findOne({ reference });
    if (existingToken) {
      return NextResponse.json({
        success: true,
        token: existingToken.token,
        meterNumber: existingToken.meter_number,
        units: existingToken.units,
        amount: existingToken.amount,
        reference,
        message: "Token already generated",
        expiresAt: existingToken.expires_at.toISOString(),
      });
    }

    // ✅ Generate new token
    const ratePerKwh = 55;
    const units = (amount / ratePerKwh).toFixed(2);
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

    let token;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      token = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join("");
      attempts++;

      try {
        const tokenDoc = new Token({
          reference,
          meter_number: meterNumber,
          amount,
          units,
          token,
          user_id: payment.user_id,
          expires_at: expiresAt,
        });

        await tokenDoc.save();

        return NextResponse.json({
          success: true,
          token,
          meterNumber,
          units,
          amount,
          reference,
          expiresAt: expiresAt.toISOString(),
        });
      } catch (error) {
        if (error.code === 11000 && attempts < maxAttempts) {
          console.warn(`⚠️ Duplicate token detected, retrying (${attempts}/${maxAttempts})`);
          continue;
        }
        throw error;
      }
    }

    throw new Error("Failed to generate unique token after multiple attempts");
  } catch (error) {
    console.error("❌ Token generation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error: " + error.message },
      { status: 500 }
    );
  }
}
