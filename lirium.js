// 📌 lirium.js (versión definitiva y robusta)
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  const BASE_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec";
  
  try {
    resumen.innerHTML = "<p>⏳ Iniciando carga de datos de Lirium...</p>";
    
    // --- PASO 1: Ejecutar actualización ---
    resumen.innerHTML = "<p>🔄 Actualizando datos desde API Lirium (30-60 segundos)...</p>";
    
    console.log("🔄 Iniciando actualización...");
    
    const resUpdate = await fetch(`${BASE_URL}?accion=actualizar`, { 
      cache: "no-store",
      method: "GET",
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!resUpdate.ok) {
      throw new Error(`Error HTTP en actualización: ${resUpdate.status} - ${resUpdate.statusText}`);
    }
    
    const dataUpdate = await resUpdate.json();
    console.log("✅ Respuesta de actualización:", dataUpdate);
    
    if (dataUpdate.error) {
      console.error("❌ Error reportado por servidor:", dataUpdate.error);
      resumen.innerHTML = `<p>⚠️ Error al actualizar: ${dataUpdate.error}</p>`;
      return;
    }
    
    // --- PASO 2: Esperar sincronización ---
    resumen.innerHTML = "<p>⏱️ Sincronizando datos en Google Sheets...</p>";
    console.log("⏱️ Esperando sincronización...");
    
    // Espera más tiempo para asegurar que todo se escribió
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // --- PASO 3: Múltiples intentos de consulta para asegurar datos ---
    let data = null;
    let intentosRestantes = 5;
    
    while (intentosRestantes > 0 && (!data || !data.lirium || data.lirium.cantidad === 0)) {
      resumen.innerHTML = `<p>📊 Consultando datos actualizados... (${6 - intentosRestantes}/5)</p>`;
      console.log(`📊 Intento de consulta ${6 - intentosRestantes}/5`);
      
      const resConsulta = await fetch(`${BASE_URL}?accion=consultar&_t=${Date.now()}`, { 
        cache: "no-store",
        method: "GET",
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!resConsulta.ok) {
        throw new Error(`Error HTTP en consulta: ${resConsulta.status} - ${resConsulta.statusText}`);
      }
      
      data = await resConsulta.json();
      console.log(`📊 Datos recibidos (intento ${6 - intentosRestantes}):`, data);
      
      // Si hay error o no hay datos, esperar antes del siguiente intento
      if (data.error) {
        console.error("❌ Error en consulta:", data.error);
        if (intentosRestantes === 1) {
          resumen.innerHTML = `<p>⚠️ Error en consulta: ${data.error}</p>`;
          return;
        }
      } else if (!data.lirium || data.lirium.cantidad === 0) {
        console.warn(`⚠️ Sin datos válidos (intento ${6 - intentosRestantes}):`, data);
        if (intentosRestantes > 1) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
        }
      } else {
        console.log("✅ Datos válidos obtenidos!");
        break; // Salir del loop si tenemos datos válidos
      }
      
      intentosRestantes--;
    }
    
    // --- PASO 4: Renderizar resultados ---
    if (!data || !data.lirium || data.lirium.cantidad === 0) {
      console.warn("⚠️ Sin datos finales después de todos los intentos:", data);
      
      resumen.innerHTML = `
        <h2>Clientes Lirium ⚠️</h2>
        <p><strong>Estado:</strong> Sin datos disponibles</p>
        <p><small>Última actualización: ${new Date().toLocaleString("es-AR")}</small></p>
        <table>
          <tr><td>Cantidad</td><td>0</td></tr>
          <tr><td>Total ARSD</td><td>$ 0,00</td></tr>
          <tr><td>Total USDC</td><td>0,00</td></tr>
          <tr><td>Saldo Reddy ARSD</td><td>$ 0,00</td></tr>
          <tr><td>Último agregado</td><td>Sin datos</td></tr>
        </table>
        <p><small><strong>Debug:</strong> ${data?.debug || 'Sin información de debug'}</small></p>
      `;
      return;
    }
    
    // Datos válidos - mostrar resultados
    const lirium = data.lirium;
    const totalARSD = Number(lirium.totalARSD || 0);
    const totalUSDC = Number(lirium.totalUSDC || 0);
    const saldoReddy = Number(lirium.saldoReddy || 0);
    const fechaStr = lirium.ultimoAgregado || "Sin datos";
    
    console.log("🎉 Mostrando datos finales:", {
      cantidad: lirium.cantidad,
      totalARSD,
      totalUSDC,
      saldoReddy,
      fecha: fechaStr
    });
    
    resumen.innerHTML = `
      <h2>Clientes Lirium ✅</h2>
      <p><strong>Estado:</strong> Datos actualizados correctamente</p>
      <p><small>Última actualización: ${new Date().toLocaleString("es-AR")}</small></p>
      <table>
        <tr><td>Cantidad</td><td><strong>${lirium.cantidad || 0}</strong></td></tr>
        <tr><td>Total ARSD</td><td><strong>$ ${totalARSD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td></tr>
        <tr><td>Total USDC</td><td><strong>${totalUSDC.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td></tr>
        <tr><td>Saldo Reddy ARSD</td><td><strong>$ ${saldoReddy.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td></tr>
        <tr><td>Último agregado</td><td><strong>${fechaStr}</strong></td></tr>
      </table>
    `;
    
  } catch (err) {
    console.error("💥 Error completo:", err);
    resumen.innerHTML = `
      <h2>Clientes Lirium ❌</h2>
      <p><strong>Estado:</strong> Error de conexión</p>
      <p><strong>Error:</strong> ${err.message || err}</p>
      <p><small>Última actualización: ${new Date().toLocaleString("es-AR")}</small></p>
      <table>
        <tr><td>Cantidad</td><td>0</td></tr>
        <tr><td>Total ARSD</td><td>$ 0,00</td></tr>
        <tr><td>Total USDC</td><td>0,00</td></tr>
        <tr><td>Saldo Reddy ARSD</td><td>$ 0,00</td></tr>
        <tr><td>Último agregado</td><td>Error</td></tr>
      </table>
      <p><small><strong>Sugerencia:</strong> Verifica la consola (F12) para más detalles</small></p>
    `;
  }
});
