const input = document.querySelector(".input");
const countrydiv = document.querySelector(".box");
const sortSelect = document.querySelector("#sort");
const pagination = document.querySelector("#pagination");
const stats = document.querySelector("#stats");

const ITEMS_PER_PAGE = 12;
let productArr = [];
let filteredArr = [];
let currentPage = 1;

class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundException";
  }
}

function updateStats(showing, total, mode = "list") {
  if (!stats) return;

  if (mode === "search") {
    stats.textContent = `Qidiruv natijasi: ${showing} ta, jami: ${total} ta davlat.`;
    return;
  }

  stats.textContent = `Ko‘rsatilmoqda: ${showing} / ${total} ta davlat.`;
}

function renderCountry(arr) {
  countrydiv.innerHTML = "";

  if (!arr.length) {
    countrydiv.innerHTML = `<p class="error-text">Davlat topilmadi</p>`;
    return;
  }

  arr.forEach((item) => {
    countrydiv.innerHTML += `
      <div class="product-card" data-code="${item.cca3}">
        <div class="flags">
          <img src="${item.flags.svg || item.flags.png}" alt="${item.name.official}">
        </div>
        <div class="sources">
          <h3>${item.name.official}</h3>
          <ul>
            <li><b>Population:</b> ${item.population.toLocaleString()}</li>
            <li><b>Region:</b> ${item.region}</li>
            <li id="extra"><b>Capital:</b> ${item.capital?.[0] || "Noma'lum"}</li>
          </ul>
        </div>
      </div>
    `;
  });
}

function renderPagination() {
  const totalPages = Math.ceil(filteredArr.length / ITEMS_PER_PAGE);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let html = "";

  for (let i = 1; i <= totalPages; i += 1) {
    html += `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  }

  pagination.innerHTML = html;
}

function renderCurrentPage() {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageData = filteredArr.slice(start, end);

  renderCountry(pageData);
  renderPagination();
  updateStats(pageData.length, filteredArr.length, "list");
}

async function fetchCountry(name) {
  const res = await fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,flags,population,region,capital,cca3`);

  if (!res.ok) {
    throw new NotFoundException("Davlat topilmadi");
  }

  const data = await res.json();
  renderCountry(data);
  pagination.innerHTML = "";
  updateStats(data.length, productArr.length, "search");
}

async function handleSearch() {
  const name = input.value.trim();

  if (!name) {
    filteredArr = [...productArr];
    currentPage = 1;
    renderCurrentPage();
    return;
  }

  countrydiv.innerHTML = "Yuklanmoqda...";

  try {
    await fetchCountry(name);
  } catch (err) {
    countrydiv.innerHTML = `<p class="error-text">${err.message}</p>`;
    pagination.innerHTML = "";
    updateStats(0, productArr.length, "search");
  }
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

async function products() {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3",
    { method: "GET" },
  );

  productArr = await res.json();
  filteredArr = [...productArr];
  currentPage = 1;
  renderCurrentPage();
}

products();

countrydiv.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const code = card.dataset.code;
  window.location.href = `extra.html?code=${code}`;
});

pagination.addEventListener("click", (e) => {
  const btn = e.target.closest(".page-btn");
  if (!btn) return;

  currentPage = Number(btn.dataset.page);
  renderCurrentPage();
});

sortSelect.addEventListener("change", () => {
  const selectedVal = sortSelect.value;

  if (selectedVal === "default") {
    filteredArr = [...productArr];
  } else if (selectedVal === "africa") {
    filteredArr = productArr.filter((item) => item.region === "Africa");
  } else if (selectedVal === "america") {
    filteredArr = productArr.filter((item) => item.region === "Americas");
  } else if (selectedVal === "europe") {
    filteredArr = productArr.filter((item) => item.region === "Europe");
  } else if (selectedVal === "asia") {
    filteredArr = productArr.filter((item) => item.region === "Asia");
  }

  currentPage = 1;
  renderCurrentPage();
});
