// 🔹 Evento al hacer click en "Cargar Movimientos"
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  resumen.innerHTML = "<p>Cargando datos de Lirium...</p>";

  try {
    // -------------------
    // URLs de tus endpoints App Script
    // -------------------
    const TOKEN_URL = "https://script.google.com/macros/s/AKfycbz8ySw09_uSuxqbOL45DObTYUNxLftt3UVb9osVTk6uGQIKZX47mGPOhqgVZ2BLdnlD2A/exec"; // doGet: obtener token
    const GAS_BASE_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec; // doPost: guardar token y actualizar

    // -------------------
    // 1️⃣ Obtener token desde Render vía App Script
    // -------------------
    // Haces fetch al endpoint GET que devuelve el token. Esto evita exponer tu Render URL directamente.
    const tokenRes = await fetch(TOKEN_URL, { cache: "no-store" });
    const tokenData = await tokenRes.json();
    if (!tokenData.jwt) throw new Error("No se pudo obtener token");
    const jwt = tokenData.jwt; // Guardamos el JWT

    // -------------------
    // 2️⃣ Guardar token en la hoja 'lirium!C2' usando POST
    // -------------------
    // Mandamos el JWT al endpoint POST para que lo guarde en la hoja. 
    // Esto permite que tu App Script lo use luego para llamadas a Lirium API.
    const guardarRes = await fetch(GAS_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "guardarToken", token: jwt })
    });
    const guardarData = await guardarRes.json();
    if (!guardarData.ok) throw new Error("No se pudo guardar token: " + (guardarData.error || ""));

    // -------------------
    // 3️⃣ Actualizar movimientos/saldos en Google Sheets
    //     Ahora se hace con POST y enviando 'accion: actualizar'
    // -------------------
    // Llamamos a tu endpoint POST con accion "actualizar". Tu App Script
    // se encargará de leer el token de C2 y actualizar movimientos/clientes.
    const actualizarRes = await fetch(GAS_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwt}` // opcional, tu GS ya lee C2
      },
      body: JSON.stringify({ accion: "actualizar" })
    });
    const data = await actualizarRes.json();
    if (data.error) throw new Error(data.error);

    // -------------------
    // 4️⃣ Leer datos devueltos y mostrarlos en la web
    // -------------------
    // Aquí puedes mostrar un resumen de movimientos y saldos en la web
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
    // -------------------
    // Manejo de errores en red, token o App Script
    // -------------------
    console.error(err);
    resumen.innerHTML = `
      <h2>Clientes Lirium</h2>
      <p>❌ Error de red o API: ${err.message}</p>
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
