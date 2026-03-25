import { loadCart } from "./cart/cartStorage.js";
import { renderCart } from "./cart/cartRender.js";
import { createOrderFromCart } from "./cart/cartActions.js";
import { updateAuthUI } from "./auth/authUi.js";
import { clearOrders } from "./orders/ordersRender.js";
import { loadMyOrders } from "./api/ordersApi.js";
import { loadGoodsFromApi } from "./api/goodsApi.js";
import { initGoodForm } from "./goods/goodsForm.js";
import { updateView } from "./goods/goodsFilters.js";
import { setSelectedCategory } from "./state/appState.js";
import {
  checkoutBtn,
  logoutBtn,
  myOrdersBtn,
  searchInput,
  sortSelect,
  categoryCards,
} from "./ui/dom.js";

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", createOrderFromCart);
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    console.log("Logout button clicked");

    Auth.logout();
    clearOrders();

    window.dispatchEvent(new CustomEvent("authChanged"));

    alert("Ви вийшли з акаунта");
  });
}

if (myOrdersBtn) {
  myOrdersBtn.addEventListener("click", async () => {
    console.log("My orders button clicked");
    await loadMyOrders();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", updateView);
}

if (sortSelect) {
  sortSelect.addEventListener("change", updateView);
}

categoryCards.forEach((card) => {
  card.addEventListener("click", () => {
    setSelectedCategory(card.dataset.category);
    updateView();
  });
});

window.addEventListener("authChanged", () => {
  console.log("authChanged received in main.js");
  updateAuthUI();
  updateView();
});

initGoodForm();

loadCart();
updateAuthUI();
renderCart();
loadGoodsFromApi();