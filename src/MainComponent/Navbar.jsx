import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-md shadow-sm py-1 justify-content-center align-content-around">
      <div className="container">
        <img src="./assets/logo.png" className="  rounded-2 " alt="" />

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
          className="collapse navbar-collapse justify-content-center align-center mx-2"
          id="main-nav"
        >
          <ul className="navbar-nav">
          
            <li className="nav-item mx-1 ">
              <a href="/" className="nav-link fw-bold shadow-sm">
                Home
              </a>
            </li>
            <li className="nav-item mx-1">
              <a href="/about" className="nav-link fw-bold shadow-sm">
                About Us
              </a>
            </li>
            <li className="nav-item mx-1">
              <a href="/contact" className="nav-link fw-bold shadow-sm">
                Contact Us
              </a>
            </li>
            <li className="nav-item mx-1">
              <a href="/services" className="nav-link fw-bold shadow-sm">
                Services
              </a>
            </li>

            <li className="nav-item mx-1">
              <a href="/customer-support-landing" className="nav-link fw-bold shadow-sm">
                Customer Support
              </a>
            </li>
         
           
            <li className="nav-item mx-2">
              <a href="/customer" className="nav-link fw-bold btnStyle shadow-sm">
                Register Now
              </a>
            </li>
            <li className="nav-item mx-2">
              <a href="/customer-signin" className="nav-link fw-bold shadow-sm">
                Login
              </a>
            </li>
           
          </ul>
        </div>
      </div>
    </nav>
  );
}
