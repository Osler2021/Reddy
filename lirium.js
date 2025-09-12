// 📌 lirium.js - Fetch seguro desde Google Apps Script
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  resumen.innerHTML = "<p>Cargando datos de Lirium...</p>";

  try {
    // 🔑 Endpoint que devuelve el token desde Google Apps Script
    const TOKEN_URL = "https://script.google.com/macros/s/AKfycbz8ySw09_uSuxqbOL45DObTYUNxLftt3UVb9osVTk6uGQIKZX47mGPOhqgVZ2BLdnlD2A/exec";  // 👉 reemplazá con el URL de tu GAS (el que tiene doGet del token)

    // 🌐 Endpoint que devuelve los datos procesados
    const DATA_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec?accion=actualizar";  

    // 1️⃣ Pedir token primero
    const tokenRes = await fetch(TOKEN_URL, { cache: "no-store" });
    const tokenData = await tokenRes.json();

    if (!tokenData.jwt) {
      throw new Error("No se pudo obtener token");
    }

    const jwt = tokenData.jwt;

    // 2️⃣ Usar el token en la llamada de datos
    const res = await fetch(DATA_URL, {
      cache: "no-store",
      headers: {
        "Authorization": `Bearer ${jwt}`
      }
    });

    const data = await res.json();

    if (data.error) {
      let msg = `⚠️ Error al cargar Lirium: ${data.error}`;
      resumen.innerHTML = `
        <h2>Clientes Lirium</h2>
        <p>${msg}</p>
        <table>
          <tr><td>Cantidad</td><td>0</td></tr>
          <tr><td>Total ARSD</td><td>$ 0,00</td></tr>
          <tr><td>Total USDC</td><td>0</td></tr>
          <tr><td>Saldo Reddy ARSD</td><td>$ 0,00</td></tr>
          <tr><td>Última actualización</td><td>Sin datos</td></tr>
        </table>
      `;
      return;
    }

    // ✅ Mostrar datos recibidos de App Script
    const lirium = data.lirium || {};
    const fechaStr = lirium.ultimaActualizacion || "Sin datos";  // ⚠️ ajustado a "última actualización"

    resumen.innerHTML = `
      <h2>Clientes Lirium</h2>
      <table>
        <tr><td>Cantidad</td><td>${lirium.cantidad || 0}</td></tr>
        <tr><td>Total ARSD</td><td>$ ${Number(lirium.totalARSD || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
        <tr><td>Total USDC</td><td>${Number(lirium.totalUSDC || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
        <tr><td>Saldo Reddy ARSD</td><td>$ ${Number(lirium.saldoReddy || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
        <tr><td>Última actualización</td><td>${fechaStr}</td></tr>
      </table>
    `;

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
        <tr><td>Última actualización</td><td>Sin datos</td></tr>
      </table>
    `;
  }
});
