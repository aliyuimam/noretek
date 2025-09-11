// lib/paystack.js
// ❌ REMOVE THIS LINE - it's causing circular import
// import { initializeTransaction, verifyTransaction } from '@/lib/paystack';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Make sure to use named exports correctly
export const initializeTransaction = async (data) => {
  try {
    console.log('🚀 Initializing transaction with data:', data);
    
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key is missing');
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log('📦 Paystack initialization response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error('💥 initializeTransaction error:', error);
    throw new Error(error.message || 'Failed to initialize transaction');
  }
};

export const verifyTransaction = async (reference) => {
  try {
    console.log('🔍 Verifying transaction:', reference);
    
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key is missing');
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const responseData = await response.json();
    console.log('📦 Paystack verification response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error('💥 verifyTransaction error:', error);
    throw new Error(error.message || 'Failed to verify transaction');
  }
};

export const getPaymentHistory = async (email) => {
  try {
    console.log('📜 Fetching payment history for:', email);
    
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key is missing');
    }

    const response = await fetch(`${PAYSTACK_BASE_URL}/transaction?customer_email=${encodeURIComponent(email)}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const responseData = await response.json();
    console.log('📦 Payment history response:', responseData);

    if (!response.ok) {
      throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error('💥 getPaymentHistory error:', error);
    throw new Error(error.message || 'Failed to fetch payment history');
  }
};

// ✅ Choose ONE export method (I recommend named exports only)
// Remove the default export if you're using named imports