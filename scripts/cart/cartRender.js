import { cart } from "../state/appState.js";
import { cartList, cartTotal } from "../ui/dom.js";
import { removeFromCart } from "./cartActions.js";

export function renderCart() {
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