// 📌 lirium.js
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");

  // Mensaje de carga
  resumen.innerHTML = "<p>Cargando Lirium...</p>";

  try {
    const RES_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec?accion=actualizar";  
    
    const res = await fetch(RES_URL);
    const data = await res.json();

    if (data.error) {
      resumen.innerHTML = `<p>⚠️ Error al cargar Lirium: ${data.error}</p>`;
      return;
    }

    // --- Mostrar resumen Lirium ---
    if (data.lirium) {
      resumen.innerHTML = `
        <p><strong>-- Clientes Lirium --</strong></p>
        <p>Cantidad: ${data.lirium.cantidad || 0}</p>
        <p>Total ARSD: $ ${Number(data.lirium.totalARSD || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p>Total USDC: ${Number(data.lirium.totalUSDC || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p>Saldo Reddy ARSD: $ ${Number(data.lirium.saldoReddy || 0).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p>Último agregado: ${data.lirium.ultimoAgregado || "Sin datos"}</p>
      `;
    }

  } catch (err) {
    console.error(err);
    resumen.innerHTML = `<p>❌ Error de red o API</p>`;
  }
});
