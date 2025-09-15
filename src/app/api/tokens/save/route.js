// /src/app/api/tokens/save/route.js
import { connectDB, getConnectionStatus } from '@/lib/mongodb';
import Token from '@/models/Token';

export async function POST(request) {
  try {
    // Ensure DB connection
    if (getConnectionStatus() !== 1) {
      await connectDB();
    }

    const {
      reference,
      token,
      meterNumber,
      amount,
      units,
      customerEmail,
      customerName,
      userId,
      expiresAt,
    } = await request.json();

    // Validate
    if (!reference || !token || !meterNumber || !amount || !units || !customerEmail) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check duplicate
    const existingToken = await Token.findOne({ reference });
    if (existingToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Token with this reference already exists',
        }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Save new token
    const newToken = new Token({
      reference,
      token,
      meterNumber,
      amount,
      units,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerName,
      userId,
      expiresAt: expiresAt
        ? new Date(expiresAt)
        : new Date(Date.now() + 72 * 60 * 60 * 1000), // 72 hours default
    });

    await newToken.save();

    // Return full token with timestamps
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
          customerEmail: newToken.customerEmail,
          customerName: newToken.customerName,
          status: newToken.status,
          expiresAt: newToken.expiresAt,
          generatedAt: newToken.generatedAt,
          createdAt: newToken.createdAt,
        },
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Token save error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
