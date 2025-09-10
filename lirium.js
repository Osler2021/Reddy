// 📌 lirium.js (versión con polling seguro, progreso en tiempo real y contador)
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  resumen.innerHTML = "<p>⏳ Iniciando carga de datos de Lirium...</p>";

  try {
    const BASE_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec";

    // --- Paso 1: iniciar actualización ---
    resumen.innerHTML = "<p>🔄 Solicitando actualización de datos...</p>";
    const resUpdate = await fetch(`${BASE_URL}?accion=actualizar`, { cache: "no-store" });
    const dataUpdate = await resUpdate.json();
    if (dataUpdate.error) {
      resumen.innerHTML = `<p>⚠️ Error al solicitar actualización: ${dataUpdate.error}</p>`;
      return;
    }

    // --- Paso 2: polling con contador de tiempo ---
    const maxAttempts = 40;   // total de intentos (~1 minuto)
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

      const cantidad = Number(data.lirium?.cantidad || 0);
      const totalARSD = Number(data.lirium?.totalARSD || 0);
      const totalUSDC = Number(data.lirium?.totalUSDC || 0);
      const tiempoRestante = Math.max(0, Math.ceil((maxAttempts - i) * (delayMs / 1000)));

      // Mostrar progreso solo si cambió la cantidad
      if (cantidad !== lastCantidad) {
        resumen.innerHTML = `<p>📡 Descargando clientes... ${cantidad} clientes cargados<br>⏱ Tiempo restante aprox.: ${tiempoRestante} seg</p>`;
        lastCantidad = cantidad;
      } else {
        resumen.innerHTML = `<p>📡 Esperando datos... ${cantidad} clientes cargados<br>⏱ Tiempo restante aprox.: ${tiempoRestante} seg</p>`;
      }

      // Si ya hay clientes y montos cargados, terminamos
      if (cantidad > 0 && (totalARSD > 0 || totalUSDC > 0)) break;

      await new Promise(r => setTimeout(r, delayMs));
    }

    console.log("Datos finales:", data);

    // --- Render final ---
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
        <tr><td>Total ARSD</td><td>$ ${totalARSD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
        <tr><td>Total USDC</td><td>${totalUSDC.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
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
