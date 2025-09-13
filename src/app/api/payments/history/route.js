// /src/app/api/payments/history/route.js

import connectDB, { getConnectionStatus } from "@/lib/mongodb";
import Payment from "@/models/Payment";

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
    const customerEmail = searchParams.get('email');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    if (!customerEmail) {
      return new Response(
        JSON.stringify({ error: 'Customer email is required' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Fetching payment history for:', customerEmail);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Find payments for customer with pagination - using correct field name
    const payments = await Payment.find({ customer_email: customerEmail.toLowerCase().trim() })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalPayments = await Payment.countDocuments({ customer_email: customerEmail.toLowerCase().trim() });
    const totalPages = Math.ceil(totalPayments / limit);

    console.log(`Found ${payments.length} payments out of ${totalPayments} total`);

    // Map to frontend expected field names
    const formattedPayments = payments.map(payment => ({
      id: payment._id?.toString(),
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
      // Include additional fields that might be useful
      meter_id: payment.meter_id,
      meter_number: payment.meter_number,
      token_code: payment.token_code,
      payment_method: payment.payment_method,
      metadata: payment.metadata || {}
    }));

    return new Response(
      JSON.stringify({
        success: true,
        payments: formattedPayments,
        pagination: {
          currentPage: page,
          totalPages,
          totalPayments,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Payment history error:', error);
    return new Response(
      JSON.stringify({ 
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