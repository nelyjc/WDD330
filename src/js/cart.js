import { getLocalStorage } from "./utils.mjs";
import { renderListWithTemplate } from "./utils.mjs";
import cartItemTemplate from "./cartItemTemplate.mjs";

const cartItems = getLocalStorage("so-cart") || [];
const cartElement = document.querySelector(".product-list");

if (!cartItems.length) {
  cartElement.innerHTML = "<p>Your cart is empty.</p>";
} else {
  renderListWithTemplate(cartItemTemplate, cartElement, cartItems);
}
