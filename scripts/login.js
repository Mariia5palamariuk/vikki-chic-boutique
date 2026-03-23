function updateAuthUI() {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const myOrdersBtn = document.getElementById('myOrdersBtn');
  const authStatus = document.getElementById('authStatus');

  const isAuth = Auth.isAuthenticated();
  const user = Auth.getUser();

  console.log('Updating auth UI...');
  console.log('isAuth:', isAuth);
  console.log('user:', user);

  if (loginBtn) {
    loginBtn.style.display = isAuth ? 'none' : 'inline-block';
  }

  if (logoutBtn) {
    logoutBtn.style.display = isAuth ? 'inline-block' : 'none';
  }

  if (myOrdersBtn) {
    myOrdersBtn.style.display = isAuth ? 'inline-block' : 'none';
  }

  if (authStatus) {
    authStatus.textContent = isAuth && user
      ? `Ви увійшли як ${user.name}`
      : '';
  }
}

const loginForm = document.getElementById('loginForm');
const loginModal = document.getElementById('loginModal');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    console.log('Login form submit:', { email, password });

    const result = await Auth.login(email, password);

    console.log('Login result:', result);

    if (result.token) {
      alert('Успішний вхід');

      if (loginModal) {
        loginModal.style.display = 'none';
      }

      loginForm.reset();

      updateAuthUI();
    } else {
      alert(result.message || 'Помилка логіну');
    }
  });
}

updateAuthUI();