// 📌 lirium.js (versión con sistema híbrido)
document.getElementById("btnCargar").addEventListener("click", async () => {
  const resumen = document.getElementById("resumenLirium");
  const BASE_URL = "https://script.google.com/macros/s/AKfycbxccEWBhTFF-Y966-po7WTJyC4Q9cV5RahrMfBP5A6d4-TnuxJLe0lK0cdLvDP27wq9wA/exec";
  
  try {
    resumen.innerHTML = "<p>⏳ Iniciando carga de datos de Lirium...</p>";
    
    // --- PASO 1: Primero intentar consulta rápida (datos cached) ---
    console.log("🔍 Verificando datos existentes...");
    resumen.innerHTML = "<p>🔍 Verificando datos existentes...</p>";
    
    try {
      const resConsultaRapida = await fetch(`${BASE_URL}?accion=consultar&_t=${Date.now()}`, { 
        cache: "no-store",
        method: "GET"
      });
      
      if (resConsultaRapida.ok) {
        const dataRapida = await resConsultaRapida.json();
        console.log("📊 Datos existentes encontrados:", dataRapida);
        
        // Si hay datos válidos y recientes, mostrarlos inmediatamente
        if (dataRapida.lirium && dataRapida.lirium.cantidad > 0) {
          console.log("✅ Usando datos existentes");
          mostrarResultados(dataRapida, resumen, "datos existentes");
          
          // Preguntar al usuario si quiere actualizar
          const actualizar = confirm("Se encontraron datos existentes. ¿Deseas actualizarlos desde la API? (Esto puede tomar 30-60 segundos)");
          if (!actualizar) {
            return; // Usuario decidió no actualizar
          }
        }
      }
    } catch (e) {
      console.log("🔍 No hay datos existentes válidos, procediendo con actualización");
    }
    
    // --- PASO 2: Ejecutar actualización completa ---
    resumen.innerHTML = "<p>🔄 Actualizando datos desde API Lirium (esto puede tomar 30-60 segundos)...</p>";
    console.log("🔄 Iniciando actualización completa...");
    
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
      resumen.innerHTML = `
        <h2>Clientes Lirium ⚠️</h2>
        <p><strong>Error:</strong> ${dataUpdate.error}</p>
        <p><small>${new Date().toLocaleString("es-AR")}</small></p>
      `;
      return;
    }
    
    // --- PASO 3: Consultar datos actualizados ---
    resumen.innerHTML = "<p>📊 Obteniendo datos actualizados...</p>";
    console.log("📊 Consultando datos actualizados...");
    
    // Pequeña espera para asegurar sincronización
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
    
    const data = await resConsulta.json();
    console.log("📊 Datos recibidos:", data);
    
    if (data.error) {
      console.error("❌ Error en consulta:", data.error);
      resumen.innerHTML = `
        <h2>Clientes Lirium ⚠️</h2>
        <p><strong>Error en consulta:</strong> ${data.error}</p>
        <p><small>${new Date().toLocaleString("es-AR")}</small></p>
      `;
      return;
    }
    
    // --- PASO 4: Mostrar resultados ---
    mostrarResultados(data, resumen, "actualización completa");
    
  } catch (err) {
    console.error("💥 Error completo:", err);
    resumen.innerHTML = `
      <h2>Clientes Lirium ❌</h2>
      <p><strong>Error de conexión:</strong> ${err.message || err}</p>
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

// 🔥 FUNCIÓN AUXILIAR PARA MOSTRAR RESULTADOS
function mostrarResultados(data, resumen, origen) {
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
      ${data?.source ? `<p><small><strong>Fuente:</strong> ${data.source}</small></p>` : ''}
    `;
    return;
  }
  
  // Datos válidos - mostrar resultados
  const lirium = data.lirium;
  const totalARSD = Number(lirium.totalARSD || 0);
  const totalUSDC = Number(lirium.totalUSDC || 0);
  const saldoReddy = Number(lirium.saldoReddy || 0);
  const fechaStr = lirium.ultimoAgregado || "Sin datos";
  
  console.log("🎉 Mostrando datos:", {
    cantidad: lirium.cantidad,
    totalARSD,
    totalUSDC,
    saldoReddy,
