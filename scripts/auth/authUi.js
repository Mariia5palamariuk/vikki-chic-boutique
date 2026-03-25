import { formSection, loginBtn, logoutBtn, myOrdersBtn, authStatus, totalsSection } from "../ui/dom.js";

export function isAdminUser() {
  const user = Auth.getUser();
  return user && user.role === "admin";
}

export function updateAuthUI() {
  const isAuth = Auth.isAuthenticated();
  const user = Auth.getUser();

  console.log("Updating auth UI...");
  console.log("isAuth:", isAuth);
  console.log("user:", user);

  if (loginBtn) {
    loginBtn.style.display = isAuth ? "none" : "inline-block";
  }

  if (logoutBtn) {
    logoutBtn.style.display = isAuth ? "inline-block" : "none";
  }

  if (myOrdersBtn) {
    myOrdersBtn.style.display = isAuth ? "inline-block" : "none";
  }

  if (authStatus) {
    authStatus.textContent = isAuth && user ? `Ви увійшли як ${user.name}` : "";
  }

  if (formSection) {
    formSection.style.display = isAdminUser() ? "block" : "none";
  }

  if (totalsSection) {
    totalsSection.style.display = isAdminUser() ? "block" : "none";
  }
}