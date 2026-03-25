import { cart, setCart } from "../state/appState.js";

export function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function loadCart() {
  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    setCart(JSON.parse(savedCart));
  }
}