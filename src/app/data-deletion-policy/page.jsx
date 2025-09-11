import Footer from "@/MainComponent/Footer";
import HomeNavbar from "@/MainComponent/HomeNavbar";

export default function DataDeletionPolicyPage() {
  return (
    <>
      <HomeNavbar />
      <div className="container shadow-sm py-2 my-2">
        <h1 className="mb-3">Data Deletion Policy</h1>

        <p>
          At Noretek Energy Ltd, we value your privacy and provide you with the
          right to request deletion of your personal data associated with the
          Noretek Mobile Application.
        </p>

        <h4>Scope</h4>
        <p>
          This policy covers all personal information collected through the App,
          including:
        </p>
        <ul>
          <li>Registration details (name, phone, email, address).</li>
          <li>Transaction and payment history.</li>
          <li>Gas consumption and meter data linked to your account.</li>
        </ul>

        <h4>Requesting Data Deletion</h4>
        <ol>
          <li>
            Send an email to{" "}
            <a href="mailto:info@noretekenergy.com">info@noretekenergy.com</a>{" "}
            with your registered phone number and account details.
          </li>
          <li>Use the customer service channel option available in the App.</li>
        </ol>

        <h4>What Happens After Deletion</h4>
        <ol>
          <li>
            Your account will be deactivated and permanently removed within 30
            days of confirmation.
          </li>
          <li>Your gas meter will no longer be linked to your account.</li>
          <li>
            Transaction records may be retained where required by law (e.g.,
            tax, financial reporting, or regulatory compliance).
          </li>
        </ol>

        <h4>Exceptions</h4>
        <ul>
          <li>Required by Nigerian law or regulatory authorities.</li>
          <li>
            Necessary to resolve disputes or enforce our terms of service.
          </li>
        </ul>

        <p>
          For assistance with deletion requests, contact:{" "}
          <a href="mailto:info@noretekenergy.com">info@noretekenergy.com</a>
        </p>
      </div>
      <Footer />
    </>
  );
}
