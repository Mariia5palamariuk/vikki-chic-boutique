const modalLoginBtn = document.getElementById("loginBtn");
const modalLogoutBtn = document.getElementById("logoutBtn");
const modalMyOrdersBtn = document.getElementById("myOrdersBtn");

const loginModal = document.getElementById("loginModal");
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
      isAuth && user ? `Ви увійшли як ${user.name}` : "";
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

if (modalLoginBtn && loginModal && closeLoginModal) {
  modalLoginBtn.addEventListener("click", () => {
    console.log("Open login modal");
    loginModal.classList.add("show");
    showLoginTab();
  });

  closeLoginModal.addEventListener("click", () => {
    console.log("Close login modal");
    loginModal.classList.remove("show");
  });

  loginModal.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      console.log("Close modal by overlay click");
      loginModal.classList.remove("show");
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

if (loginForm) {
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
        if (loginModal) {
          loginModal.classList.remove("show");
        }

        loginForm.reset();

        if (typeof updateAuthUI === "function") {
          updateAuthUI();
        } else {
          updateAuthButtons();
        }
      } else {
        alert(result.message || "Не вдалося увійти");
      }
    } catch (error) {
      console.error("Помилка логіну:", error);
      alert("Сталася помилка під час входу");
    }
  });
}

if (modalRegisterForm) {
  modalRegisterForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = modalRegisterEmail.value.trim();
    const password = modalRegisterPassword.value.trim();

    console.log("Register form submitted:", { email, password });

    try {
      const result = await Auth.signup(email, password);

      console.log("Signup result:", result);

      if (
        result.message &&
        result.message.toLowerCase().includes("успішно")
      ) {
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
