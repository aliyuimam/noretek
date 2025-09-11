"use client";

import Footer from "@/MainComponent/Footer";
import Navbar from "@/MainComponent/Navbar";
import React from "react";

const ContactCard = () => {
  return (
    <>
     
      <Navbar />
      <section className="homeAbout min-vh-100 section-bg pb-0">
        <div className="container-fluid " data-aos="fade-up">
          <div className="row text-center justify-content-center align-items-center">
            <div className=" col-lg-12 col-12 py-5 bg-primary ">
              <div className="section-title py-2 ">
                <h1 className=" text-light fw-bold">Contact Us</h1>
                <p>
                  Get in touch with our team. Were here to help with all your
                  energy needs
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container" data-aos="fade-up">
          <div className="section-title ">
            <h2 className=" text-center fw-bold   pt-4 text-dark">
              Get In Touch
            </h2>
            <p className="text-center py-2">
              We love to hear from you. Heres how you can reach us.
            </p>
          </div>
          <div className=" row text-center justify-content-center py-4 align-items-center ">
            <div className=" col-lg-3  pb-3">
              <div class="card border-0 shadow-sm p-5">
                <i className=" bi bi-telephone display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Phone</h5>
                  <p class="card-text text-dark pt-3">+234 (0) 123 456 7890</p>
                  <p class="card-text text-dark ">+234 (0) 987 654 3210</p>
                </div>

                <p class="card-text text-dark text-muted">
                  Call us for immediate assistance
                </p>
              </div>
            </div>
            <div className=" col-lg-3  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-envelope-at display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Email </h5>
                  <p class="card-text text-dark pt-3">support@noretek.com</p>
                  <p class="card-text text-dark pt-3">info@noretek.com</p>
                </div>
                <p class="card-text text-dark pt-3 text-muted">
                  Send us an email anytime
                </p>
              </div>
            </div>
            <div className=" col-lg-3  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-geo-alt display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Address </h5>
                  <p class="card-text text-dark pt-3">
                    123 Energy Street Lagos, Nigeria
                  </p>
                  <p class="card-text text-dark pt-3">info@noretek.com</p>
                </div>

                <p class="card-text text-dark pt-3  text-muted">
                  Visit our main office
                </p>
              </div>
            </div>
            <div className=" col-lg-3  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <i className=" bi bi-clock display-6 pt-3 text-primary"></i>
                <div class="card-body">
                  <h5 class="card-title fw-bold">Business Hours </h5>
                  <p class="card-text text-dark pt-3">
                    Mon- Fri:8:00 AM - 6:00 PM
                  </p>
                  <p class="card-text text-dark pt-3">Sat- 9:00 AM - 4:00 PM</p>
                </div>

                <p class="card-text text-dark pt-3  text-muted">
                  Were here to help
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container" data-aos="fade-up">
          <div className="section-title ">
            <h2 className=" text-center fw-bold   pt-4 text-dark">
              Send Us a Message
            </h2>
            <p className="text-center py-2">
              Fill out the form below and we will get back to you as soon as
              possible.
            </p>
          </div>
          <div className=" row text-center justify-content-center py-4 align-items-center ">
            <div className=" col-lg-12  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <form>
                  <div className="row text-start">
                    <div className="col-lg-6">
                      <div className="mb-2">
                        <label className=" fw-medium">Full Name *</label>
                        <input
                          type="text"
                          className="form-control shadow-none p-2 ps-4 fst-italic"
                          name="name"
                          required
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-2">
                        <label className="fw-medium">Email Address *</label>
                        <input
                          type="email"
                          className="form-control shadow-none p-2 ps-4 fst-italic"
                          name="email"
                          required
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="mb-2">
                        <label className="fw-medium ">Phone Number:</label>
                        <input
                          type="text"
                          className="form-control shadow-none p-2 ps-4 fst-italic"
                          name="phone"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-2">
                        <label className="fw-medium ">Subject *</label>
                        <input
                          type="text"
                          className="form-control shadow-none p-2 ps-4 fst-italic"
                          name="address"
                          placeholder="Enter the subject"
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="fw-medium text-muted">
                          Message *
                        </label>
                        <textarea
                          type="message"
                          className="form-control shadow-none p-2"
                          name="message"
                          rows="4"
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="container" data-aos="fade-up">
          <div className="section-title ">
            <h2 className=" text-center fw-bold   pt-4 text-dark">Find Us</h2>
            <p className="text-center py-2">
              Visit our office for in-person assistance.
            </p>
          </div>
          <div className=" row text-center justify-content-center py-4 align-items-center ">
            <div className=" col-lg-12  pb-3">
              <div class="card border-0 shadow-sm ">
                <div className="card-body">
                  <div className="shadow-sm ">
                    <img
                      src="/images/placeholder.jpg"
                      alt=" testimonial"
                      className=" w-25 img-fluid"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container" data-aos="fade-up">
          <div className="section-title ">
            <h2 className=" text-center fw-bold   pt-4 text-dark">
              Frequently Asked Questions
            </h2>
            <p className="text-center py-2">
              Quick answers to common Questions
            </p>
          </div>
          <div className=" row text-center justify-content-center py-4 align-items-center ">
            <div className=" col-lg-12  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <div class="card-body">
                  <h5 class="card-title fw-semibold fs-6 text-start">
                    What are your business hours?
                  </h5>
                  <p class="card-text text-start text-dark pt-3">
                    Were open Monday through Friday from 8:00 AM to 6:00 PM, and
                    Saturday from 9:00 AM to 4:00 PM. ere closed on Sundays and
                    public holidays.
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-12  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <div class="card-body">
                  <h5 class="card-title fw-semibold fs-6 text-start">
                    How quickly do you respond to support requests?
                  </h5>
                  <p class="card-text text-start text-dark pt-3">
                    we aim to respond to all support requests within 2 hours
                    during business houses. Emergency requests are handled
                    immediately.
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-12  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <div class="card-body">
                  <h5 class="card-title fw-semibold fs-6 text-start">
                    Do you offer emergency services?
                  </h5>
                  <p class="card-text text-start text-dark pt-3">
                    Yes, we provide 24/7 emergency services for gas leaks and
                    other urgent issues. Call our mergency hotline for immediate
                    assistannce.
                  </p>
                </div>
              </div>
            </div>
            <div className=" col-lg-12  pb-3">
              <div class="card border-0 shadow-sm p-4">
                <div class="card-body">
                  <h5 class="card-title fw-semibold fs-6 text-start">
                    How do i update my billing information?
                  </h5>
                  <p class="card-text text-start text-dark pt-3">
                    You can update your billing information through your online
                    account, by calling customer service, or visiting our
                    office.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid bg-danger  text-center ">
          <div className="row text-center justify-content-center align-items-center">
            <div
              className="   my-4 p-md-5  text-center justify-content-center align-items-center  w-100"
              style={{ maxWidth: 700 }}
            >
              <h4 className=" text-center  fw-semibold py-2  text-light">
                Emergency Support
              </h4>
              <p className="mb-6 text-light">
                For gas leaks or other emergencies, contact us immediately.
              </p>
              <div className="row mb-3 d-flex flex-row justify-content-center align-items-center text-center g-0">
                <div className=" col-lg-4 mt-2 mt-md-0 ">
                  <button
                    type="submit"
                    className="btn bg-light text-danger  w-100  p-lg-1   m-0 fw-bold"
                  >
                    Call Emergency Line
                  </button>
                </div>
                <div className=" col-lg-4 mt-2 mt-md-0  ms-2">
                  <button
                    type="submit"
                    className="btn   w-100  p-lg-1  bg-danger m-0 text-light fw-bold "
                  >
                    +234 (0) 123 456 7890
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
};

export default ContactCard;
