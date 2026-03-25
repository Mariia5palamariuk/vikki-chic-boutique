import { goodsList } from "../ui/dom.js";
import { isAdminUser } from "../auth/authUi.js";
import { addToCart } from "../cart/cartActions.js";
import { deleteGood } from "../api/goodsApi.js";
import { fillFormForEdit } from "./goodsForm.js";

export function renderGoods(items) {
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
      addToCartBtn.addEventListener("click", () => addToCart(good.id));
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => deleteGood(good.id));
    }

    if (editBtn) {
      editBtn.addEventListener("click", () => fillFormForEdit(good.id));
    }

    goodsList.append(goodCard);
  });
}

export function renderTotals(items) {
  const totalGoods = document.getElementById("totalGoods");
  const totalValue = document.getElementById("totalValue");

  totalGoods.textContent = items.length;

  const sum = items.reduce((total, good) => {
    return total + good.price * good.stock;
  }, 0);

  totalValue.textContent = sum;
}