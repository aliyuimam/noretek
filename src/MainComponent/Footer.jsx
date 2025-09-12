"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-top shadow py-3 small bg-light">
      <div className="container d-flex flex-column flex-lg-row justify-content-between align-items-center gap-3">
        
        {/* Right: Policies */}
        <div>
          <small className="d-flex flex-column flex-lg-row gap-3 text-center text-lg-start">
            <span>&copy; {new Date().getFullYear()}</span>
            <Link href="/privacy-policy" className="text-decoration-none text-muted">
              Privacy Policy
            </Link>
            <Link href="/data-deletion-policy" className="text-decoration-none text-muted">
              Data Deletion Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-decoration-none text-muted">
              Terms and Conditions
            </Link>
          </small>
        </div>
      </div>

      {/* Floating Back-to-Top Button (Mobile only) */}
      <a
        href="#"
        className="d-lg-none position-fixed bottom-0 end-0 m-3 rounded-pill bg-body-secondary p-3 shadow"
      >
        <i className="bi bi-arrow-up text-muted"></i>
      </a>
    </footer>
  );
}
