import Footer from "@/MainComponent/Footer";
import HomeNavbar from "@/MainComponent/HomeNavbar";

export default function TermsAndConditionsPage() {
  return (
    <>
      <HomeNavbar />
      <div className="container shadow-sm pb-2 my-2">
        <h1 className="mb-3">Terms and Conditions</h1>

        <p>
          Welcome to the Noretek Mobile Application (“App”). By downloading,
          registering, or using the App, you agree to these Terms and
          Conditions. Please read them carefully.
        </p>

        <h4>1. Service Description</h4>
        <ul>
          <li>Purchase prepaid tokens for gas usage.</li>
          <li>Recharge their gas meters.</li>
          <li>Monitor gas consumption and account balances.</li>
        </ul>

        <h4>2. User Responsibilities</h4>
        <ul>
          <li>You must provide accurate registration information.</li>
          <li>
            You are responsible for maintaining the confidentiality of your
            account credentials.
          </li>
          <li>
            You agree not to misuse the App or attempt unauthorized access to
            our systems.
          </li>
          <li>You must protect your meter from any form of tampering.</li>
        </ul>

        <h4>3. Payments</h4>
        <ul>
          <li>All purchases are prepaid.</li>
          <li>Payments are processed through secure third-party providers.</li>
          <li>
            Noretek Energy is not liable for delays caused by payment gateways,
            internet disruption, or banks.
          </li>
        </ul>

        <h4>4. Meter Usage</h4>
        <ul>
          <li>
            Tokens purchased grant you access to use gas until units are
            exhausted.
          </li>
          <li>Gas supply will automatically stop once units are depleted.</li>
          <li>
            You are responsible for monitoring your balance and ensuring timely
            recharge.
          </li>
        </ul>

        <h4>5. Data and Privacy</h4>
        <ul>
          <li>
            Your data is collected and processed in accordance with our Privacy
            Policy.
          </li>
          <li>
            You have the right to request deletion of your account data (see
            Data Deletion Policy).
          </li>
        </ul>

        <h4>6. Service Availability</h4>
        <ul>
          <li>
            We strive for uninterrupted service, but do not guarantee error-free
            operation.
          </li>
          <li>
            Scheduled maintenance and unforeseen outages may temporarily affect
            availability.
          </li>
        </ul>

        <h4>7. Limitation of Liability</h4>
        <ul>
          <li>Incorrect token entry.</li>
          <li>
            Service disruptions outside our control (e.g., internet or payment
            failures).
          </li>
          <li>Unauthorized access due to user negligence.</li>
        </ul>

        <h4>8. Termination</h4>
        <ul>
          <li>
            We may suspend or terminate accounts that violate these Terms.
          </li>
          <li>
            You may terminate your account at any time via the App or by
            contacting support.
          </li>
        </ul>

        <h4>9. Governing Law</h4>
        <p>
          These Terms are governed by the laws of the Federal Republic of
          Nigeria.
        </p>

        <h4>10. Contact</h4>
        <p>
          For support or inquiries, please contact:{" "}
          <a href="mailto:info@noretekenergy.com">info@noretekenergy.com</a>
        </p>
      </div>
      <Footer />
    </>
  );
}
