import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png"; // Assumes assets is in /src/assets

export default function HomeNavbar() {
  return (
    <nav className="navbar navbar-expand-md shadow-sm py-1 justify-content-center align-content-around">
      <div className="container">
        <Image
          src={logo}
          alt="Logo"
          className="rounded-2"
          width={120}
          height={40}
        />

        <button
          className="navbar-toggler shadow-none border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#main-nav"
          aria-controls="main-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end align-center mx-2"
          id="main-nav"
        >
          <ul className="navbar-nav justify-content-center align-items-center">
            <li className="nav-item mx-lg-1">
              <Link href="/" className="nav-link fw-bold shadow-sm">
                Home
              </Link>
            </li>

            <li className="nav-item mx-lg-2">
              <Link
                href="/customer-signin"
                className="nav-link btn-link fw-bold shadow-sm"
              >
                Login
              </Link>
            </li>

            <li className="nav-item mx-lg-2">
              <Link
                href="/super_admin_dashboard"
                className="nav-link btn-link fw-bold btnStyle shadow-sm"
              >
                Admin
              </Link>
            </li>

            <li className="nav-item mx-lg-2">
              <Link
                href="/calinav"
                className="nav-link btn-link fw-bold btnStyle shadow-sm"
              >
                Calin Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
