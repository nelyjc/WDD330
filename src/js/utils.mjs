// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product
}

// export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
//   // if clear is true we need to clear out the contents of the parent.
//   if (clear) {
//     parentElement.innerHTML = "";
//   }
//   const htmlStrings = list.map(templateFn).join("");
//   parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
// }

/**
 * Renders a list of items into the DOM using a provided template function.
 * @param {Function} templateFn - A function that returns an HTML string for each item.
 * @param {Element} parentElement - The DOM element to insert the HTML into.
 * @param {Array} list - The list of data items to render.
 * @param {string} [position="afterbegin"] - Where to insert the HTML in the parent element.
 * @param {boolean} [clear=false] - Whether to clear the contents of the element before inserting.
 */
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) {
    parentElement.innerHTML = "";
  }

  const htmlStrings = list.map(templateFn).join('');
  parentElement.insertAdjacentHTML(position, htmlStrings);
}
