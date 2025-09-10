// 📌 lirium.js (versión corregida - sin polling innecesario)
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  const BASE_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec";
  
  try {
    resumen.innerHTML = "<p>⏳ Iniciando carga de datos de Lirium...</p>";
    
    // --- PASO 1: Ejecutar actualización SÍNCRONA ---
    resumen.innerHTML = "<p>🔄 Actualizando datos (esto puede tomar 30-60 segundos)...</p>";
    
    const resUpdate = await fetch(`${BASE_URL}?accion=actualizar`, { 
      cache: "no-store",
      method: "GET"
    });
    
    if (!resUpdate.ok) {
      throw new Error(`Error HTTP: ${resUpdate.status}`);
    }
    
    const dataUpdate = await resUpdate.json();
    
    if (dataUpdate.error) {
      resumen.innerHTML = `<p>⚠️ Error al actualizar: ${dataUpdate.error}</p>`;
      return;
    }
    
    console.log("Actualización completada:", dataUpdate);
    
    // --- PASO 2: Consultar datos inmediatamente ---
    resumen.innerHTML = "<p>📊 Obteniendo datos actualizados...</p>";
    
    const resConsulta = await fetch(`${BASE_URL}?accion=consultar`, { 
      cache: "no-store",
      method: "GET"
    });
    
    if (!resConsulta.ok) {
      throw new Error(`Error HTTP en consulta: ${resConsulta.status}`);
    }
    
    const data = await resConsulta.json();
    
    if (data.error) {
      resumen.innerHTML = `<p>⚠️ Error al consultar datos: ${data.error}</p>`;
      return;
    }
    
    console.log("Datos obtenidos:", data);
    
    // --- PASO 4: Renderizar resultados ---
    if (!data || !data.lirium || Number(data.lirium.cantidad) === 0) {
      console.warn("⚠️ No hay datos válidos:", data);
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
    const totalARSD = Number(lirium.totalARSD || 0);
    const totalUSDC = Number(lirium.totalUSDC || 0);
    const saldoReddy = Number(lirium.saldoReddy || 0);
    const fechaStr = lirium.ultimoAgregado || "Sin datos";
    
    resumen.innerHTML = `
      <h2>Clientes Lirium ✅</h2>
      <p><small>Actualizado: ${new Date().toLocaleString("es-AR")}</small></p>
      <table>
        <tr><td>Cantidad</td><td>${lirium.cantidad || 0}</td></tr>
        <tr><td>Total ARSD</td><td>$ ${totalARSD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
        <tr><td>Total USDC</td><td>${totalUSDC.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
        <tr><td>Saldo Reddy ARSD</td><td>$ ${saldoReddy.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td></tr>
        <tr><td>Último agregado</td><td>${fechaStr}</td></tr>
      </table>
    `;
    
  } catch (err) {
    console.error("Error completo:", err);
    resumen.innerHTML = `
      <h2>Clientes Lirium</h2>
      <p>❌ Error de conexión: ${err.message || err}</p>
      <p><small>Revisa la consola para más detalles</small></p>
      <table>
        <tr><td>Cantidad</td><td>0</td></tr>
        <tr><td>Total ARSD</td><td>$ 0,00</td></tr>
        <tr><td>Total USDC</td><td>0</td></tr>
        <tr><td>Saldo Reddy ARSD</td><td>$ 0,00</td></tr>
        <tr><td>Último agregado</td><td>Error</td></tr>
      </table>
    `;
  }
});
