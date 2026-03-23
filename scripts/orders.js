const API_URL = 'https://r211anoshk.execute-api.eu-north-1.amazonaws.com/vikki-chic-boutique-api';

const logoutBtn = document.getElementById('logoutBtn');
const ordersContainer = document.getElementById('ordersContainer');

// 🔐 перевірка авторизації
console.log("Checking authentication...");

if (!Auth.isAuthenticated()) {
  console.log("User is NOT authenticated → redirecting");
  alert("Будь ласка, увійдіть в акаунт");
  window.location.href = "index.html";
} else {
  console.log("User is authenticated");
}

// logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    console.log("Logout button clicked");
    Auth.logout();
  });
}

async function loadOrders() {
  const token = Auth.getToken();

  console.log("Token:", token);

  if (!token) {
    console.log("No token found → redirect");
    window.location.href = "index.html";
    return;
  }

  ordersContainer.innerHTML = "<p>Завантаження...</p>";

  try {
    console.log("Fetching orders...");

    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Response status:", response.status);

    const data = await response.json();

    console.log("Orders response data:", data);

    if (!response.ok) {
      console.error("Error from API:", data);
      ordersContainer.innerHTML = `<p>${data.message || 'Помилка завантаження замовлень'}</p>`;
      return;
    }

    renderOrders(data);

  } catch (error) {
    console.error('Fetch error:', error);
    ordersContainer.innerHTML = '<p>Не вдалося завантажити замовлення</p>';
  }
}

function renderOrders(orders) {
  console.log("Rendering orders:", orders);

  if (!orders.length) {
    console.log("No orders found");
    ordersContainer.innerHTML = '<p>У вас поки немає замовлень</p>';
    return;
  }

  ordersContainer.innerHTML = orders.map(order => {
    console.log("Rendering order:", order);

    return `
      <div class="order-card">
        <h3>Замовлення #${order.id}</h3>
        <p><strong>Статус:</strong> ${order.status}</p>
        <p><strong>Клієнт:</strong> ${order.customerName}</p>
        <p><strong>Сума:</strong> ${order.totalPrice} грн</p>

        <div>
          <strong>Товари:</strong>
          <ul>
            ${(order.items || []).map(item => {
              console.log("Order item:", item);
              return `<li>Товар ID: ${item.goodId}, кількість: ${item.quantity}</li>`;
            }).join('')}
          </ul>
        </div>
      </div>
    `;
  }).join('');
}

loadOrders();