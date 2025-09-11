"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-top shadow py-3 text-sm bg-light">
      <div className="container d-flex flex-column flex-lg-row justify-content-between align-items-center gap-3">
        {/* Left: Logo */}
        <div>
          <img
            src="/assets/logo.png"
            alt="Noretek Logo"
            className="rounded-2"
            style={{ height: "40px" }}
          />
        </div>

        {/* Right: Policies */}
        <div>
          <small className="d-flex flex-column flex-lg-row gap-2 text-center text-lg-start">
            &copy; Copyright {new Date().getFullYear()} &nbsp;&nbsp;
            <Link
              href="/privacy-policy"
              className="text-decoration-none text-muted"
            >
              Privacy Policy
            </Link>
            <Link
              href="/data-deletion-policy"
              className="text-decoration-none text-muted"
            >
              Data Deletion Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-decoration-none text-muted"
            >
              Terms and Conditions
            </Link>
          </small>
        </div>
      </div>

      {/* Floating Back-to-Top Button (Mobile only) */}
      <a
        href="#"
        className="d-lg-none position-fixed bottom-0 end-0 m-3 rounded-5 bg-body-secondary p-3 shadow"
      >
        <i className="text-muted bi bi-arrow-up"></i>
      </a>
    </footer>
  );
}
