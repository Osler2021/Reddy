// 📌 lirium.js (versión con progreso en tiempo real)
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  resumen.innerHTML = "<p>⏳ Iniciando carga de datos de Lirium...</p>";

  try {
    const BASE_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec";

    // Paso 1: iniciar actualización
    resumen.innerHTML = "<p>🔄 Solicitando actualización de datos...</p>";
    await fetch(`${BASE_URL}?accion=actualizar`, { cache: "no-store" });

    // Paso 2: poll para consultar datos y mostrar progreso
    const maxAttempts = 30;   // número máximo de intentos
    const delayMs = 1500;     // intervalo entre intentos
    let data = null;
    let lastCantidad = 0;

    for (let i = 0; i < maxAttempts; i++) {
      const res = await fetch(`${BASE_URL}?accion=consultar`, { cache: "no-store" });
      data = await res.json();

      if (data.error) {
        resumen.innerHTML = `<p>⚠️ Error al consultar datos: ${data.error}</p>`;
        return;
      }

      const cantidad = data.lirium?.cantidad || 0;

      // Mostrar progreso aproximado
      if (cantidad !== lastCantidad) {
        resumen.innerHTML = `<p>📡 Descargando clientes... ${cantidad} clientes cargados</p>`;
        lastCantidad = cantidad;
      }

      // Si ya hay clientes, finalizamos
      if (cantidad > 0) {
        break;
      }

      await new Promise(r => setTimeout(r, delayMs));
    }

    console.log("Datos finales:", data);

    // Render final
    if (!data || !data.lirium || Number(data.lirium.cantidad) === 0) {
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
