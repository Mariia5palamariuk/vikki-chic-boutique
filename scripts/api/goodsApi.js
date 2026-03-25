import { setGoods } from "../state/appState.js";
import { updateView } from "../goods/goodsFilters.js";

export const GOODS_API_URL =
  "https://r211anoshk.execute-api.eu-north-1.amazonaws.com/vikki-chic-boutique-api/goods";

export async function loadGoodsFromApi() {
  console.log("Loading goods from API...");

  try {
    const response = await fetch(GOODS_API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Goods response status:", response.status);

    const data = await response.json();

    console.log("Goods response data:", data);

    if (!response.ok) {
      alert("Не вдалося завантажити товари");
      return;
    }

    const normalizedGoods = data.map((item) => ({
      id: item.id,
      name: item.name,
      brand: item.brand || "Без бренду",
      price: Number(item.price) || 0,
      category: item.category || "",
      size: item.size || "-",
      color: item.color || "-",
      stock: Number(item.stock) || 0,
      imageUrl: item.imageUrl || "./assets/dress.jpg",
    }));

    setGoods(normalizedGoods);
    updateView();
  } catch (error) {
    console.error("Load goods ERROR:", error);
    alert("Помилка завантаження товарів");
  }
}

export async function deleteGood(id) {
  console.log("Deleting good id:", id);

  try {
    const response = await fetch(`${GOODS_API_URL}/${id}`, {
      method: "DELETE",
      headers: Auth.getAuthHeaders(),
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