const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const backbtn=document.querySelector("#back")

if (!code) {
  document.body.innerHTML = "<h2>Davlat topilmadi</h2>";
  throw new Error("Code yo‘q");
}

(async function fetchDetail() {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
  const [country] = await res.json();
  const nativeName = country.name?.nativeName
  ? Object.values(country.name.nativeName)[0]?.official
  : "Noma’lum";

  document.querySelector("#detail").innerHTML = `
    <div class="fimg">
      <img src="${country.flags.svg}"/>
    </div>
    <div class="flexal">
      <div class="detailss">
      <h2>${country.name.common}</h2>
      <p><b>Native Name:</b> ${nativeName}</p>
      <p><b>Population:</b> ${country.population.toLocaleString()}</p>
      <p><b>Region:</b> ${country.region}</p>
      <p><b>Sub Region:</b> ${country.subregion}</p>
      <p><b>Capital:</b> ${country.capital}</p>
      </div>
      <div class="ext">
      <p id="tld"><b>Top Level Domain:</b> ${country.tld}</p>
      <p><b>Currencies:</b> ${Object.values(country.currencies || {})
      .map((c) => c.name)
      .join(", ")
      .toUpperCase()}</p>
      <b>Languages:</b> ${Object.values(country.languages || {}).join(", ")}
      </div>
    </div>
  `;
})();

backbtn.addEventListener('click',()=>{
  window.location.href='index.html'
})
    