// 📌 lirium.js
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  resumen.innerHTML = "<p>Cargando datos de Lirium...</p>";

  try {
    const RES_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec?accion=actualizar";  
    const res = await fetch(RES_URL);
    const data = await res.json();

    if (data.error) {
      // ⚠️ Mostrar error recibido de la API
      resumen.innerHTML = `<p>⚠️ Error al cargar Lirium: ${data.error}</p>`;
      return;
    }

    if (data.lirium) {
      const lirium = data.lirium;
      const fechaStr = lirium.ultimoAgregado || "Sin datos";

      // Solo actualizamos el div resumen, no la tabla de CVU
      resumen.innerHTML = `
        <h2>Clientes Lirium</h2>
        <table>
          <tr><td>Cantidad</td><td>${lirium.cantidad || 0}</td></tr>
          <tr><td>Total ARSD</td><td>$ ${Number(lirium.totalARSD || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
          <tr><td>Total USDC</td><td>${Number(lirium.totalUSDC || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
          <tr><td>Saldo Reddy ARSD</td><td>$ ${Number(lirium.saldoReddy || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
          <tr><td>Último agregado</td><td>${fechaStr}</td></tr>
        </table>
      `;
    } else {
      resumen.innerHTML = `<p>⚠️ No se obtuvieron datos de Lirium</p>`;
    }

  } catch (err) {
    console.error(err);

    // Mostrar error detallado en la web
    let msg = "❌ Error de red o API";
    if (err.message) msg += `: ${err.message}`;
    resumen.innerHTML = `<p>${msg}</p>`;
  }
});
