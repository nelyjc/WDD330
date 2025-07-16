import { getLocalStorage } from "./utils.mjs";
import { renderListWithTemplate } from "./utils.mjs";
import cartItemTemplate from "./cartItemTemplate.mjs"; 

const cartElement = document.querySelector(".product-list");

if (!cartItems.length) {
  cartElement.innerHTML = "<p>Your cart is empty.</p>";
} else {
  renderListWithTemplate(cartItemTemplate, cartElement, cartItems);
}


function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
