// 📌 lirium.js
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  resumen.innerHTML = "<p>⏳ Iniciando carga de datos de Lirium...</p>";

  try {
    const BASE_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec";

    // 1️⃣ Paso 1: actualizar datos
    resumen.innerHTML = "<p>🔄 Actualizando información desde Lirium...</p>";
    const resUpdate = await fetch(`${BASE_URL}?accion=actualizar`);
    const dataUpdate = await resUpdate.json();

    if (dataUpdate.error) {
      let msg = `⚠️ Error al actualizar: ${dataUpdate.error}`;
      if (dataUpdate.error.includes("jwt_expired")) {
        msg += " — Tu token expiró, por favor genera uno nuevo.";
      }
      resumen.innerHTML = `
        <h2>Clientes Lirium</h2>
        <p>${msg}</p>
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

    // 2️⃣ Paso 2: consultar datos persistidos
    resumen.innerHTML = "<p>📊 Consultando datos guardados...</p>";
    const res = await fetch(`${BASE_URL}?accion=consultar`);
    const data = await res.json();
    console.log("Respuesta API:", data);

    // ⚠️ Si hay error en la consulta
    if (data.error) {
      resumen.innerHTML = `
        <h2>Clientes Lirium</h2>
        <p>⚠️ Error al cargar datos: ${data.error}</p>
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

    // ✅ Si hay datos válidos
    if (data.lirium) {
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
    } else {
      // 🚫 Caso sin datos de Lirium
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
    }

  } catch (err) {
    console.error(err);

    resumen.innerHTML = `
      <h2>Clientes Lirium</h2>
      <p>❌ Error de red o API: ${err.message || err}</p>
      <table>
        <tr><td>Cantidad</td><td>0</td></tr>
        <tr><td>Total ARSD</td><td>$ 0,00</td></tr>
        <tr><td>Total USDC</td><td>0</td></tr>
        <tr><td>Saldo Reddy ARSD</td><td>$ 0,00</td></tr>
        <tr><td>Último agregado</td><td>Sin datos</td></tr>
      </table>
    `;
  }
});
