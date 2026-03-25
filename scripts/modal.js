const modalLoginBtn = document.getElementById("loginBtn");
const modalLogoutBtn = document.getElementById("logoutBtn");
const modalMyOrdersBtn = document.getElementById("myOrdersBtn");

const modalWindow = document.getElementById("loginModal");
const closeLoginModal = document.getElementById("closeLoginModal");

const togglePasswordBtn = document.getElementById("togglePasswordBtn");
const loginPassword = document.getElementById("loginPassword");

const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");

const modalRegisterForm = document.getElementById("modalRegisterForm");
const modalRegisterEmail = document.getElementById("modalRegisterEmail");
const modalRegisterPassword = document.getElementById("modalRegisterPassword");

const loginTabBtn = document.getElementById("loginTabBtn");
const registerTabBtn = document.getElementById("registerTabBtn");

const modalAuthStatus = document.getElementById("authStatus");

console.log("modal.js loaded");
console.log("modalLoginBtn:", modalLoginBtn);
console.log("modalWindow:", modalWindow);
console.log("closeLoginModal:", closeLoginModal);

function updateAuthButtons() {
  const isAuth = Auth.isAuthenticated();
  const user = Auth.getUser();

  console.log("updateAuthButtons → isAuth:", isAuth);
  console.log("updateAuthButtons → user:", user);

  if (isAuth) {
    if (modalLoginBtn) modalLoginBtn.style.display = "none";
    if (modalLogoutBtn) modalLogoutBtn.style.display = "inline-block";
    if (modalMyOrdersBtn) modalMyOrdersBtn.style.display = "inline-block";
  } else {
    if (modalLoginBtn) modalLoginBtn.style.display = "inline-block";
    if (modalLogoutBtn) modalLogoutBtn.style.display = "none";
    if (modalMyOrdersBtn) modalMyOrdersBtn.style.display = "none";
  }

  if (modalAuthStatus) {
    modalAuthStatus.textContent =
      isAuth && user ? `Ви увійшли як ${user.name || user.email}` : "";
  }
}

function showLoginTab() {
  if (loginForm) loginForm.style.display = "block";
  if (modalRegisterForm) modalRegisterForm.style.display = "none";

  if (loginTabBtn) loginTabBtn.classList.add("active");
  if (registerTabBtn) registerTabBtn.classList.remove("active");
}

function showRegisterTab() {
  if (loginForm) loginForm.style.display = "none";
  if (modalRegisterForm) modalRegisterForm.style.display = "block";

  if (registerTabBtn) registerTabBtn.classList.add("active");
  if (loginTabBtn) loginTabBtn.classList.remove("active");
}

if (loginTabBtn) {
  loginTabBtn.addEventListener("click", () => {
    console.log("Switch to login tab");
    showLoginTab();
  });
}

if (registerTabBtn) {
  registerTabBtn.addEventListener("click", () => {
    console.log("Switch to register tab");
    showRegisterTab();
  });
}

if (modalLoginBtn && modalWindow) {
  modalLoginBtn.addEventListener("click", () => {
    console.log("Open login modal");
    modalWindow.classList.add("show");
    modalWindow.style.display = "flex";
    showLoginTab();
  });
}

if (closeLoginModal && modalWindow) {
  closeLoginModal.addEventListener("click", () => {
    console.log("Close login modal");
    modalWindow.classList.remove("show");
    modalWindow.style.display = "none";
  });
}

if (modalWindow) {
  modalWindow.addEventListener("click", (event) => {
    if (event.target === modalWindow) {
      console.log("Close modal by overlay click");
      modalWindow.classList.remove("show");
      modalWindow.style.display = "none";
    }
  });
}

if (togglePasswordBtn && loginPassword) {
  togglePasswordBtn.addEventListener("click", () => {
    loginPassword.type =
      loginPassword.type === "password" ? "text" : "password";

    console.log("Password field type:", loginPassword.type);
  });
}

if (loginForm && loginEmail && loginPassword) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    console.log("Login form submitted");

    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const result = await Auth.login(email, password);

      console.log("Login result:", result);

      if (result.token) {
        if (modalWindow) {
          modalWindow.classList.remove("show");
          modalWindow.style.display = "none";
        }

        loginForm.reset();
        updateAuthButtons();
        window.dispatchEvent(new CustomEvent("authChanged"));
      } else {
        alert(result.message || "Не вдалося увійти");
      }
    } catch (error) {
      console.error("Помилка логіну:", error);
      alert("Сталася помилка під час входу");
    }
  });
}

if (modalRegisterForm && modalRegisterEmail && modalRegisterPassword) {
  modalRegisterForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = modalRegisterEmail.value.trim();
    const password = modalRegisterPassword.value.trim();

    console.log("Register form submitted:", { email, password });

    try {
      const result = await Auth.signup(email, password);

      console.log("Signup result:", result);

      if (result.message && result.message.toLowerCase().includes("успішно")) {
        alert("Реєстрація успішна. Тепер увійдіть.");
        modalRegisterForm.reset();
        showLoginTab();
      } else {
        alert(result.message || "Не вдалося зареєструватися");
      }
    } catch (error) {
      console.error("Помилка реєстрації:", error);
      alert("Сталася помилка під час реєстрації");
    }
  });
}

 updateAuthButtons();
 showLoginTab();