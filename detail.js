const params = new URLSearchParams(window.location.search);
const backbtn = document.querySelector('#back');
const detailRoot = document.querySelector('#detail');

let currentCode = (params.get('code') || '').toUpperCase();

if (!currentCode) {
  document.body.innerHTML = '<h2>Davlat topilmadi</h2>';
  throw new Error('Code yo‘q');
}

function renderCountry(country, borderMeta) {
  const nativeName = country.name?.nativeName
    ? Object.values(country.name.nativeName)[0]?.official
    : 'Noma’lum';

  const currencies = Object.values(country.currencies || {})
    .map((c) => c.name)
    .join(', ') || 'Noma’lum';

  const languages = Object.values(country.languages || {}).join(', ') || 'Noma’lum';

  const borders = country.borders || [];
  const borderButtons = borders.length
    ? borders
        .map((b) => {
          const label = borderMeta.get(b)?.name?.common || b;
          return `<button class="border-btn" data-code="${b}" type="button">${label}</button>`;
        })
        .join('')
    : '<span class="no-borders">Chegaradosh davlat yo‘q</span>';

  detailRoot.innerHTML = `
    <div class="fimg">
      <img src="${country.flags?.svg || ''}" alt="${country.name?.common || 'Country'}" />
    </div>
    <div class="flexal">
      <div class="detailss">
        <h2>${country.name?.common || 'Noma’lum'}</h2>
        <p><b>Native Name:</b> ${nativeName}</p>
        <p><b>Population:</b> ${(country.population || 0).toLocaleString()}</p>
        <p><b>Region:</b> ${country.region || "Noma'lum"}</p>
        <p><b>Sub Region:</b> ${country.subregion || "Noma'lum"}</p>
        <p><b>Capital:</b> ${country.capital?.[0] || "Noma'lum"}</p>
      </div>
      <div class="ext">
        <p id="tld"><b>Top Level Domain:</b> ${country.tld?.join(', ') || "Noma'lum"}</p>
        <p><b>Currencies:</b> ${currencies}</p>
        <p><b>Languages:</b> ${languages}</p>
        <div class="borders-wrap">
          <b>Border Countries:</b>
          <div class="borders-list">${borderButtons}</div>
        </div>
      </div>
    </div>
  `;
}

async function fetchBorderMeta(codes) {
  if (!codes.length) return new Map();

  try {
    const res = await fetch(`https://restcountries.com/v3.1/alpha?codes=${codes.join(',')}&fields=cca3,name`);
    if (!res.ok) return new Map();
    const data = await res.json();
    return new Map(data.map((item) => [item.cca3, item]));
  } catch {
    return new Map();
  }
}

async function loadCountry(code, push = false) {
  try {
    const targetCode = code.toUpperCase();
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${targetCode}`);
    if (!res.ok) throw new Error('Davlat ma’lumoti yuklanmadi');

    const [country] = await res.json();
    const borderMeta = await fetchBorderMeta(country.borders || []);

    currentCode = targetCode;

    if (!history.state || history.state.code !== targetCode) {
      if (push) {
        const depth = (history.state?.depth || 0) + 1;
        history.pushState({ code: targetCode, depth }, '', `extra.html?code=${targetCode}`);
      } else {
        history.replaceState({ code: targetCode, depth: history.state?.depth || 0 }, '', `extra.html?code=${targetCode}`);
      }
    }

    renderCountry(country, borderMeta);
  } catch (error) {
    detailRoot.innerHTML = `<p class="empty-msg">${error.message}</p>`;
  }
}

loadCountry(currentCode);

window.addEventListener('popstate', (event) => {
  const nextCode = event.state?.code || new URLSearchParams(window.location.search).get('code');
  if (nextCode) {
    loadCountry(nextCode, false);
  }
});

detailRoot.addEventListener('click', (e) => {
  const btn = e.target.closest('.border-btn');
  if (!btn) return;

  const nextCode = btn.dataset.code;
  if (!nextCode || nextCode === currentCode) return;
  loadCountry(nextCode, true);
});

backbtn.addEventListener('click', () => {
  const depth = history.state?.depth || 0;
  if (depth > 0) {
    history.back();
  } else {
    window.location.href = 'index.html';
  }
});
