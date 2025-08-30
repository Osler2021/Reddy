const WEBAPP_URL = "TU_URL_WEBAPP_DE_APPS_SCRIPT"; // Poné tu URL aquí

const btnCargar = document.getElementById("btnCargar");
const searchInput = document.getElementById("searchInput");
const cabecera = document.getElementById("cabecera");
const cuerpo = document.getElementById("cuerpo");

let movimientosGlobal = [];

btnCargar.addEventListener("click", cargarMovimientos);
searchInput.addEventListener("input", filtrarTabla);

async function cargarMovimientos() {
  cabecera.innerHTML = "";
  cuerpo.innerHTML = "";
  movimientosGlobal = [];

  try {
    const res = await fetch(WEBAPP_URL);
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      cuerpo.innerHTML = "<tr><td colspan='5'>No hay movimientos para mostrar</td></tr>";
      return;
    }

    movimientosGlobal = data;

    // Crear encabezados dinámicos
    const headers = Object.keys(data[0]);
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      cabecera.appendChild(th);
    });

    renderTabla(movimientosGlobal, headers);

  } catch (err) {
    cuerpo.innerHTML = `<tr><td colspan='5'>Error: ${err}</td></tr>`;
    console.error(err);
  }
}

function renderTabla(data, headers) {
  cuerpo.innerHTML = "";
  data.forEach(mov => {
    const tr = document.createElement("tr");
    headers.forEach(h => {
      const td = document.createElement("td");
      td.textContent = mov[h] ?? "";
      tr.appendChild(td);
    });
    cuerpo.appendChild(tr);
  });
}

function filtrarTabla() {
  const query = searchInput.value.toLowerCase();
  if (!query) {
    renderTabla(movimientosGlobal, Object.keys(movimientosGlobal[0] || {}));
    return;
  }

  const filtrados = movimientosGlobal.filter(mov =>
    Object.values(mov).some(v =>
      String(v).toLowerCase().includes(query)
    )
  );

  renderTabla(filtrados, Object.keys(movimientosGlobal[0] || {}));
}

