// theme.js
const btn = document.querySelector(".btn");
const body = document.body;

// Sahifa ochilganda oldingi tanlovni tikla
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark");
  if (btn) {
    btn.innerHTML = `<span><i class="fa-regular fa-sun"></i></span> Light Mode`;
  }
}

// Tugma bo‘lsa — toggle qil
if (btn) {
  btn.addEventListener("click", () => {
    body.classList.toggle("dark");

    const isDark = body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    btn.innerHTML = isDark
      ? `<span><i class="fa-regular fa-sun"></i></span> Light Mode`
      : `<span><i class="fa-regular fa-moon"></i></span> Dark Mode`;
  });
}