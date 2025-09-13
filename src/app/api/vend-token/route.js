// src/app/api/vend-token/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TokenTransaction from '@/models/TokenTransaction';

export async function POST(request) {
  try {
    await connectDB();
    
    const { reference, amount, meterNumber, email } = await request.json();

    // TODO: Replace this with actual vending API call
    const vendData = {
      result: {
        token: "1234567890TOKEN",
        totalUnit: 50.25,
      },
    };

    // Save transaction
    const tokenTransaction = new TokenTransaction({
      reference,
      meterNumber,
      customerEmail: email,
      amount,
      token: vendData.result.token,
      units: vendData.result.totalUnit,
      status: 'completed',
    });
    
    await tokenTransaction.save();

    return NextResponse.json({
      success: true,
      token: vendData.result.token,
      meterNumber,
      units: vendData.result.totalUnit,
      amount,
    });

  } catch (error) {
    console.error('Vending error:', error);
    return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });
  }
}
