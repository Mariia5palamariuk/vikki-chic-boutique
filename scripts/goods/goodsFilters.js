import { goods, selectedCategory } from "../state/appState.js";
import { searchInput, sortSelect } from "../ui/dom.js";
import { renderGoods, renderTotals } from "./goodsRender.js";

export function sortGoods(items) {
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

export function updateView() {
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