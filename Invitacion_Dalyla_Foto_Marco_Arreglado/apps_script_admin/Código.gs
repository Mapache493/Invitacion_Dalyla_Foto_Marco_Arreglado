const ID_HOJA = "1WzBBTyR68LUFLRO4mWgZty57W3qwSIZjgUt6bl-Wnag";
const NOMBRE_HOJA = "Confirmaciones";

// Muestra el panel privado.
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("Admin")
    .setTitle("Panel Privado - XV Dalyla");
}

// Lee las confirmaciones existentes sin modificarlas.
function obtenerConfirmaciones() {
  const libro = SpreadsheetApp.openById(ID_HOJA);
  const hoja = libro.getSheetByName(NOMBRE_HOJA);

  if (!hoja) {
    throw new Error(
      'No se encontró la pestaña "' + NOMBRE_HOJA + '".'
    );
  }

  const ultimaFila = hoja.getLastRow();

  if (ultimaFila < 2) {
    return {
      estadisticas: {
        personas: 0,
        confirmaciones: 0,
        acompanantes: 0,
        noAsistiran: 0,
        respuestas: 0
      },
      registros: []
    };
  }

  // Columnas A-F:
  // Fecha, Nombre, Asistencia, Acompañantes,
  // Total personas, Folio.
  const filas = hoja.getRange(
    2, 1, ultimaFila - 1, 6
  ).getValues();

  const registros = filas
    .filter(fila => String(fila[1] || "").trim() !== "")
    .map(fila => {
      const asistencia = String(fila[2] || "").trim();
      const normalizada = asistencia
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const asistira = normalizada === "si";
      const acompanantes = asistira
        ? Math.max(0, Number(fila[3]) || 0)
        : 0;

      const total = asistira
        ? Math.max(0, Number(fila[4]) || 0)
        : 0;

      const fecha = fila[0] instanceof Date
        ? Utilities.formatDate(
            fila[0],
            Session.getScriptTimeZone(),
            "dd/MM/yyyy HH:mm"
          )
        : String(fila[0] || "");

      return {
        fecha: fecha,
        nombre: String(fila[1] || ""),
        asistencia: asistira ? "Sí" : "No",
        acompanantes: acompanantes,
        total: total,
        folio: String(fila[5] || ""),
        asistira: asistira
      };
    });

  const positivos = registros.filter(r => r.asistira);
  const negativos = registros.filter(r => !r.asistira);

  const sumar = (lista, campo) =>
    lista.reduce((total, r) => total + r[campo], 0);

  return {
    estadisticas: {
      personas: sumar(positivos, "total"),
      confirmaciones: positivos.length,
      acompanantes: sumar(positivos, "acompanantes"),
      noAsistiran: negativos.length,
      respuestas: registros.length
    },
    registros: registros
  };
}
