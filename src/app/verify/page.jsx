
import CustomizedNav from "@/MainComponent/CustomizedNav";
import Link from "next/link";

export default function SignIn() {
  return (
    <>
      <CustomizedNav />
      <div className="min-vh-100 bg-light verify">
        <form>
          <div className="d-flex align-items-center justify-content-center min-vh-100 p-4">
            <div className="w-100" style={{ maxWidth: "500px" }}>
              <div className="text-center mb-4">
                <h2 className="fw-bold text-dark">
                  <i className=" bi bi-person-lines-fill border-2 rounded-5 text-primary p-2 border border-primary"></i>
                </h2>
              </div>

              <div className="d-grid gap-3">
                {/* Google */}

                {/* Apple */}

                {/* Microsoft */}
                <div className=" justify-content-center align-items-center text-center">
                  <h3>Verify your email address</h3>
                  <p>
                    enter the six digit code we sent to you via this email
                    king22@gmail.com
                  </p>
                </div>
                <div className=" d-flex justify-content-center align-content-center">
                 
                  <input
                    type="number"
                    className=" emailbox"
                  />
                  <input
                    type="number"
                    className=" emailbox"
                  />
                  <input
                    type="number"
                    className=" emailbox me-lg-3 me-2"
                  />
                  <input
                    type="number"
                    className=" emailbox ms-lg-3 ms-2"
                  />
                  <input
                    type="number"
                    className=" emailbox"
                  />
                  <input
                    type="number"
                    className=" emailbox"
                  />
                </div>
                 <p>
                    Resent code in 03:59
                  </p>
              </div>

              
             

              
               

              {/* Submit Button */}
              
              <button type="submit" className="btn btn-primary w-100 btn-lg">
                Continue
              </button>

             
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
