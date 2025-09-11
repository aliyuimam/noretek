// app/payment-verification/page.jsx
'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Create a separate component that uses useSearchParams
function PaymentVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [reference, setReference] = useState('');
  const [paymentData, setPaymentData] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const verifyPayment = async () => {
      // Paystack sends reference as both 'reference' and 'trxref'
      const ref = searchParams.get('reference') || searchParams.get('trxref');
      setReference(ref);
      
      console.log('🔍 Payment verification started with reference:', ref);

      if (!ref) {
        setStatus('error');
        setMessage('No payment reference provided. Please check your payment and try again.');
        return;
      }

      try {
        console.log('📞 Calling verify API...');
        const response = await fetch(`/api/payments/verify?reference=${ref}`);
        const data = await response.json();
        
        console.log('📦 Verification API response:', data);
        
        if (data.status && data.data.status === 'success') {
          setStatus('success');
          
          // Get payment details
          const paymentDetailsResponse = await fetch(`/api/payments/details?reference=${ref}`);
          const paymentDetails = await paymentDetailsResponse.json();
          
          if (paymentDetailsResponse.ok && paymentDetails.payment) {
            const payment = paymentDetails.payment;
            
            const paymentInfo = {
              reference: ref,
              amount: payment.amount,
              date: new Date(payment.paid_at || payment.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }),
              status: 'success',
              token: payment.metadata?.token,
              meterNumber: payment.metadata?.meter_number || payment.metadata?.meterNumber,
              units: payment.metadata?.units || (payment.amount / 55).toFixed(2)
            };
            
            setPaymentData(paymentInfo);
            
            // Store token info in localStorage for dashboard access
            if (payment.metadata?.token) {
              localStorage.setItem('lastToken', payment.metadata.token);
              localStorage.setItem('lastMeter', paymentInfo.meterNumber);
              localStorage.setItem('lastUnits', paymentInfo.units);
              localStorage.setItem('lastAmount', payment.amount);
              localStorage.setItem('lastReference', ref);
            }
          }
          
          setMessage('Payment successful! Your token has been generated.');
          
          // Start countdown for redirect
          const countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                redirectToDashboard();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
        } else {
          setStatus('error');
          setMessage(data.message || `Payment failed. Status: ${data.data?.status || 'unknown'}`);
        }
      } catch (error) {
        console.error('💥 Payment verification error:', error);
        setStatus('error');
        setMessage('Payment verification failed. Please try again or contact support if the problem persists.');
      }
    };

    const redirectToDashboard = () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        router.push(`/customer_dashboard?email=${encodeURIComponent(userEmail)}&payment_success=true&ref=${reference}`);
      } else {
        router.push('/customer_dashboard?payment_success=true');
      }
    };

    if (searchParams) {
      verifyPayment();
    }
  }, [searchParams, router]);

  const handleManualRedirect = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      router.push(`/customer_dashboard?email=${encodeURIComponent(userEmail)}&payment_success=true&ref=${reference}`);
    } else {
      router.push('/customer_dashboard?payment_success=true');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="h1 mb-0">
                <i className="fas fa-check-circle me-2"></i>
                Payment Verification
              </h2>
            </div>
            <div className="card-body p-5 text-center">
              
              {status === 'verifying' && (
                <div>
                  <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h4 className="text-primary">Verifying Payment...</h4>
                  <p className="text-muted">Please wait while we verify your transaction and generate your token.</p>
                  {reference && (
                    <div className="mt-3">
                      <small className="text-muted">Reference: {reference}</small>
                    </div>
                  )}
                </div>
              )}
              
              {status === 'success' && (
                <div>
                  <div className="text-success mb-3" style={{ fontSize: '4rem' }}>
                    <i className="fas fa-check-circle"></i>
                  </div>
                  
                  <div className="alert alert-success mb-4">
                    <h4 className="alert-heading">Payment Successful!</h4>
                    <p className="mb-2">{message}</p>
                    
                    {/* Display payment details */}
                    {paymentData && (
                      <div className="mt-3 text-start">
                        <div className="row">
                          <div className="col-md-6 mb-2">
                            <strong>Reference Number:</strong>
                            <br />
                            <code>{paymentData.reference}</code>
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong>Amount Paid:</strong>
                            <br />
                            <span className="h5 text-success">₦{paymentData.amount}</span>
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong>Payment Date:</strong>
                            <br />
                            {paymentData.date}
                          </div>
                          <div className="col-md-6 mb-2">
                            <strong>Status:</strong>
                            <br />
                            <span className="badge bg-success fs-6">Completed</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Display token if available */}
                    {paymentData && paymentData.token && (
                      <div className="mt-4">
                        <h5>Your Electricity Token:</h5>
                        <div className="bg-dark text-light p-3 rounded mt-2">
                          <h4 className="mb-0 font-monospace">{paymentData.token}</h4>
                        </div>
                        <div className="mt-2">
                          <small>
                            Meter: {paymentData.meterNumber} | 
                            Units: {paymentData.units} kWh | 
                            Amount: ₦{paymentData.amount}
                          </small>
                        </div>
                        
                        <button 
                          className="btn btn-outline-primary mt-3"
                          onClick={() => {
                            navigator.clipboard.writeText(paymentData.token);
                            alert('Token copied to clipboard!');
                          }}
                        >
                          <i className="fas fa-copy me-2"></i>
                          Copy Token
                        </button>
                      </div>
                    )}
                    
                    {countdown > 0 && (
                      <p className="mb-0 mt-3">Redirecting to dashboard in {countdown} seconds...</p>
                    )}
                  </div>
                  
                  <button 
                    className="btn btn-success btn-lg mt-3"
                    onClick={handleManualRedirect}
                  >
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Go to Dashboard Now
                  </button>
                </div>
              )}
              
              {status === 'error' && (
                <div>
                  <div className="text-danger mb-3" style={{ fontSize: '4rem' }}>
                    <i className="fas fa-times-circle"></i>
                  </div>
                  <div className="alert alert-danger">
                    <h4 className="alert-heading">Payment Failed</h4>
                    <p className="mb-0">{message}</p>
                  </div>
                  
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                    <button 
                      className="btn btn-primary me-md-2"
                      onClick={() => router.push('/customer_dashboard')}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Back to Dashboard
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => router.push('/')}
                    >
                      <i className="fas fa-home me-2"></i>
                      Go to Homepage
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function PaymentVerification() {
  return (
    <Suspense fallback={
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg">
              <div className="card-body p-5 text-center">
                <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="text-primary">Loading Payment Verification...</h4>
                <p className="text-muted">Please wait while we prepare to verify your payment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <PaymentVerificationContent />
    </Suspense>
  );
}