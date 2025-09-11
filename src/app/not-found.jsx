import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <section
      id="not-found"
      className="w-100 vh-100 d-flex flex-column justify-content-center align-items-center"
    >
      <div className="container text-center ">
        <h3> Oooops...!!!</h3>
        <h4>This page is still under development.</h4>
        <p>
          will you like to go back to <br />
          <Link className=" fw-bold mt-4 " href="/">
            Main Page?
          </Link>
        </p>
      </div>
    </section>
  );
}
