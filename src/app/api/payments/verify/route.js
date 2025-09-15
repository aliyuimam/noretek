// src/app/api/payments/verify/route.js
import { connectDB, getConnectionStatus } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Token from "@/models/Token";   // ✅ Import Token model
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
          meter_id: paystackData.metadata?.meterId || null,
          meter_number: paystackData.metadata?.meterNumber || null,
          metadata: paystackData.metadata || { purchase_type: "electricity_token" },
          transaction_id: paystackData.id?.toString(),
          gateway_response: paystackData,
          initiated_at: new Date(paystackData.created_at),
          paid_at: new Date(paystackData.paid_at),
          verified_at: new Date(),
        });
      } else {
        payment.status = "success";
        payment.paid_at = payment.paid_at || new Date(paystackData.paid_at);
        payment.verified_at = new Date();
        payment.gateway_response = paystackData;
      }

      await payment.save();

      // ✅ Auto-save token after successful payment (Vend API integration)
      if (payment.meter_number && payment.customer_email) {
        try {
          const vendToken = await generateVendToken(
            payment.meter_number,
            payment.amount,
            payment.reference
          );

          const tokenDoc = new Token({
            reference: payment.reference,
            token: vendToken.token,
            meterNumber: payment.meter_number,
            amount: payment.amount,
            units: vendToken.units || (payment.amount / 55).toFixed(2),
            customerEmail: payment.customer_email,
            customerName: payment.customer_name,
            userId: payment.user_id,
            expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours
          });

          await tokenDoc.save();
          console.log("✅ Token saved:", tokenDoc.reference);
        } catch (vendError) {
          console.error("❌ Vend API failed, fallback token used:", vendError.message);
          const fallbackToken = generateNumericToken();
          const tokenDoc = new Token({
            reference: payment.reference,
            token: fallbackToken,
            meterNumber: payment.meter_number,
            amount: payment.amount,
            units: (payment.amount / 55).toFixed(2),
            customerEmail: payment.customer_email,
            customerName: payment.customer_name,
            userId: payment.user_id,
            expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000),
          });
          await tokenDoc.save();
        }
      }

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

// ✅ Vend API Token Generator
async function generateVendToken(meterNumber, amount, reference) {
  const payload = {
    meterId: meterNumber,
    amount: amount,
    authorizationPassword: "Ntk0001@#",
    serialNumber: reference,
    company: "Noretek Energy",
    isVendByTotalPaid: true,
    isPreview: false,
  };

  try {
    const vendResponse = await fetch(
      "http://47.107.69.132:9400/API/Token/CreditToken/Generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (vendResponse.ok) {
      const vendData = await vendResponse.json();
      if (vendData.result?.token) {
        return {
          token: vendData.result.token,
          units: vendData.result.totalUnit,
        };
      }
    }

    // 🔁 Fallback API
    const vendResponse2 = await fetch(
      "http://47.107.69.132:9400/API/Token/CreditToken/GenerateS2",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (vendResponse2.ok) {
      const vendData2 = await vendResponse2.json();
      if (vendData2.result?.token) {
        return {
          token: vendData2.result.token,
          units: vendData2.result.totalUnit,
        };
      }
    }

    throw new Error("Both vend API endpoints failed");
  } catch (error) {
    console.error("Vend API error:", error.message);
    throw error;
  }
}

// ✅ Numeric fallback token generator
function generateNumericToken() {
  let token = "";
  for (let i = 0; i < 20; i++) token += Math.floor(Math.random() * 10);
  return token;
}
