export function isLoggedIn() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    return !!token;
  }
  return false;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    window.location.href = "/stafflogin";
  }
}
