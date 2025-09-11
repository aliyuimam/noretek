import Link from "next/link";

export default function HomeAbout() {
  return (
    <section className="homeAbout  section-bg pb-0">
     
      <div className="container-fluid  primaryColor" data-aos="fade-up">
        <div className="row text-center justify-content-center align-items-center">
          <div className=" col-lg-12 col-12 py-5  ">
            <div className="section-title py-2 ">
              <h2 className=" text-light ">
                How to Register with Noretek
              </h2>
            </div>
            <div className=" d-inline-block justify-content-center align-items-center py-3">
              <div className=" d-flex">
                <div className="round d-md-block d-block ">1</div>
                <div>
                  <h3 className="round-2">Step 1</h3>
                  <p className="ms-4 text-start">
                    Open your web browser and go to the official Noretek
                    homepage at
                    <span className="underline">www.noretek.com</span>.
                  </p>
                </div>
              </div>
              <div className=" d-flex">
                <div className="round d-md-block d-block">2</div>
                <div>
                  <h3 className="round-2">Step 2</h3>
                  <p className="ms-4 text-start">
                    Click on the "Register" or "Create Account" button to
                    complete the process.
                  </p>
                </div>
              </div>
              <div className="d-flex">
                <div className="round d-md-block d-block">3</div>
                <div>
                  <h3 className="round-2">Step 3</h3>
                  <p className="ms-4 text-start">Fill Out the Registration Form</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="round d-md-block d-block">4</div>
                <div>
                  <h3 className="round-2">Step 4</h3>
                  <p className="ms-4 text-start">Verify Your Email or Phone Number</p>
                </div>
              </div>
              <div className="d-flex">
                <div className="round d-md-block d-block">5</div>
                <div>
                  <h3 className="round-2">Step 5</h3>
                  <p className="ms-4 text-start">
                    Check your email inbox for a verification email from
                    Noretek. Click the link in the email to verify your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/** 
      <div className="container" data-aos="fade-up">
        <div className="section-title ">
          <h2 className=" text-center fw-bold pt-4 text-primary">
            What People Are Saying About Noretek
          </h2>
        </div>

        <div className="row text-center d-flex flex-row pt-4 text-center justify-content-center align-items-center">
          <div className=" col-md-4  pt-2 pb-4">
            <div className="w-48 h-48 ">
              <img
                src="/assets/person.png"
                alt=" testimonial"
                width={150}
                height={150}
                className="w-100 h-100 imgRound p-2"
              />
            </div>
          </div>
          <div className=" col-md-8 pt-2 pb-4">
            <blockquote className="mb-4 h4 p-4">
              Noretek has transformed the way I manage my energy needs. The gas
              delivery is always prompt, and the online platform makes
              purchasing so easy. I love the real-time alerts that keep me
              informed
            </blockquote>

            <cite className="text-muted"> Michael J. - Homeowner</cite>
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
              Stay updated with the latest news and offers from Noretek
            </h4>
            <p className="text-muted fs-5 mb-6">
              Get updated with the latest news and offers from Noretek.
              Subscribe Now
            </p>
            <form className="row mb-3 d-flex flex-row justify-content-center align-items-center text-center g-0">
              <div className="col-md-8 me-0 text-center">
                <input
                  placeholder="Enter your email address "
                  type="email"
                  className="form-control rounded-0 shadow-none rounded-1 p-2 px-4"
                  name="email"
                  required
                />
              </div>

              <div className=" col-md-4 ">
                <button type="submit" className="btn btnStyle rounded-1 px-4">
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
       */}
    </section>
  );
}
