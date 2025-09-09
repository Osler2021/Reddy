// 📌 lirium.js
document.getElementById("btnCargar").addEventListener("click", async () => {
  const cuerpo = document.getElementById("cuerpo");
  cuerpo.innerHTML = "<tr><td colspan='2'>Cargando...</td></tr>";

  try {
    // 👇 Reemplazá con la URL de tu WebApp publicado en Google Apps Script
    const RES_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec?accion=actualizar";  
    
    const res = await fetch(RES_URL);
    const data = await res.json();

    if (data.error) {
      cuerpo.innerHTML = `<tr><td colspan="2">⚠️ Error: ${data.error}</td></tr>`;
      return;
    }

    // --- Mostrar saldo CVU ---
    cuerpo.innerHTML = `
      <tr><td colspan="2"><strong>-- Saldo CVU --</strong></td></tr>
      <tr><td>Saldo:</td><td>$ ${Number(data.saldoCVU || 0).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}</td></tr>
    `;

    // --- Mostrar resumen Lirium ---
    if (data.lirium) {
      cuerpo.insertAdjacentHTML("beforeend", `
        <tr><td colspan="2"><strong>-- Clientes Lirium --</strong></td></tr>
        <tr><td>Cantidad:</td><td>${data.lirium.cantidad || 0}</td></tr>
        <tr><td>Total ARSD:</td><td>$ ${Number(data.lirium.totalARSD || 0).toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}</td></tr>
        <tr><td>Total USDC:</td><td>${Number(data.lirium.totalUSDC || 0).toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}</td></tr>
        <tr><td>Saldo Reddy ARSD:</td><td>$ ${Number(data.lirium.saldoReddy || 0).toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}</td></tr>
        <tr><td>Último agregado:</td><td>${data.lirium.ultimoAgregado || "Sin datos"}</td></tr>
      `);
    }

  } catch (err) {
    console.error(err);
    cuerpo.innerHTML = `<tr><td colspan="2">❌ Error de red o API</td></tr>`;
  }
});
