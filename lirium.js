// 📌 lirium.js (versión con polling)
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  resumen.innerHTML = "<p>⏳ Iniciando carga de datos de Lirium...</p>";

  try {
    const BASE_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec";

    // Paso 1: pedir actualización
    resumen.innerHTML = "<p>🔄 Solicitando actualización...</p>";
    const resUpdate = await fetch(`${BASE_URL}?accion=actualizar`, { cache: "no-store" });
    const dataUpdate = await resUpdate.json();
    if (dataUpdate.error) {
      resumen.innerHTML = `<p>⚠️ Error al solicitar actualización: ${dataUpdate.error}</p>`;
      return;
    }

    // Paso 2: poll para consultar datos ya escritos en la hoja
    resumen.innerHTML = "<p>📡 Esperando datos (esto puede tardar unos segundos)...</p>";
    const maxAttempts = 15;   // total de intentos
    const delayMs = 2000;     // espera entre intentos (2 segundos)
    let data = null;
    for (let i = 0; i < maxAttempts; i++) {
      const res = await fetch(`${BASE_URL}?accion=consultar`, { cache: "no-store" });
      data = await res.json();

      // Si vino un error, lo cortamos
      if (data.error) {
        resumen.innerHTML = `<p>⚠️ Error al consultar datos: ${data.error}</p>`;
        return;
      }

      if (data.lirium && data.lirium.cantidad && Number(data.lirium.cantidad) > 0) {
        break; // ya tenemos datos
      }

      // si no hay datos aún, esperar y reintentar
      await new Promise(r => setTimeout(r, delayMs));
    }

    console.log("Resultado final de consultar:", data);

    // Render final (igual a tu versión original)
    if (!data || !data.lirium || Object.keys(data.lirium).length === 0) {
      resumen.innerHTML = `
        <h2>Clientes Lirium</h2>
        <p>⚠️ No se obtuvieron datos de Lirium.</p>
        <table>
          <tr><td>Cantidad</td><td>0</td></tr>
          <tr><td>Total ARSD</td><td>$ 0,00</td></tr>
          <tr><td>Total USDC</td><td>0</td></tr>
          <tr><td>Saldo Reddy ARSD</td><td>$ 0,00</td></tr>
          <tr><td>Último agregado</td><td>Sin datos</td></tr>
        </table>
      `;
      return;
    }

    const lirium = data.lirium;
    const fechaStr = lirium.ultimoAgregado || "Sin datos";
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
  } catch (err) {
    console.error(err);
    resumen.innerHTML = `
      <h2>Clientes Lirium</h2>
      <p>❌ Error de red o API: ${err.message || err}</p>
    `;
  }
});
