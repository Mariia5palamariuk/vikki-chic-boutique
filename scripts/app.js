let goods = [];
let cart = [];
let editingGoodsId = null;
let selectedCategory = "all";

const GOODS_API_URL = "https://r211anoshk.execute-api.eu-north-1.amazonaws.com/vikki-chic-boutique-api/goods";

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

async function loadGoodsFromApi() {
  console.log("Loading goods from API...");

  try {
    const response = await fetch(GOODS_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log("Goods response status:", response.status);

    const data = await response.json();

    console.log("Goods response data:", data);

    if (!response.ok) {
      alert("Не вдалося завантажити товари");
      return;
    }

    goods = data.map(item => ({
      id: item.id,
      name: item.name,
      brand: item.brand || "Без бренду",
      price: Number(item.price) || 0,
      category: item.category || "",
      size: item.size || "-",
      color: item.color || "-",
      stock: Number(item.stock) || 0,
      imageUrl: item.imageUrl || "./assets/dress.jpg"
    }));

    updateView();
  } catch (error) {
    console.error("Load goods ERROR:", error);
    alert("Помилка завантаження товарів");
  }
}

const categoryCards = document.querySelectorAll(".category-card");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const goodsList = document.getElementById("goodsList");

const goodForm = document.getElementById("goodForm");
const formSection = document.querySelector(".form-section");
const goodIdInput = document.getElementById("goodId");
const nameInput = document.getElementById("name");
const brandInput = document.getElementById("brand");
const priceInput = document.getElementById("price");
const categoryInput = document.getElementById("category");
const sizeInput = document.getElementById("size");
const colorInput = document.getElementById("color");
const stockInput = document.getElementById("stock");
const imageUrlInput = document.getElementById("imageUrl");

// ----- AUTH UI -----
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const myOrdersBtn = document.getElementById("myOrdersBtn");
const authStatus = document.getElementById("authStatus");

// ----- ORDERS -----
const ordersSection = document.getElementById("ordersSection");
const ordersList = document.getElementById("ordersList");
const cartSection = document.getElementById("cartSection");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const totalsSection = document.querySelector(".totals");

// ----- AUTH FUNCTIONS isAdminUser -----
function isAdminUser() {
  const user = Auth.getUser();
  return user && user.role === "admin";
}

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", createOrderFromCart);
}

function renderGooods(items) {
  goodsList.innerHTML = "";

  items.forEach((good) => {
    const goodCard = document.createElement("div");
    goodCard.classList.add("good-card");

    const adminButtons = isAdminUser()
      ? `
        <button type="button" class="edit-btn">Редагувати</button>
        <button type="button" class="delete-btn">Видалити</button>
      `
      : "";

    goodCard.innerHTML = `
      <img src="${good.imageUrl}" alt="${good.name}" onerror="this.onerror=null; this.src='https://picsum.photos/300/400';">
      <h3>${good.name}</h3>
      <p><strong>Бренд:</strong> ${good.brand}</p>
      <p><strong>Ціна:</strong> ${good.price} грн</p>
      <p><strong>Категорія:</strong> ${good.category}</p>
      <p><strong>Розмір:</strong> ${good.size}</p>
      <p><strong>Колір:</strong> ${good.color}</p>
      <p><strong>Кількість:</strong> ${good.stock}</p>

      <div class="card-buttons">
        <button type="button" class="add-to-cart-btn">Додати в кошик</button>
        ${adminButtons}
      </div>
    `;

    const deleteBtn = goodCard.querySelector(".delete-btn");
    const editBtn = goodCard.querySelector(".edit-btn");
    const addToCartBtn = goodCard.querySelector(".add-to-cart-btn");

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        addToCart(good.id);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        deleteGood(good.id);
      });
    }

    if (editBtn) {
      editBtn.addEventListener("click", () => {
        fillFormForEdit(good.id);
      });
    }

    goodsList.append(goodCard);
  });
}

function renderTotals(items) {
  const totalGoods = document.getElementById("totalGoods");
  const totalValue = document.getElementById("totalValue");

  totalGoods.textContent = items.length;

  const sum = items.reduce((total, good) => {
    return total + good.price * good.stock;
  }, 0);

  totalValue.textContent = sum;
}

