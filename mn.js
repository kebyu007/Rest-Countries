
const input = document.querySelector(".input");
// const btn = document.querySelector(".btn");
const countrydiv = document.querySelector(".box");

// const themeBtn = document.querySelector("#themeBtn");
// const body = document.body;

// themeBtn.addEventListener("click", () => {
//   body.classList.toggle("dark");

//   const isDark = body.classList.contains("dark");

//   themeBtn.innerHTML = isDark
//     ? `<span><i class="fa-regular fa-sun"></i></span> Light Mode`
//     : `<span><i class="fa-regular fa-moon"></i></span> Dark Mode`;
// });

class NotFoundException extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundException";
  }
}

async function fetchCountry(name) {
  const res = await fetch(`https://restcountries.com/v3.1/name/${name}`);

  if (!res.ok) {
    throw new NotFoundException("Davlat topilmadi");
  }

  const data = await res.json();
  renderCountry(data);
}

function renderCountry(arr) {
  countrydiv.innerHTML = "";

  // countrydiv.style.display = "block";
  arr.forEach((item) => {
    countrydiv.innerHTML += `
    <div class="product-card" data-code="${item.cca3}">
    <div class="flags">
    <img src="${item.flags.png}"></div>
    <div class="sources">
    <h3>${item.name.official}</h3>
    <ul>
    <li><b>Population:</b> ${item.population.toLocaleString()}</li>
    <li><b>Region: </b>${item.region}</li>
    <li id="extra"><b>Capital:</b> ${item.capital}</li>
    </ul></div>
    </div>
    `;
  });
}

  async function handleSearch() {
    const name = input.value.trim();
    if (!name) return;

    // countrydiv.style.display = "block";
    countrydiv.innerHTML = "Yuklanmoqda...";

    try {
      await fetchCountry(name);
    } catch (err) {
      countrydiv.innerHTML = `<p style="color:red; font-weight:bold;">${err.message}</p>`;
    }
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
////////////////--------------------------------------\\\\\\\\\\\\\\\\\\\\\\\\

// const box = document.querySelector(".products-grid");

let productArr = [];
async function products() {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3",
    { method: "GET" },
  );
  productArr = await res.json();
  // console.log(productArr[0])
  allcountry(productArr)
  // allcountry(productArr);
}
products();

// console.log(productArr);

function allcountry(data) {
  let html = "";

  data.forEach((item) => {
    html += `
      <div class="product-card" data-code="${item.cca3}">
        <div class="flags">
          <img src="${item.flags.svg}">
        </div>
        <div class="sources">
          <h3>${item.name.official}</h3>
          <ul>
            <li><b>Population:</b> ${item.population.toLocaleString()}</li>
            <li><b>Region:</b> ${item.region}</li>
            <li><b>Capital:</b> ${item.capital}</li>
          </ul>
        </div>
      </div>
    `;
  });

  countrydiv.innerHTML = html;
}

countrydiv.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const code = card.dataset.code;
  window.location.href = `extra.html?code=${code}`;
});

const sortSelect = document.querySelector("#sort");

sortSelect.addEventListener("change", () => {
  const selectedVal = sortSelect.value;

  // console.log(selectedVal);

  if (selectedVal === "default") {
    countrydiv.innerHTML = "";
    allcountry(productArr);
  } else if (selectedVal === "africa") {
    countrydiv.innerHTML = "";
    allcountry(productArr.filter(item=>item.region==='Africa'));
    // console.log(productArr.map(item => item.region));
  } else if (selectedVal === "america") {
    countrydiv.innerHTML = "";
    allcountry(productArr.filter(item=>item.region==='Americas'));
  } else if (selectedVal === "europe") {
    countrydiv.innerHTML = "";
    allcountry(productArr.filter(item=>item.region==='Europe'));
  } else if (selectedVal === "asia") {
    countrydiv.innerHTML = "";
    allcountry(productArr.filter(item=>item.region==='Asia'));
  }
});
