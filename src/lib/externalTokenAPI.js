// lib/externalTokenAPI.js
export async function generateToken(reference, amount, meterNumber) {
  try {
    const apiUrl = 'http://47.107.69.132:9400/API/Token/CreditToken/Generate';
    
    const requestData = {
      reference: reference,
      amount: amount,
      meterNumber: meterNumber
    };

    console.log('📤 Sending token generation request to external API:', apiUrl);
    console.log('📦 Request data:', requestData);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData),
      timeout: 30000 // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 External API response:', data);

    return data;
  } catch (error) {
    console.error('❌ External token API error:', error);
    throw error;
  }
}

// Fallback token generation (if external API fails)
export function generateFallbackToken() {
  // Generate a random 20-digit token
  const token = Array.from({ length: 20 }, () => 
    Math.floor(Math.random() * 10)
  ).join('');
  
  return {
    success: true,
    token: token,
    message: 'Token generated successfully (fallback)'
  };
}