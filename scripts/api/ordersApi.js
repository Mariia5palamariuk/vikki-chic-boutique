import { ordersSection } from "../ui/dom.js";
import { renderOrders } from "../orders/ordersRender.js";

export async function loadMyOrders() {
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
      }
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