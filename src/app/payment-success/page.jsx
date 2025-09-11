// app/payment-success/page.jsx
'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// Create a separate component that uses useSearchParams
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const processSuccessfulPayment = async () => {
      try {
        const reference = searchParams.get('reference') || searchParams.get('trxref');
        
        if (!reference) {
          setError('No payment reference found. Please contact support with your payment details.');
          setLoading(false);
          return;
        }

        console.log('✅ Payment successful with reference:', reference);

        // Verify payment and get details
        const verifyResponse = await fetch(`/api/payments/verify?reference=${reference}`);
        const verifyData = await verifyResponse.json();

        if (verifyResponse.ok && verifyData.status && verifyData.data.status === 'success') {
          // Get complete payment details with token information
          const paymentDetailsResponse = await fetch(`/api/payments/details?reference=${reference}`);
          const paymentDetails = await paymentDetailsResponse.json();

          if (paymentDetailsResponse.ok && paymentDetails.payment) {
            const payment = paymentDetails.payment;
            
            const paymentInfo = {
              reference: reference,
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
              localStorage.setItem('lastReference', reference);
            }

            // Start countdown for automatic redirect
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
            setError('Could not retrieve payment details. Your payment was successful, but we could not fetch the details.');
          }
        } else {
          setError(verifyData.message || 'Payment verification failed. Please contact support with your reference: ' + reference);
        }

      } catch (error) {
        console.error('Payment processing error:', error);
        setError('Failed to process payment. Please contact support with your reference. Error: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    const redirectToDashboard = () => {
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        router.push(`/customer_dashboard?email=${encodeURIComponent(userEmail)}&payment_success=true`);
      } else {
        router.push('/customer_dashboard?payment_success=true');
      }
    };

    processSuccessfulPayment();
  }, [searchParams, router]);

  const handleManualRedirect = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      router.push(`/customer_dashboard?email=${encodeURIComponent(userEmail)}&payment_success=true`);
    } else {
      router.push('/customer_dashboard?payment_success=true');
    }
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg">
              <div className="card-body p-5 text-center">
                <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="text-primary">Processing Your Payment...</h4>
                <p className="text-muted">Please wait while we confirm your payment and generate your token.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-danger">
              <div className="card-header bg-danger text-white text-center">
                <h2 className="h3 mb-0">Payment Processing Issue</h2>
              </div>
              <div className="card-body p-5 text-center">
                <div className="text-danger mb-3" style={{ fontSize: '3rem' }}>
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="alert alert-danger">
                  <h5 className="alert-heading">Attention Required</h5>
                  <p className="mb-0">{error}</p>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Link href="/customer_dashboard" className="btn btn-primary me-md-2">
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Go to Dashboard
                  </Link>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => window.location.reload()}
                  >
                    <i className="fas fa-sync-alt me-2"></i>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-success">
            <div className="card-header bg-success text-white text-center py-4">
              <h2 className="h1 mb-0">
                <i className="fas fa-check-circle me-2"></i>
                Payment Successful!
              </h2>
            </div>
            <div className="card-body p-5">
              {/* Success Icon */}
              <div className="text-center mb-4">
                <div className="text-success mb-3" style={{ fontSize: '4rem' }}>
                  <i className="fas fa-check-circle"></i>
                </div>
                <p className="lead text-success">Your payment was processed successfully!</p>
              </div>

              {/* Payment Details */}
              <div className="card mb-4">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    <i className="fas fa-receipt me-2"></i>
                    Payment Details
                  </h5>
                </div>
                <div className="card-body">
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
              </div>

              {/* Token Display - Only show if token exists */}
              {paymentData.token && (
                <div className="card mb-4 border-primary">
                  <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-bolt me-2"></i>
                      Your Electricity Token
                    </h5>
                  </div>
                  <div className="card-body text-center">
                    <p className="text-muted">Please copy this token and enter it into your meter:</p>
                    
                    <div className="bg-dark text-light p-4 rounded mb-3">
                      <h2 className="display-5 font-monospace letter-spacing-2">{paymentData.token}</h2>
                    </div>
                    
                    <div className="row text-center">
                      <div className="col-md-4 mb-2">
                        <strong>Meter Number:</strong>
                        <br />
                        {paymentData.meterNumber}
                      </div>
                      <div className="col-md-4 mb-2">
                        <strong>Units:</strong>
                        <br />
                        {paymentData.units} kWh
                      </div>
                      <div className="col-md-4 mb-2">
                        <strong>Rate:</strong>
                        <br />
                        ₦55 per kWh
                      </div>
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
                </div>
              )}

              {/* Instructions */}
              <div className="alert alert-info">
                <h6 className="alert-heading">
                  <i className="fas fa-info-circle me-2"></i>
                  How to use your token:
                </h6>
                <ol className="mb-0 ps-3">
                  <li>Press the <strong>Enter</strong> button on your meter</li>
                  <li>Enter the 20-digit token when prompted</li>
                  <li>Press <strong>Enter</strong> again to confirm</li>
                  <li>Wait for the meter to validate and load the units</li>
                  <li>Your electricity will be available immediately</li>
                </ol>
              </div>

              {/* Redirect Countdown */}
              <div className="alert alert-warning text-center">
                <p className="mb-0">
                  <i className="fas fa-clock me-2"></i>
                  Redirecting to dashboard in {countdown} seconds...
                </p>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                <button 
                  className="btn btn-success btn-lg me-md-2"
                  onClick={handleManualRedirect}
                >
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Go to Dashboard Now
                </button>
                <Link href="/" className="btn btn-outline-secondary btn-lg">
                  <i className="fas fa-home me-2"></i>
                  Back to Home
                </Link>
              </div>

              {/* Support Information */}
              <div className="text-center mt-4 pt-3 border-top">
                <p className="text-muted small">
                  Need help? Contact support at{' '}
                  <a href="mailto:support@noretekenergy.com" className="text-decoration-none">
                    support@noretekenergy.com
                  </a>
                  <br />
                  Reference: <code>{paymentData.reference}</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function PaymentSuccess() {
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
                <h4 className="text-primary">Loading Payment Details...</h4>
                <p className="text-muted">Please wait while we process your payment information.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}