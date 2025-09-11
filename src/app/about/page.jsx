import Navbar from "@/MainComponent/Navbar";
import Link from "next/link";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <section className="homeAbout min-vh-100 section-bg pb-0">
        <div className="container-fluid " data-aos="fade-up">
          <div className="row text-center justify-content-center align-items-center">
            <div className=" col-lg-12 col-12 py-5 bg-primary ">
              <div className="section-title py-2 ">
                <h1 className=" text-light fw-bold">About Noretek Energy</h1>
                <p>
                  Powering homes and communities with reliable, efficient, and
                  sustainable energy <br />
                  solutions for over a decade.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container" data-aos="fade-up">
          <div className="row text-center text-md-start  g-2 d-flex flex-row pt-5  justify-content-between align-items-center">
            <div className=" col-lg-6 pt-2 pb-4 flex-grow-1">
              <div className="section-title  ">
                <h2 className=" text-center text-md-start fw-bold py-3 text-dark">
                  Our Story
                </h2>
              </div>
              <blockquote className="mb-4  ">
                Founded in 2010, Noretek Energy began with a simple mission: to
                provide reliable and efficient energy solutions that power homes
                and communities across the region. What started as a small local
                distributor has grown into a trusted energy partner serving
                thousands of customers.
              </blockquote>
              <blockquote className="mb-4 ">
                Our journey has been marked by continuous innovation, from
                implementing smart meter technology to developing our
                comprehensive customer portal. We've always believed that energy
                should be accessible, reliable, and environmentally responsible.
              </blockquote>
              <blockquote className="mb-4  ">
                Today, we're proud to be at the forefront of the energy
                industry, combining traditional reliability with cutting-edge
                technology to serve our customers better than ever before.
              </blockquote>
            </div>
            <div className=" col-lg-6  pt-2 pb-4 flex-grow-0">
              <div className="shadow-sm ">
                <img
                  src="/images/placeholder.jpg"
                  alt=" testimonial"
                  width={150}
                  height={90}
                  className="w-100 h-75 card-img"
                />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row g-4 mt-5 pt-2 ">
              {/* Mission Section */}

              <div className=" col-lg-6  border-1 border-opacity-50 p-4">
                <div class="card border-0 shadow-sm rounded-2p-4">
                  <div class="card-body p-5 text-center">
                    <h5 class="card-title text-center display-6 fw-bold py-3 text-primary">
                      Our Mission
                    </h5>
                    <p class="card-text text-dark  pt-3">
                      To provide reliable, efficient, and sustainable energy
                      solutions that power homes and businesses, while
                      delivering exceptional customer service and contributing
                      to a cleaner, more sustainable future.
                    </p>
                  </div>
                </div>
              </div>
              {/* Vision Section */}
              <div className=" col-lg-6  border-1 border-opacity-50 p-4">
                <div class="card border-0 shadow-sm rounded-2p-4">
                  <div class="card-body p-3 text-center">
                    <h5 class="card-title text-center display-6 fw-bold py-3 text-primary">
                      Our Vision
                    </h5>
                    <p class="card-text text-dark  pt-3">
                      To provide reliable, efficient, and sustainable energy
                      solutions that power homes and businesses, while
                      delivering exceptional customer service and contributing
                      to a cleaner, more sustainable future. To be the leading
                      energy provider in our region, recognized for innovation,
                      reliability, and commitment to customer satisfaction,
                      while pioneering sustainable energy practices for future
                      generations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container" data-aos="fade-up">
          <div className="section-title ">
            <h2 className=" text-center fw-bold   pt-4 text-dark">
              Our Values
            </h2>
            <p className="text-center py-2">
              The principles that guide everything we do
            </p>
          </div>
          <div className=" row text-center justify-content-center py-4 align-items-center ">
            <div className=" col-lg-3  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-people display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Custormer First</h5>
                  <p class="card-text text-dark pt-3">
                    We prioritize our customers need and satisfaction above all
                    else, ensuring reliable service delivery.
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-3  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-record-circle display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Reliability</h5>
                  <p class="card-text text-dark pt-3">
                    Our commitment to consistent, dependable energy solutions
                    keeps your home running smoothly.
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-3  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-award display-6 py-4 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Excellence</h5>
                  <p class="card-text text-dark pt-3">
                    We strive for excellence in every aspect of our service from
                    technology to customer support.
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-3  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-globe display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Sustainability</h5>
                  <p class="card-text text-dark pt-3">
                    Were committed to environmentally responsible energy
                    solutions for a better future.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container" data-aos="fade-up">
          <div className="section-title ">
            <h2 className=" text-center fw-bold   pt-4 text-dark">
              Leadership Team
            </h2>
            <p className="text-center py-2">
              Meet the people driving Noreteks success
            </p>
          </div>
          <div className=" row text-center justify-content-center py-4 align-items-center ">
            <div className=" col-lg-4  pb-3">
              <div class="card border-0 shadow-sm ">
                <img
                  src="/images/placeholder.jpg"
                  className=" card-img img-fluid rounded-0"
                  alt=""
                />
                <div class="card-body">
                  <h5 class="card-title fw-bold">Jimmy Y. Ds</h5>
                  <p class="card-text pt-3 text-primary">
                    Chief Executive Officer
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-4  pb-3">
              <div class="card border-0 shadow-sm ">
                <img
                  src="/images/placeholder.jpg"
                  className=" card-img img-fluid rounded-0"
                  alt=""
                />
                <div class="card-body">
                  <h5 class="card-title fw-bold">Dr. Clara Willings</h5>
                  <p class="card-text pt-3 text-primary">
                    Chief Technology Officer
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-4  pb-3">
              <div class="card border-0 shadow-sm ">
                <img
                  src="/images/placeholder.jpg"
                  className=" card-img img-fluid rounded-0"
                  alt=""
                />
                <div class="card-body">
                  <h5 class="card-title fw-bold">Sir. Donwin AG.</h5>
                  <p class="card-text pt-3 text-primary">
                    Head of Customer Success
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid bg-primary" data-aos="fade-up">
          <div className=" row text-center justify-content-center py-5 align-items-center  ">
            <div className=" col-lg-3  pb-3">
              <div class="card bg-primary border-0 ">
                <div class="card-body">
                  <h5 class="card-title fw-bold display-4 text-light">10+</h5>
                  <p class="card-text text-light">Chief Executive Officer</p>
                </div>
              </div>
            </div>
            <div className=" col-lg-3  pb-3">
              <div class="card bg-primary border-0 ">
                <div class="card-body">
                  <h5 class="card-title fw-bold display-4 text-light">5000+</h5>
                  <p class="card-text text-light">Happy Customer</p>
                </div>
              </div>
            </div>
            <div className=" col-lg-3  pb-3">
              <div class="card bg-primary border-0 ">
                <div class="card-body">
                  <h5 class="card-title fw-bold display-4 text-light">50+</h5>
                  <p class="card-text text-light">Team Members</p>
                </div>
              </div>
            </div>
            <div className=" col-lg-3  pb-3">
              <div class="card bg-primary border-0 ">
                <div class="card-body">
                  <h5 class="card-title fw-bold display-4 text-light">99.9%</h5>
                  <p class="card-text text-light">Uptime Reliability</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid stayBg  text-center ">
          <div className="row text-center justify-content-center align-items-center">
            <div
              className="   my-4 p-md-5  text-center justify-content-center align-items-center  w-100"
              style={{ maxWidth: 600 }}
            >
              <h4 className=" text-center  fw-semibold py-2  text-dark">
                Ready to Join the Noretek Family?</h4>
              <p className="text-muted mb-6">
               Experience reliable energy solutions with exceptional customer service, Get started today.
              </p>
              <div className="row mb-3 d-flex flex-row justify-content-center align-items-center text-center g-0">
               

                <div className=" col-md-4 mt-2 mt-md-0 ">
                  <button
                    type="submit"
                    className="btn bg-primary text-light  w-100  p-md-2   m-0 fw-bold"
                  >
                    Get Started
                  </button>
                </div>
                <div className=" col-md-4 mt-2 mt-md-0  ms-2">
                  <button
                    type="submit"
                    className="btn   w-100  p-md-2   m-0 text-primary fw-bold bg-body-secondary "
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
