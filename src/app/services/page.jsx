// app/page.js

import Footer from "@/MainComponent/Footer";
import Navbar from "@/MainComponent/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <section className="homeAbout min-vh-100 section-bg pb-0">
        <div className="container-fluid " data-aos="fade-up">
          <div className="row text-center justify-content-center align-items-center">
            <div className=" col-lg-12 col-12 py-5 bg-primary ">
              <div className="section-title py-2 ">
                <h1 className=" text-light fw-bold">Our Services</h1>
                <p>
                  Comprehensive energy solutions desinged to meet all your gas
                  distribution and monitoring needs.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container" data-aos="fade-up">
          <div className="section-title ">
            <h2 className=" text-center fw-bold   pt-4 text-dark">
              What We Offer
            </h2>
            <p className="text-center py-2">
              Complete energy solutions for your home and business.
            </p>
          </div>
          <div className=" row text-center justify-content-center py-4 align-items-center ">
            <div className=" col-lg-4  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-clock display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Gas Monitortin</h5>
                  <p class="card-text text-dark pt-3 text-start">
                    Real-time monitoring of your gas consumption with smart
                    meter technology and instant alerts.
                  </p>
                  <div className=" d-flex ms-4 flex-column d-block text-start">
                    <i className="bi bi-check fst-normal mx-2">
                      24/7 Real-time monitoring
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Smart meter installation
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Usage analytics
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Leak detection alerts.
                    </i>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-lg-4  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-cash display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Gas Purchase</h5>
                  <p class="card-text text-dark pt-3 text-start">
                    Convenient online gas purchasing with multiple payment
                    options and automatic refil services.
                  </p>
                  <div className=" d-flex ms-4 flex-column d-block text-start">
                    <i className="bi bi-check fst-normal mx-2">
                      Online payment portal
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Multile payment methods
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Auto-refill options
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Payment history tracking
                    </i>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-lg-4  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-display display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Online Monitoring</h5>
                  <p class="card-text text-dark pt-3 text-start">
                    Comprehensive dashboard to track your energy usage, bills,
                    and account information.
                  </p>
                  <div className=" d-flex ms-4 flex-column d-block text-start">
                    <i className="bi bi-check fst-normal mx-2">
                      User-friendly dashboard
                    </i>
                    <i className="bi bi-check fst-normal mx-2">Usage report</i>
                    <i className="bi bi-check fst-normal mx-2">
                      Bill management
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Account settings
                    </i>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-lg-4  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-circle display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Customer Support</h5>
                  <p class="card-text text-dark pt-3 text-start">
                    24/7 customer support with dedicated agents ready for assist
                    with any issues or question.
                  </p>
                  <div className=" d-flex ms-4 flex-column d-block text-start">
                    <i className="bi bi-check fst-normal mx-2">
                      24/7 support availability
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      live chat support
                    </i>
                    <i className="bi bi-check fst-normal mx-2">Phone support</i>
                    <i className="bi bi-check fst-normal mx-2">Email suport</i>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-lg-4  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-gear display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Installation & Maintenance</h5>
                  <p class="card-text text-dark pt-3 text-start">
                    Professional installation and regular maintenance of gas
                    systems and smart meters.{" "}
                  </p>
                  <div className=" d-flex ms-4 flex-column d-block text-start">
                    <i className="bi bi-check fst-normal mx-2">
                      Professional installation
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Regular maintenance
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Emergency repairs
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      System upgrades
                    </i>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-lg-4  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-virus display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Safety Services</h5>
                  <p class="card-text text-dark pt-3 text-start">
                    Comprehensive safety inspections and emergency response
                    services for your peace of mind.{" "}
                  </p>
                  <div className=" d-flex ms-4 flex-column d-block text-start">
                    <i className="bi bi-check fst-normal mx-2">
                      Safety inspection
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Emergency response
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Gas leak detection
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Safety training
                    </i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container" data-aos="fade-up">
          <div className="section-title ">
            <h2 className=" text-center fw-bold   pt-4 text-dark">
              Choose Your Plan
            </h2>
            <p className="text-center py-2">
              Select the perfect plan for your energy neesds.
            </p>
          </div>
          <div className=" row text-center justify-content-center py-4 align-items-center ">
            <div className=" col-lg-4  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <div class="card-body">
                  <h5 class="card-title fw-bold">Basic Plan</h5>
                  <div className=" d-flex flex-row justify-content-center">
                    <h5 class="card-title display-5 fw-bolder text-primary">
                      N5,000
                    </h5>
                    <h5 class="card-title mt-2 text-muted ms-1 pt-1">/month</h5>
                  </div>
                  <p class="card-text text-dark pt-3 ">
                    Perfect for small households
                  </p>
                  <div className=" d-flex ms-4 flex-column d-block text-start">
                    <i className="bi bi-check fst-normal mx-2">
                      Basic gas monitoring
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Monthtly usage reports
                    </i>
                    <i className="bi bi-check fst-normal mx-2">Email support</i>
                    <i className="bi bi-check fst-normal mx-2">
                      Standard meter reading
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Basic safety checks
                    </i>
                  </div>
                  <button
                    type="submit"
                    className="btn  bg-dark text-light w-100  p-md-2 mt-4  p-2  m-0 fw-bold  "
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            </div>
            <div className=" col-lg-4  pb-3">
              <span
                className=" align-self-center 
                 badge btn bg-primary rounded-4 text-light w-25 "
              >
                Most Popular
              </span>
              <div class="card border-2 border-primary shadow-sm p-4 py-5">
                <div class="card-body">
                  <h5 class="card-title fw-bold">Premium Plan</h5>
                  <div className=" d-flex flex-row justify-content-center">
                    <h5 class="card-title display-5 fw-bolder text-primary">
                      N12,000
                    </h5>
                    <h5 class="card-title mt-2 text-muted ms-1 pt-1">/month</h5>
                  </div>
                  <p class="card-text text-dark pt-3 ">
                    Ideal for medium households
                  </p>
                  <div className=" d-flex ms-4 flex-column d-block text-start">
                    <i className="bi bi-check fst-normal mx-2">
                      Advanced gas monitoring
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Real-time alerts
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      24/7 phone support
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Smart meter installation
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Priority maintenance
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Monthtly safety inspection
                    </i>
                  </div>
                  <button
                    type="submit"
                    className="btn  bg-primary text-light w-100  p-md-2 mt-4  p-2  m-0 fw-bold  "
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            </div>
            <div className=" col-lg-4  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <div class="card-body">
                  <h5 class="card-title fw-bold">Enterprise Plan</h5>
                  <div className=" d-flex flex-row justify-content-center">
                    <h5 class="card-title display-5 fw-bolder text-primary">
                      N25,000
                    </h5>
                    <h5 class="card-title mt-2 text-muted ms-1 pt-1">/month</h5>
                  </div>
                  <p class="card-text text-dark pt-3 ">
                    Best for large properties
                  </p>
                  <div className=" d-flex ms-4 flex-column d-block text-start">
                    <i className="bi bi-check fst-normal mx-2">
                      Complete monitoring suite
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Instant notifications
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Dedicated account manager
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Advance analytics
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Emergency response
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Weekly safety checks
                    </i>
                    <i className="bi bi-check fst-normal mx-2">
                      Custom reporting
                    </i>
                  </div>
                  <button
                    type="submit"
                    className="btn  bg-dark text-light w-100  p-md-2 mt-4  p-2  m-0 fw-bold  "
                  >
                    Choose Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid bg-light" data-aos="fade-up">
          <div className="section-title ">
            <h2 className=" text-center fw-bold   pt-4 text-dark">
              How It Works
            </h2>
            <p className="text-center py-2">
              Simple steps to get started with Noretek Energy
            </p>
          </div>
          <div className=" row text-center justify-content-center py-5 align-items-center  ">
            <div className=" col-lg-3  pb-3">
              <div class="card  border-0  bg-light">
                <div class="card-body">
                  <span
                    className=" align-self-center  rounded  rounded-5 px-3
                  bg-primary p-2 text-light h3 "
                  >
                    1
                  </span>
                  <h5 class="card-title fw-bold mt-4 ">Sign Up</h5>
                  <p class="card-text text-dark text-muted ">
                    Create your account and choose your service plan
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-3  pb-3">
              <div class="card  border-0  bg-light">
                <div class="card-body">
                  <span
                    className=" align-self-center  rounded  rounded-5 px-3
                  bg-primary p-2 text-light h3 "
                  >
                    2
                  </span>
                  <h5 class="card-title fw-bold mt-4 ">Installation</h5>
                  <p class="card-text text-dark text-muted ">
                    Our technicians intall your smart metter and set up
                    monitoring
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-3  pb-3">
              <div class="card  border-0  bg-light">
                <div class="card-body">
                  <span
                    className=" align-self-center  rounded  rounded-5 px-3
                  bg-primary p-2 text-light h3 "
                  >
                    3
                  </span>
                  <h5 class="card-title fw-bold mt-4 ">Monitor</h5>
                  <p class="card-text text-dark text-muted ">
                    Track your usage in real-time through our online portal{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-3  pb-3">
              <div class="card  border-0  bg-light">
                <div class="card-body">
                  <span
                    className=" align-self-center  rounded  rounded-5 px-3
                  bg-primary p-2 text-light h3 "
                  >
                    4
                  </span>
                  <h5 class="card-title fw-bold mt-4 ">Enjoy</h5>
                  <p class="card-text text-dark text-muted ">
                    Enjoy reliable energy with peace of mind and 24/7 support{" "}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid bg-primary" data-aos="fade-up">
          <div className="section-title ">
            <h2 className=" text-center fw-bold   pt-4 text-light">
              Why Choose Noretek?
            </h2>
            <p className="text-center text-light py-2">
              The benefits that set us apart from the competition
            </p>
          </div>
          <div className=" row text-center justify-content-center py-5 align-items-center  ">
            <div className=" col-lg-4  pb-3">
              <div class="card  border-0  bg-primary">
                <i className=" bi bi-clock display-6 pt-3 text-light"></i>
                <div class="card-body">
                  
                  <h5 class="card-title fw-bold mt-2 text-light ">24/7Availability</h5>
                  <p class="card-text text-light ">
                   Round-the-clock monitoring nd support for your peace of mind.
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-4  pb-3">
              <div class="card  border-0  bg-primary">
                <i className=" bi bi-gear display-6 pt-3 text-light"></i>
                <div class="card-body">
                  
                  <h5 class="card-title fw-bold mt-2 text-light ">Safety First</h5>
                  <p class="card-text text-light ">
                   Advance safety systems and regular inspections to keep you safe.
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-4  pb-3">
              <div class="card  border-0  bg-primary">
                <i className=" bi bi-clock display-6 pt-3 text-light"></i>
                <div class="card-body">
                  
                  <h5 class="card-title fw-bold mt-2 text-light ">Smart Technology</h5>
                  <p class="card-text text-light ">
                  Cutting-edge smart meters and monitoring techology.  </p>
                </div>
              </div>
            </div>
           
          </div>
        </div>
       

       

        <div className="container-fluid stayBg bg-text-center ">
          <div className="row text-center justify-content-center align-items-center">
            <div
              className="   my-4 p-md-5  text-center justify-content-center align-items-center  w-100"
              style={{ maxWidth: 700 }}
            >
              <h4 className=" text-center  fw-semibold py-2  text-dark">
           Ready to Get Started?
              </h4>
              <p className="mb-6 text-dark">
               Join thousands of satisfied customers who trust Noretek for their energy needs.
              </p>
              <div className="row mb-3 d-flex flex-row justify-content-center align-items-center text-center g-0">
                <div className=" col-lg-4 mt-2 mt-md-0 ">
                  <button
                    type="submit"
                    className="btn text-light  bg-primary  w-100  p-lg-1   m-0 fw-bold"
                  >
                    Get Started Today
                  </button>
                </div>
                <div className=" col-lg-4 mt-2 mt-md-0  ms-2">
                  <button
                    type="submit"
                    className="btn   bg-light w-100  p-lg-1  stayBg m-0 text-primary fw-bold "
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