//======== DELETE GOODS ========
async function deleteGood(id) {
  console.log("Deleting good id:", id);

  try {
    const response = await fetch(`${GOODS_API_URL}/${id}`, {
      method: "DELETE",
     headers: Auth.getAuthHeaders()
    });

    const data = await response.json();

    console.log("DELETE /goods status:", response.status);
    console.log("DELETE /goods data:", data);

    if (!response.ok) {
      alert(data.message || "Не вдалося видалити товар");
      return;
    }

    await loadGoodsFromApi();
  } catch (error) {
    console.error("Delete good ERROR:", error);
    alert("Помилка видалення товару");
  }
}

//======SUBMIT =======
function fillFormForEdit(id) {
  const good = goods.find((good) => good.id == id);

  if (!good) return;

  editingGoodId = good.id;
  goodIdInput.value = good.id;

  console.log("fillFormForEdit editingGoodId:", editingGoodId);

  nameInput.value = good.name;
  brandInput.value = good.brand;
  priceInput.value = good.price;
  categoryInput.value = good.category;
  sizeInput.value = good.size;
  colorInput.value = good.color;
  stockInput.value = good.stock;
  imageUrlInput.value = good.imageUrl;
}

function sortGoods(items) {
  const sortValue = sortSelect.value;
  const sortedGoods = [...items];

  if (sortValue === "name-asc") {
    sortedGoods.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sortValue === "name-desc") {
    sortedGoods.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (sortValue === "price-asc") {
    sortedGoods.sort((a, b) => a.price - b.price);
  }

  if (sortValue === "price-desc") {
    sortedGoods.sort((a, b) => b.price - a.price);
  }

  return sortedGoods;
}

function updateView() {
  const query = searchInput.value.trim().toLowerCase();

  let filteredGoods = goods.filter((good) => {
    return good.name.toLowerCase().includes(query);
  });

  if (selectedCategory !== "all") {
    filteredGoods = filteredGoods.filter((good) => {
      return good.category === selectedCategory;
    });
  }

  const sortedGoods = sortGoods(filteredGoods);

  renderGoods(sortedGoods);
  renderTotals(sortedGoods);
}

// ----- AUTH UI FUNCTIONS -----
function updateAuthUI() {
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

// ----- ORDERS FUNCTIONS -----
function renderOrders(orders) {
  if (!ordersList) return;

  ordersList.innerHTML = "";

  if (!orders || orders.length === 0) {
    ordersList.innerHTML = "<p>У вас поки немає замовлень.</p>";
    return;
  }

  orders.forEach((order) => {
    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");

    const itemsHtml = order.items
      .map((item) => {
        return `
        <li>
          Товар ID: ${item.goodId}, кількість: ${item.quantity}
        </li>
      `;
      })
      .join("");

    orderCard.innerHTML = `
      <h3>Замовлення #${order.id}</h3>
      <p><strong>Клієнт:</strong> ${order.customerName}</p>
      <p><strong>Статус:</strong> ${order.status}</p>
      <p><strong>Загальна сума:</strong> ${order.totalPrice} грн</p>
      <p><strong>Товари:</strong></p>
      <ul>${itemsHtml}</ul>
    `;

    ordersList.append(orderCard);
  });
}

 function addToCart(goodId) {
      console.log("Adding to cart, goodId:", goodId);

      const good = goods.find((item) => item.id === goodId);

      if (!good) {
        alert("Товар не знайдено");
        return;
      }

      const existingItem = cart.find((item) => item.goodId === goodId);

      if (existingItem) {
        existingItem.quantity += 1;
        saveCart();
      } else {
        cart.push({
          goodId: good.id,
          name: good.name,
          price: good.price,
          quantity: 1,
        });

        saveCart();
      }

      console.log("Cart:", cart);
      renderCart();
    }

    function renderCart() {
      if (!cartList || !cartTotal) return;

      cartList.innerHTML = "";

      if (cart.length === 0) {
        cartList.innerHTML = "<p>Кошик порожній.</p>";
        cartTotal.textContent = "0";
        return;
      }

      cart.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
      <p><strong>${item.name}</strong></p>
      <p>Ціна: ${item.price} грн</p>
      <p>Кількість: ${item.quantity}</p>
      <p>Сума: ${item.price * item.quantity} грн</p>
      <button type="button" class="remove-from-cart-btn">Видалити</button>
    `;

        const removeBtn = cartItem.querySelector(".remove-from-cart-btn");

        removeBtn.addEventListener("click", () => {
          removeFromCart(item.goodId);
        });

        cartList.append(cartItem);
      });

      const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);

      cartTotal.textContent = total;
    }

    function removeFromCart(goodId) {
      cart = cart.filter((item) => item.goodId !== goodId);
      saveCart();
      console.log("Cart after remove:", cart);
      renderCart();
    }

async function loadMyOrders() {
  console.log("Loading my orders...");

  if (!Auth.isAuthenticated()) {
    alert("Спочатку увійдіть в акаунт");
    return;
  }

  try {
    const response = await fetch(
      "https://r211anoshk.execute-api.eu-north-1.amazonaws.com/vikki-chic-boutique-api/orders",
      {
        method: "GET",
        headers: Auth.getAuthHeaders(),
      },
    );

    console.log("Orders response status:", response.status);

    const data = await response.json();

    console.log("Orders response data:", data);

    if (!response.ok) {
      alert(data.message || "Помилка завантаження замовлень");
      return;
    }

    if (ordersSection) {
      ordersSection.style.display = "block";
    }

    renderOrders(data);
    ordersSection.scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    console.error("Load orders ERROR:", error);
    alert("Не вдалося завантажити замовлення");
  }
}

function clearOrders() {
  if (ordersList) {
    ordersList.innerHTML = "";
  }

  if (ordersSection) {
    ordersSection.style.display = "none";
  }
}

// -----GOOD FORM-----
goodForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const imageValue = imageUrlInput.value.trim();

  const goodData = {
    name: nameInput.value.trim(),
    brand: brandInput.value.trim(),
    price: Number(priceInput.value),
    category: categoryInput.value.trim(),
    size: sizeInput.value.trim(),
    color: colorInput.value.trim(),
    stock: Number(stockInput.value),
    imageUrl: imageValue
  };

  console.log("Submitting good:", goodData);
  console.log("editingGoodId before submit:", editingGoodId);

  try {
    let response;

    if (editingGoodId) {
      console.log("PUT branch");

      response = await fetch(`${GOODS_API_URL}/${editingGoodId}`, {
        method: "PUT",
        headers: Auth.getAuthHeaders(),
        body: JSON.stringify(goodData)
      });
    } else {
      console.log("POST branch");

      response = await fetch(GOODS_API_URL, {
        method: "POST",
        headers: Auth.getAuthHeaders(),
        body: JSON.stringify(goodData)
      });
    }

    const data = await response.json();

    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (!response.ok) {
      alert(data.message || "Помилка");
      return;
    }

    goodForm.reset();
    goodIdInput.value = "";
    editingGoodId = null;

    await loadGoodsFromApi();
  } catch (error) {
    console.error("Submit ERROR:", error);
    alert("Помилка");
  }
});

// ----- FILTERS -----
searchInput.addEventListener("input", updateView);
sortSelect.addEventListener("change", updateView);

categoryCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectedCategory = card.dataset.category;
    updateView();
  });
});

// ----- BUTTONS -----
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    console.log("Logout button clicked");

    Auth.logout();
    clearOrders();
    updateAuthUI();

    alert("Ви вийшли з акаунта");
  });
}

if (myOrdersBtn) {
  myOrdersBtn.addEventListener("click", async () => {
    console.log("My orders button clicked");
    await loadMyOrders();
  });
}

// ======функція кошик======
async function createOrderFromCart() {
  console.log("Creating order from cart:", cart);

  if (!Auth.isAuthenticated()) {
    alert("Спочатку увійдіть в акаунт");
    return;
  }

  if (cart.length === 0) {
    alert("Кошик порожній");
    return;
  }

  const items = cart.map(item => ({
    goodId: item.goodId,
    quantity: item.quantity
  }));

  try {
    const response = await fetch(
      "https://r211anoshk.execute-api.eu-north-1.amazonaws.com/vikki-chic-boutique-api/orders",
      {
        method: "POST",
        headers: Auth.getAuthHeaders(),
        body: JSON.stringify({ items }),
      }
    );

    console.log("Create order status:", response.status);

    const data = await response.json();

    console.log("Create order response:", data);

    if (!response.ok) {
      alert(data.message || "Помилка створення замовлення");
      return;
    }

    alert("Замовлення оформлено!");

    cart = [];          // очищаємо кошик
    saveCart();         // зберігаємо порожній кошик
    renderCart();       // оновлюємо UI

    await loadMyOrders();

  } catch (error) {
    console.error("Create order ERROR:", error);
    alert("Не вдалося створити замовлення");
  }
}

// ----- INIT -----
loadCart();
updateAuthUI();
renderCart();
loadGoodsFromApi();