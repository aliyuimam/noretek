// src/app/api/vend-token/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TokenTransaction from '@/models/TokenTransaction'; // You'll need to create this model

export async function POST(request) {
  try {
    await connectDB();
    
    const { reference, amount, meterNumber, email } = await request.json();

    // Your vending API call here...
    // (Keep your existing vending API code)

    // Save to MongoDB using Mongoose
    const tokenTransaction = new TokenTransaction({
      reference: reference,
      meterNumber: meterNumber,
      customerEmail: email,
      amount: amount,
      token: vendData.result.token,
      units: vendData.result.totalUnit,
      status: 'completed'
    });
    
    await tokenTransaction.save();

    return NextResponse.json({
      success: true,
      token: vendData.result.token,
      meterNumber: meterNumber,
      units: vendData.result.totalUnit,
      amount: amount
    });

  } catch (error) {
    console.error('Vending error:', error);
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}