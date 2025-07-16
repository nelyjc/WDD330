import { getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductDetails from "./ProductDetails.mjs";
import { addProductToCart } from "./ProductDetails.mjs"; // or cartUtils.mjs

const dataSource = new ProductData("tents");
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();

async function addToCartHandler(e) {
  const id = e.target.dataset.id;
  if (!id) {
    console.error("Missing product ID.");
    return;
  }
  const product = await dataSource.findProductById(id);
  addProductToCart(product);
}

document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
