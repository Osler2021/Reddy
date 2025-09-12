document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  resumen.innerHTML = "<p>Cargando datos de Lirium...</p>";

  try {
    const TOKEN_URL = "https://script.google.com/macros/s/TU_ID_DOGET/exec";
    const GAS_BASE_URL = "https://script.google.com/macros/s/TU_ID_DOPOST/exec";

    // 1️⃣ Pedir token
    const tokenRes = await fetch(TOKEN_URL, { cache: "no-store" });
    const tokenData = await tokenRes.json();
    if (!tokenData.jwt) throw new Error("No se pudo obtener token");

    const jwt = tokenData.jwt;

    // 2️⃣ Guardar token en lirium!C2
    const guardarRes = await fetch(GAS_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "guardarToken", token: jwt })
    });
    const guardarData = await guardarRes.json();
    if (!guardarData.ok) throw new Error("No se pudo guardar token: " + (guardarData.error || ""));

    // 3️⃣ Usar token en la actualización (ejemplo)
    const res = await fetch(GAS_BASE_URL + "?accion=actualizar", {
      cache: "no-store",
      headers: { "Authorization": `Bearer ${jwt}` }
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error);

    const lirium = data.lirium || {};
    const fechaStr = lirium.ultimaActualizacion || "Sin datos";

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
    resumen.innerHTML = `<h2>Clientes Lirium</h2><p>❌ Error: ${err.message}</p>`;
  }
});
