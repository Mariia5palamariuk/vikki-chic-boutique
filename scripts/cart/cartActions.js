import { goods, cart, setCart } from "../state/appState.js";
import { saveCart } from "./cartStorage.js";
import { renderCart } from "./cartRender.js";
import { loadMyOrders } from "../api/ordersApi.js";

export function addToCart(goodId) {
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

export function removeFromCart(goodId) {
  const newCart = cart.filter((item) => item.goodId !== goodId);
  setCart(newCart);
  saveCart();
  console.log("Cart after remove:", newCart);
  renderCart();
}

export async function createOrderFromCart() {
  console.log("Creating order from cart:", cart);

  if (!Auth.isAuthenticated()) {
    alert("Спочатку увійдіть в акаунт");
    return;
  }

  if (cart.length === 0) {
    alert("Кошик порожній");
    return;
  }

  const items = cart.map((item) => ({
    goodId: item.goodId,
    quantity: item.quantity,
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

    setCart([]);
    saveCart();
    renderCart();

    await loadMyOrders();
  } catch (error) {
    console.error("Create order ERROR:", error);
    alert("Не вдалося створити замовлення");
  }
}