const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwnDgsbRhI7skgh64bXnYPCN2iPKy09ZKecJVGAPkyO6klxXWjJ7ESsUaGHYqbfUrLU0A/exec"; // Ej: https://script.google.com/macros/s/AKfycb.../exec

document.getElementById("btnCargar").addEventListener("click", async () => {
  try {
    const res = await fetch(WEBAPP_URL);
    const data = await res.json();

    const cuerpo = document.getElementById("cuerpo");
    cuerpo.innerHTML = "";

    if (data.error) {
      cuerpo.innerHTML = `<tr><td>Error: ${data.error}</td></tr>`;
    } else {
      cuerpo.innerHTML = `<tr><td>Saldo actual CVU:</td><td>${data.saldo}</td></tr>`;
    }
  } catch (err) {
    console.error(err);
    document.getElementById("cuerpo").innerHTML = `<tr><td>Error de red</td></tr>`;
  }
});
