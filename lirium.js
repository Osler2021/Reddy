// --- lirium.js frontend para GitHub Pages ---
async function actualizarYMostrar() {
  const URL_RENDER = "https://jwt-server-online.onrender.com/lirium"; // tu endpoint en Render

  try {
    const res = await fetch(URL_RENDER);
    if (!res.ok) throw new Error(`Error en fetch: ${res.status}`);

    const data = await res.json();
    console.log("Datos Lirium:", data);

    // Mostrar en tu página
    document.getElementById("cantidad").textContent = data.lirium.cantidad || 0;
    document.getElementById("totalARSD").textContent = data.lirium.totalARSD || "0,00";
    document.getElementById("totalUSDC").textContent = data.lirium.totalUSDC || "0,00";
    document.getElementById("saldoReddy").textContent = data.lirium.saldoReddy || "0,00";
    document.getElementById("ultimoAgregado").textContent = data.lirium.ultimoAgregado || "Error";
  } catch (e) {
    console.error("Error de conexión:", e);
    document.getElementById("cantidad").textContent = "❌";
    document.getElementById("totalARSD").textContent = "❌";
    document.getElementById("totalUSDC").textContent = "❌";
    document.getElementById("saldoReddy").textContent = "❌";
    document.getElementById("ultimoAgregado").textContent = "Error de conexión";
  }
}

// Ejecutar al cargar la página
window.addEventListener("load", actualizarYMostrar);
