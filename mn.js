const input = document.querySelector('.input');
const countrydiv = document.querySelector('.box');
const sortSelect = document.querySelector('#sort');
const pagination = document.querySelector('#pagination');
const stats = document.querySelector('#stats');

const ITEMS_PER_PAGE = 12;
let productArr = [];
let filteredArr = [];
let currentPage = 1;

class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundException';
  }
}

function updateStats(showing, total, mode = 'list') {
  if (!stats) return;
  if (mode === 'search') {
    stats.textContent = `Qidiruv natijasi: ${showing} ta davlat topildi (jami ${total} ta).`;
    return;
  }
  stats.textContent = `Ko‘rsatilmoqda: ${showing} / ${total} ta davlat.`;
}

function cardTemplate(item) {
  return `
    <div class="product-card" data-code="${item.cca3}">
      <div class="flags">
        <img src="${item.flags?.svg || item.flags?.png || ''}" alt="${item.name?.official || 'Country'}" />
      </div>
      <div class="sources">
        <h3>${item.name?.official || 'Noma’lum'}</h3>
        <ul>
          <li><b>Population:</b> ${(item.population || 0).toLocaleString()}</li>
          <li><b>Region:</b> ${item.region || "Noma'lum"}</li>
          <li id="extra"><b>Capital:</b> ${item.capital?.[0] || "Noma'lum"}</li>
        </ul>
      </div>
    </div>
  `;
}

function renderCountry(arr, emptyMessage = 'Davlat topilmadi.') {
  if (!arr.length) {
    countrydiv.innerHTML = `<p class="empty-msg">${emptyMessage}</p>`;
    return;
  }
  countrydiv.innerHTML = arr.map(cardTemplate).join('');
}

function renderPagination() {
  const totalPages = Math.ceil(filteredArr.length / ITEMS_PER_PAGE);
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  const buttons = [];
  for (let i = 1; i <= totalPages; i += 1) {
    buttons.push(`<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`);
  }
  pagination.innerHTML = buttons.join('');
}

function renderCurrentPage() {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageData = filteredArr.slice(start, end);
  renderCountry(pageData, 'Tanlangan filter bo‘yicha davlat topilmadi.');
  renderPagination();
  updateStats(pageData.length, filteredArr.length, 'list');
}

async function fetchCountry(name) {
  const res = await fetch(
    `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fields=name,flags,population,region,capital,cca3`,
  );

  if (!res.ok) {
    throw new NotFoundException('Davlat topilmadi');
  }

  const data = await res.json();
  renderCountry(data);
  pagination.innerHTML = '';
  updateStats(data.length, productArr.length, 'search');
}

async function handleSearch() {
  const name = input.value.trim();
  if (!name) {
    filteredArr = [...productArr];
    currentPage = 1;
    renderCurrentPage();
    return;
  }

  countrydiv.innerHTML = 'Yuklanmoqda...';
  updateStats(0, productArr.length, 'search');

  try {
    await fetchCountry(name);
  } catch (err) {
    countrydiv.innerHTML = `<p class="empty-msg">${err.message || 'Xatolik yuz berdi'}</p>`;
    pagination.innerHTML = '';
    updateStats(0, productArr.length, 'search');
  }
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

async function products() {
  try {
    const res = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3',
      { method: 'GET' },
    );

    if (!res.ok) {
      throw new Error('Davlatlar ro‘yxati yuklanmadi');
    }

    productArr = await res.json();
    filteredArr = [...productArr];
    currentPage = 1;
    renderCurrentPage();
  } catch (error) {
    countrydiv.innerHTML = `<p class="empty-msg">${error.message}</p>`;
    pagination.innerHTML = '';
    updateStats(0, 0, 'list');
  }
}

products();

countrydiv.addEventListener('click', (e) => {
  const card = e.target.closest('.product-card');
  if (!card) return;

  const code = card.dataset.code;
  window.location.href = `extra.html?code=${code}`;
});

pagination.addEventListener('click', (e) => {
  const btn = e.target.closest('.page-btn');
  if (!btn) return;

  currentPage = Number(btn.dataset.page);
  renderCurrentPage();
});

sortSelect.addEventListener('change', () => {
  const selectedVal = sortSelect.value;

  if (selectedVal === 'default') {
    filteredArr = [...productArr];
  } else if (selectedVal === 'africa') {
    filteredArr = productArr.filter((item) => item.region === 'Africa');
  } else if (selectedVal === 'america') {
    filteredArr = productArr.filter((item) => item.region === 'Americas');
  } else if (selectedVal === 'europe') {
    filteredArr = productArr.filter((item) => item.region === 'Europe');
  } else if (selectedVal === 'asia') {
    filteredArr = productArr.filter((item) => item.region === 'Asia');
  }

  currentPage = 1;
  renderCurrentPage();
});
