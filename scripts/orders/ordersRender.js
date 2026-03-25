import { ordersList, ordersSection } from "../ui/dom.js";

export function renderOrders(orders) {
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

export function clearOrders() {
  if (ordersList) {
    ordersList.innerHTML = "";
  }

  if (ordersSection) {
    ordersSection.style.display = "none";
  }
}