import ProductData from './js/ProductData.mjs';
const dataSource = new ProductData('tents');

import ProductList from './js/ProductList.mjs';

const tentListElement = document.querySelector('.product-list');
const tentList = new ProductList('tents', dataSource, tentListElement);
tentList.init();
