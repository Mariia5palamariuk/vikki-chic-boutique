console.log("login.js loaded");

const loginForm = document.getElementById("loginForm");
const loginModal = document.getElementById("loginModal");

console.log("loginForm:", loginForm);
console.log("loginModal:", loginModal);

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("loginEmail");
    const passwordInput = document.getElementById("loginPassword");

    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value.trim() : "";

    console.log("Login form submit:", { email, password });

    const result = await Auth.login(email, password);

    console.log("LOGIN result full:", result);
    console.log("LOCAL user after login:", Auth.getUser());
    console.log("LOCAL role after login:", Auth.getUser()?.role);

    if (result.token) {
      alert("Успішний вхід");

      if (loginModal) {
        loginModal.style.display = "none";
        loginModal.classList.remove("show");
      }

      loginForm.reset();

      window.dispatchEvent(new CustomEvent("authChanged"));
    } else {
      alert(result.message || "Помилка логіну");
    }
  });
 }