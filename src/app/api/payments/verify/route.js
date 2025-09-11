// /src/app/api/payments/verify/route.js

import connectDB from "@/lib/mongodb";
import { getConnectionStatus } from "@/lib/mongodb";
import Payment from "@/lib/Payment";


export async function GET(request) {
  try {
    // Check database connection
    const connectionStatus = getConnectionStatus();
    console.log('Database connection status:', connectionStatus);
    
    if (connectionStatus !== 1) {
      console.log('Database not connected, attempting to connect...');
      await connectDB();
    }

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return new Response(
        JSON.stringify({ error: 'Payment reference is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Verifying payment reference:', reference);

    // Find payment by reference - using correct field names
    const payment = await Payment.findOne({ reference });

    if (!payment) {
      console.log('Payment not found for reference:', reference);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Payment not found',
          reference: reference 
        }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Payment found:', {
      reference: payment.reference,
      status: payment.status,
      amount: payment.amount
    });

    // Return response with correct field names that match your frontend
    return new Response(
      JSON.stringify({
        success: true,
        status: payment.status,
        data: {
          reference: payment.reference,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency,
          customerEmail: payment.customer_email, // Map to frontend expected field
          customer_email: payment.customer_email, // Also include original
          createdAt: payment.created_at, // Map to frontend expected field
          created_at: payment.created_at, // Also include original
          updatedAt: payment.updated_at, // Map to frontend expected field
          updated_at: payment.updated_at, // Also include original
          metadata: payment.metadata || {},
          // Include additional fields that might be needed
          meter_id: payment.meter_id,
          meter_number: payment.meter_number,
          transaction_id: payment.transaction_id
        }
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Payment verification error:', error);
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

// Export other HTTP methods
export async function POST() {
  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}