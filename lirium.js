// 📌 lirium.js (versión simplificada y directa)
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  const BASE_URL = "https://script.google.com/macros/s/AKfycbzjh-oBF8iT7dKnedMgLojDMJ5Pl1TCFVQ2osCIZPINtROPkNQ3U7GmGRcsIXHgbQAUKQ/exec";
  
  try {
    resumen.innerHTML = "<p>🔄 Actualizando datos desde API Lirium...</p><p><small>Esto puede tomar 30-60 segundos</small></p>";
    
    console.log("🔄 Iniciando actualización...");
    
    // 🔥 UNA SOLA LLAMADA QUE ACTUALIZA Y DEVUELVE DATOS
    const response = await fetch(`${BASE_URL}?accion=actualizar&_t=${Date.now()}`, { 
      cache: "no-store",
      method: "GET",
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("📊 Respuesta completa:", data);
    
    if (data.error) {
      console.error("❌ Error reportado:", data.error);
      resumen.innerHTML = `
        <h2>Clientes Lirium ❌</h2>
        <p><strong>Error:</strong> ${data.error}</p>
        <p><small>${new Date().toLocaleString("es-AR")}</small></p>
      `;
      return;
    }
    
    // 🔥 VERIFICAR SI VIENEN DATOS DIRECTOS EN LA RESPUESTA
    if (data.lirium && data.lirium.cantidad > 0) {
      console.log("✅ Datos recibidos directamente!");
      mostrarResultados(data, "actualización directa");
      return;
    }
    
    // 🔥 FALLBACK: CONSULTAR SEPARADAMENTE SI NO VIENEN DATOS
    console.log("🔍 Datos no incluidos, consultando por separado...");
    resumen.innerHTML = "<p>📊 Obteniendo datos actualizados...</p>";
    
    await new Promise(resolve => setTimeout(resolve, 1000)); // Breve espera
    
    const resConsulta = await fetch(`${BASE_URL}?accion=consultar&_t=${Date.now()}`, { 
      cache: "no-store",
      method: "GET",
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!resConsulta.ok) {
      throw new Error(`Error HTTP en consulta: ${resConsulta.status}`);
    }
    
    const dataConsulta = await resConsulta.json();
    console.log("📊 Datos de consulta:", dataConsulta);
    
    if (dataConsulta.error) {
      console.error("❌ Error en consulta:", dataConsulta.error);
      resumen.innerHTML = `
        <h2>Clientes Lirium ⚠️</h2>
        <p><strong>Error en consulta:</strong> ${dataConsulta.error}</p>
        <p><small>${new Date().toLocaleString("es-AR")}</small></p>
      `;
      return;
    }
    
    mostrarResultados(dataConsulta, "consulta separada");
    
  } catch (err) {
    console.error("💥 Error completo:", err);
    resumen.innerHTML = `
      <h2>Clientes Lirium ❌</h2>
      <p><strong>Error de conexión:</strong> ${err.message || err}</p>
      <p><small>Revisa la consola (F12) para más detalles</small></p>
      <p><small>Última actualización: ${new Date().toLocaleString("es-AR")}</small></p>
      <table>
        <tr><td>Cantidad</td><td>0</td></tr>
        <tr><td>Total ARSD</td><td>$ 0,00</td></tr>
        <tr><td>Total USDC</td><td>0,00</td></tr>
        <tr><td>Saldo Reddy ARSD</td><td>$ 0,00</td></tr>
        <tr><td>Último agregado</td><td>Error</td></tr>
      </table>
    `;
  }
  
  // 🔥 FUNCIÓN INTERNA PARA MOSTRAR RESULTADOS
  function mostrarResultados(data, origen) {
    const resumen = document.getElementById("resumenLirium");
    
    if (!data || !data.lirium || data.lirium.cantidad === 0) {
      console.warn("⚠️ Sin datos válidos:", data);
      
      resumen.innerHTML = `
        <h2>Clientes Lirium ⚠️</h2>
        <p><strong>Estado:</strong> Sin datos disponibles</p>
        <p><small>Origen: ${origen} - ${new Date().toLocaleString("es-AR")}</small></p>
        <table>
          <tr><td>Cantidad</td><td>0</td></tr>
          <tr><td>Total ARSD</td><td>$ 0,00</td></tr>
          <tr><td>Total USDC</td><td>0,00</td></tr>
          <tr><td>Saldo Reddy ARSD</td><td>$ 0,00</td></tr>
          <tr><td>Último agregado</td><td>Sin datos</td></tr>
        </table>
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
      fecha: fechaStr,
      origen
    });
    
    resumen.innerHTML = `
      <h2>Clientes Lirium ✅</h2>
      <p><strong>Estado:</strong> Actualizado correctamente</p>
      <p><small>Origen: ${origen} - ${new Date().toLocaleString("es-AR")}</small></p>
      <table>
        <tr><td>Cantidad</td><td><strong>${lirium.cantidad || 0}</strong></td></tr>
        <tr><td>Total ARSD</td><td><strong>$ ${totalARSD.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td></tr>
        <tr><td>Total USDC</td><td><strong>${totalUSDC.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td></tr>
        <tr><td>Saldo Reddy ARSD</td><td><strong>$ ${saldoReddy.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td></tr>
        <tr><td>Último agregado</td><td><strong>${fechaStr}</strong></td></tr>
      </table>
    `;
  }
});
