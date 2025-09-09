// 📌 lirium.js
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  resumen.innerHTML = "<p>Cargando datos de Lirium...</p>";

  try {
    const RES_URL = "https://script.google.com/macros/s/TU_WEBAPP/exec?accion=actualizar";  
    const res = await fetch(RES_URL);
    const data = await res.json();

    if (data.error) {
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
    }

  } catch (err) {
    console.error(err);
    resumen.innerHTML = `<p>❌ Error de red o API</p>`;
  }
});
