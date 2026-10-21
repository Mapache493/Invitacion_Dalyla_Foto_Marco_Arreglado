/* Control de asistencia de Dalyla.
   Pega tu URL /exec en URL_APPS_SCRIPT para activar el envío a Sheets.
   NOTA: no-cors no permite verificar si Sheets guardó los datos.
*/
(() => {
  "use strict";
  const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbwc1brUFADUnBHZWJwgJn0IhjRpVImB5JUYzM9_DLs4qY7n69DGs15ClzXZw1mq-lmeKA/exec";
  const form = document.getElementById("formConfirmacion");
  if (!form) return;
  const nombreInput = document.getElementById("nombre");
  const acompanantesInput = document.getElementById("acompanantes");
  const destinoInput = document.getElementById("telefonoConfirmacion");
  const resumen = document.getElementById("resumenAsistencia");
  const estado = document.getElementById("estadoRegistro");
  const boton = form.querySelector('button[type="submit"]');

  function actualizarResumen() {
    const n = Number(acompanantesInput.value);
    resumen.textContent = acompanantesInput.value === ""
      ? "Total de personas: selecciona acompañantes"
      : `Total de personas: ${n + 1} (incluye al invitado)`;
  }
  acompanantesInput.addEventListener("change", actualizarResumen);
  actualizarResumen();

  form.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    if (!form.reportValidity()) return;
    const nombre = nombreInput.value.trim();
    const acompanantes = Number(acompanantesInput.value);
    if (!nombre || !Number.isInteger(acompanantes) || acompanantes < 0 || acompanantes > 10) {
      estado.textContent = "Revisa el nombre y la cantidad de acompañantes.";
      return;
    }
    const total = acompanantes + 1;
    const mensaje = `¡Hola! 💖\n\nQuiero confirmar mi asistencia a los XV años de Dalyla Alixtzel Carrillo Chan.\n\nNombre: ${nombre}\nAcompañantes: ${acompanantes}\nTotal de personas: ${total}\n\nFecha: 31 de octubre de 2026.\nHora de la fiesta: 8:30 PM.\n\n¡Muchas gracias por la invitación!`;
    const telefono = destinoInput.value || "529841375523";
    const whatsapp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    // Abrir WhatsApp inmediatamente para evitar bloqueos de ventanas emergentes.
    const ventana = window.open(whatsapp, "_blank", "noopener,noreferrer");
    if (!ventana) {
      const a = document.createElement("a");
      a.href = whatsapp; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.textContent = "Abrir WhatsApp para confirmar";
      estado.replaceChildren(a);
    }

    if (!URL_APPS_SCRIPT.startsWith("https://script.google.com/macros/s/") || !URL_APPS_SCRIPT.endsWith("/exec")) {
      if (ventana) estado.textContent = "WhatsApp abierto. Falta configurar la URL para guardar en Google Sheets.";
      return;
    }

    boton.disabled = true;
    if (ventana) estado.textContent = "Enviando solicitud a Google Sheets…";
    try {
      await fetch(URL_APPS_SCRIPT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ nombre, asistencia: "si", acompanantes })
      });
      if (ventana) estado.textContent = "Solicitud enviada a Google Sheets; comprueba el registro en la hoja. Confirma también por WhatsApp.";
    } catch (error) {
      if (ventana) estado.textContent = "No se pudo enviar a Google Sheets. Confirma por WhatsApp.";
    } finally {
      boton.disabled = false;
    }
  });
})();
