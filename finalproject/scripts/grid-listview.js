const gridBtn = document.getElementById("gridView");
const listBtn = document.getElementById("listView");
const container = document.getElementById("playground-container");

gridBtn.addEventListener("click", () => {
  container.classList.add("grid-view");
  container.classList.remove("list-view");
  gridBtn.classList.add("active");
  listBtn.classList.remove("active");
});

listBtn.addEventListener("click", () => {
  container.classList.add("list-view");
  container.classList.remove("grid-view");
  listBtn.classList.add("active");
  gridBtn.classList.remove("active");
});
