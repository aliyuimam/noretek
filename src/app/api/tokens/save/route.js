// /src/app/api/tokens/save/route.js

import connectDB from "@/lib/mongodb";
import { getConnectionStatus } from "@/lib/mongodb";
import Token from "@/models/Token";


export async function POST(request) {
  try {
    // Check database connection
    const connectionStatus = getConnectionStatus();
    if (connectionStatus !== 1) {
      await connectDB();
    }

    const { reference, token, meterNumber, amount, units, customerEmail, customerName, userId, expiresAt } = await request.json();

    if (!reference || !token || !meterNumber || !amount || !units || !customerEmail) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Missing required fields' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if token already exists
    const existingToken = await Token.findOne({ reference });
    if (existingToken) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Token with this reference already exists' 
        }),
        { 
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create new token record
    const newToken = new Token({
      reference,
      token,
      meterNumber,
      amount,
      units,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerName,
      userId,
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours default
    });

    await newToken.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Token saved successfully',
        token: {
          id: newToken._id.toString(),
          reference: newToken.reference,
          token: newToken.token,
          meterNumber: newToken.meterNumber,
          amount: newToken.amount,
          units: newToken.units,
          expiresAt: newToken.expiresAt
        }
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Token save error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}