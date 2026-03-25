import { goods, editingGoodId, setEditingGoodId } from "../state/appState.js";
import {
  goodForm,
  goodIdInput,
  nameInput,
  brandInput,
  priceInput,
  categoryInput,
  sizeInput,
  colorInput,
  stockInput,
  imageUrlInput,
} from "../ui/dom.js";
import { GOODS_API_URL, loadGoodsFromApi } from "../api/goodsApi.js";

export function fillFormForEdit(id) {
  const good = goods.find((good) => good.id == id);

  if (!good) return;

  setEditingGoodId(good.id);
  goodIdInput.value = good.id;

  console.log("fillFormForEdit editingGoodId:", good.id);

  nameInput.value = good.name;
  brandInput.value = good.brand;
  priceInput.value = good.price;
  categoryInput.value = good.category;
  sizeInput.value = good.size;
  colorInput.value = good.color;
  stockInput.value = good.stock;
  imageUrlInput.value = good.imageUrl;
}

export function initGoodForm() {
  if (!goodForm) return;

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
      imageUrl: imageValue,
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
          body: JSON.stringify(goodData),
        });
      } else {
        console.log("POST branch");

        response = await fetch(GOODS_API_URL, {
          method: "POST",
          headers: Auth.getAuthHeaders(),
          body: JSON.stringify(goodData),
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
      setEditingGoodId(null);

      await loadGoodsFromApi();
    } catch (error) {
      console.error("Submit ERROR:", error);
      alert("Помилка");
    }
  });
}