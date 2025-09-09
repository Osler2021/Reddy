async function cargarSaldosLirium() {
  const cuerpo = document.getElementById("cuerpo");

  try {
    const res = await fetch("https://TU_SERVIDOR_RENDER/lirium");
    const data = await res.json();

    if (!data.clientes || !Array.isArray(data.clientes)) {
      cuerpo.insertAdjacentHTML("beforeend", `<tr><td>Error: no se obtuvieron clientes</td></tr>`);
      return;
    }

    let totalARSD = 0, totalUSDC = 0, saldoReddy = 0, fechaUltimo = null;

    data.clientes.forEach(c => {
      const arsd = parseFloat(c.saldo_ARSD) || 0;
      const usdc = parseFloat(c.saldo_USDC) || 0;
      const created = new Date(c.created_at);

      if (c.id === "a52c054818c645fcb0ca981c9e2187ce") {
        saldoReddy = arsd;
      } else {
        totalARSD += arsd;
      }
      totalUSDC += usdc;

      if (!isNaN(created.getTime())) {
        if (!fechaUltimo || created > fechaUltimo) fechaUltimo = created;
      }
    });

    const fechaStr = fechaUltimo
      ? fechaUltimo.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })
      : "Sin datos";

    cuerpo.insertAdjacentHTML("beforeend", `
      <tr><td colspan="2"><strong>-- Saldos Lirium --</strong></td></tr>
      <tr><td>Cantidad de clientes:</td><td>${data.clientes.length}</td></tr>
      <tr><td>Total ARSD:</td><td>$ ${totalARSD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
      <tr><td>Total USDC:</td><td>${totalUSDC.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
      <tr><td>Saldo Reddy ARSD:</td><td>$ ${saldoReddy.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
      <tr><td>Último agregado:</td><td>${fechaStr}</td></tr>
    `);

  } catch (err) {
    console.error(err);
    cuerpo.insertAdjacentHTML("beforeend", `<tr><td>Error de red o API</td></tr>`);
  }
}

// Llamar después de mostrar el saldo CVU
document.getElementById("btnCargar").addEventListener("click", async () => {
  // tu código actual de saldo CVU aquí
  await cargarSaldosLirium(); // agrega los saldos Lirium debajo
});

