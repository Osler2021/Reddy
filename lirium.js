/// 📌 lirium.js
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  resumen.innerHTML = "<p>Cargando datos de Lirium...</p>";

  try {
    // 1. Obtener token desde Render
    const tokenRes = await fetch("https://jwt-server-online.onrender.com/jwt");
    const tokenData = await tokenRes.json();
    const jwt = tokenData.jwt || tokenData.token || tokenData.access_token;

    if (!jwt) {
      throw new Error("No se pudo obtener JWT desde Render");
    }

    // 2. Llamar al GAS pasándole el token
    const RES_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec";  
    const res = await fetch(`${RES_URL}?accion=actualizar&jwt=${encodeURIComponent(jwt)}`);
    const data = await res.json();

    // 3. Procesar respuesta
    if (data.error) {
      let msg = `⚠️ Error al cargar Lirium: ${data.error}`;
      if (data.error.includes("jwt_expired")) {
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
