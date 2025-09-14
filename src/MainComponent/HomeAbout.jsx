import Link from "next/link";

export default function HomeAbout() {
  return (
    <section className="homeAbout section-bg pb-0">
      <div className="container-fluid primaryColor" data-aos="fade-up">
        <div className="row text-center justify-content-center align-items-center">
          <div className="col-lg-12 col-12 py-5">
            <div className="section-title py-2">
              <h2 className="text-light">
                How to Integrate a Customer with Noretek ERP System
              </h2>
            </div>

            <div className="d-inline-block justify-content-center align-items-center py-3">
              {/* Step 1 */}
              <div className="d-flex">
                <div className="round d-md-block d-block">1</div>
                <div>
                  <h3 className="round-2">Step 1</h3>
                  <p className="ms-4 text-start">
                    Enrollment Officer loads his web browser and goes to the
                    official Noretek ERP web application at{" "}
                    <span className="underline">www.noretekerp.com</span>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="d-flex">
                <div className="round d-md-block d-block">2</div>
                <div>
                  <h3 className="round-2">Step 2</h3>
                  <p className="ms-4 text-start">
                    Click on the <b>"Staff Login"</b> button, and supply the
                    login credentials.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="d-flex">
                <div className="round d-md-block d-block">3</div>
                <div>
                  <h3 className="round-2">Step 3</h3>
                  <p className="ms-4 text-start">
                    After a successful login, click on the{" "}
                    <b>"Create Customer"</b> button on the sidebar.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="d-flex">
                <div className="round d-md-block d-block">4</div>
                <div>
                  <h3 className="round-2">Step 4</h3>
                  <p className="ms-4 text-start">
                    Supply the requested customer, unit details, and meter info
                    then click on the <b>"Sign Up"</b> button.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
