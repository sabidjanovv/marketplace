const wrapper = document.querySelector(".wrapper");
const loading = document.querySelector(".loading");
const btn = document.querySelector(".btn");
const header = document.querySelector(".header");

const API_URL = "https://dummyjson.com";
let offset = 1;
let perPageCount = 4;
let closeButton = 0;
let total;
let ctg;
async function fetchData(api, callback) {
  loading.style.display = "flex";
  try {
    const response = await fetch(api);
    const data = await response.json();
    total = data.total;
    callback(data, total);
  } catch (err) {
    console.error(err);
  } finally {
    loading.style.display = "none";
  }
}

fetchData(`${API_URL}/products?limit=${perPageCount * offset}`, createCard);
fetchData(`${API_URL}/products/categories`, createCategories);
fetchData(`${API_URL}/products?limit=${perPageCount}`, (data) => {
  total = data.total; 
  createCard(data, total);
});

function getByCategory(category) {
  ctg = category;
  offset = 1; 
  closeButton = 0;
  btn.style.display = "block"; 
  const apiUrl =
    category === "all"
      ? `${API_URL}/products?limit=${perPageCount}`
      : `${API_URL}/products/category/${category}?limit=${perPageCount}`;
  fetchData(apiUrl, (data) => {
    total = category === "all" ? data.total : data.products.length; 
    createCard(data, total);
  });
  
}

function createCategories(categories) {
  while (header.firstChild) {
    header.firstChild.remove();
  }

  const allButton = document.createElement("button");
  allButton.textContent = "All";
  allButton.addEventListener("click", () => getByCategory("all"));
  header.appendChild(allButton);

  // Add buttons for each category
  categories.forEach((category) => {
    const categoryBtn = document.createElement("button");
    categoryBtn.textContent = category.slug; // Adjust if `category.slug` is used
    categoryBtn.addEventListener("click", () => getByCategory(category.slug));
    header.appendChild(categoryBtn);
  });
}

function createCard(data, total) {
  while (wrapper.firstChild) {
    wrapper.firstChild.remove();
  }
  //   console.log("123212345432234543==== ", total);
  data.products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
            <img src=${product.images[0]} alt="">
            <h3>${product.title}</h3>
            <strong>${product.price} USD</strong>
            <button>Buy now</button>
        `;
    wrapper.appendChild(card);
  });

  window.scrollTo(0, wrapper.scrollHeight);
}

function seeMore() {
  offset++;
  closeButton += perPageCount;

  const apiUrl =
    ctg === "all" || !ctg
      ? `${API_URL}/products?limit=${perPageCount * offset}`
      : `${API_URL}/products/category/${ctg}?limit=${perPageCount * offset}`;

  fetchData(apiUrl, createCard);

  if (closeButton >= total) {
    btn.style.display = "none";
  }
}
