export let goods = [];
export let cart = [];
export let editingGoodId = null;
export let selectedCategory = "all";

export function setGoods(newGoods) {
  goods = newGoods;
}

export function setCart(newCart) {
  cart = newCart;
}

export function setEditingGoodId(id) {
  editingGoodId = id;
}

export function setSelectedCategory(category) {
  selectedCategory = category;
}