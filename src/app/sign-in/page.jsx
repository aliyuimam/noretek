
import HomeNavbar from "@/MainComponent/HomeNavbar";
import Link from "next/link";

export default function SignIn() {
  return (
    <>
      <HomeNavbar />
      <div className="min-vh-100 bg-light">
        <form>
          <div className="d-flex align-items-center justify-content-center min-vh-100 p-4">
            <div className="w-100" style={{ maxWidth: "500px" }}>
              <div className="text-center mb-4">
                <h2 className="fw-bold text-dark">Sign in with</h2>
              </div>

              <div className="d-grid gap-3">
                {/* Google */}
                <button
                  type="button"
                  className="btn btn-outline-primary d-flex align-items-center justify-content-between px-3 py-2"
                >
                  <span>Google an account</span>
                  <div
                    className="rounded-circle"
                    style={{
                      width: "24px",
                      height: "24px",
                      background:
                        "linear-gradient(to right, #3b82f6, #ef4444, #facc15)",
                    }}
                  ></div>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  className="btn btn-outline-primary d-flex align-items-center justify-content-between px-3 py-2"
                >
                  <span>Apple an account</span>
                  <div
                    className="rounded-circle bg-dark d-flex align-items-center justify-content-center"
                    style={{ width: "24px", height: "24px" }}
                  >
                    <span className="text-white small">🍎</span>
                  </div>
                </button>

                {/* Microsoft */}
                <button
                  type="button"
                  className="btn btn-outline-primary d-flex align-items-center justify-content-between px-3 py-2"
                >
                  <span>Microsoft an account</span>
                  <div
                    className="rounded-circle"
                    style={{
                      width: "24px",
                      height: "24px",
                      background:
                        "linear-gradient(to bottom right, #ef4444, #22c55e, #3b82f6)",
                    }}
                  ></div>
                </button>
              </div>

              {/* Divider */}
              <div className="position-relative my-4">
                <hr />
                <div className="position-absolute top-50 start-50 translate-middle bg-light px-3 text-muted small">
                  or
                </div>
              </div>

              {/* Email and Password Inputs */}
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email"
                  className="form-control form-control-lg"
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Password"
                  className="form-control form-control-lg"
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="remember"
                  />
                  <label
                    className="form-check-label text-muted small"
                    htmlFor="remember"
                  >
                    Remind me later
                  </label>
                </div>
                <Link
                  href="/forgotepassword"
                  className="text-primary small text-decoration-none"
                >
                  Forgot my login details?
                </Link>
              </div>

              {/* Submit Button */}
              <Link href="/admin-dashboard" />
              <button type="submit" className="btn btn-primary w-100 btn-lg">
                Continue
              </button>

              {/* Bottom Message */}
              <div className="text-center mt-4">
                <small className="text-muted">
                  Do you already have an existing{" "}
                  <Link
                    href="/register"
                    className="text-primary text-decoration-none"
                  >
                    account?
                  </Link>
                </small>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
