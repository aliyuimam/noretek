import Footer from "@/MainComponent/Footer";
import HomeNavbar from "@/MainComponent/HomeNavbar";

export default function PrivacyPolicyPage() {
  return (
    <>
      <HomeNavbar />
      <div className="container shadow-sm py-2 my-2">
        <h1 className="mb-3">Privacy Policy</h1>

        <p>
          Noretek Energy Ltd (“we,” “our,” “us”) is committed to protecting the
          privacy of our customers who use the Noretek Mobile Application
          (“App”) to purchase tokens and manage their LPG gas meters. This
          Privacy Policy explains how we collect, use, store, and protect your
          personal information.
        </p>

        <h4>Information We Collect</h4>
        <ul>
          <li>
            <strong>Personal Information:</strong> Name, phone number, email
            address, home address, meter number when you register.
          </li>
          <li>
            <strong>Payment Information:</strong> Details provided when making
            transactions (processed securely via third-party payment providers;
            we do not store card details).
          </li>
          <li>
            <strong>Usage Information:</strong> Gas consumption data from your
            meter, transaction history, and app activity.
          </li>
          <li>
            <strong>Device Information:</strong> Mobile device identifiers,
            operating system, and IP address for security and analytics.
          </li>
        </ul>

        <h4>How We Use Your Information</h4>
        <ol>
          <li>
            To provide access to gas through prepaid tokens and manage your
            meter.
          </li>
          <li>To process and confirm payments.</li>
          <li>
            To send account notifications, receipts, and important service
            updates.
          </li>
          <li>To improve app functionality and customer experience.</li>
          <li>To comply with legal and regulatory requirements.</li>
        </ol>

        <h4>Sharing of Information</h4>
        <ol>
          <li>We do not sell your personal data.</li>
          <li>
            We may share necessary data with:
            <ul>
              <li>Authorized payment processors for secure transactions.</li>
              <li>Regulators and government agencies when legally required.</li>
              <li>
                Technical service providers for app maintenance and security.
              </li>
            </ul>
          </li>
        </ol>

        <h4>Data Security</h4>
        <p>
          We apply strict technical and organizational measures to protect your
          data against unauthorized access, disclosure, alteration, or
          destruction.
        </p>

        <h4>Your Rights</h4>
        <ul>
          <li>Access, update, or correct your information.</li>
          <li>
            Request deletion of your account data (see Data Deletion Policy
            below).
          </li>
          <li>Opt out of non-essential communications.</li>
        </ul>

        <p>
          For questions, contact us at:{" "}
          <a href="mailto:info@noretekenergy.com">info@noretekenergy.com</a>
        </p>
      </div>
      <Footer />
    </>
  );
}
