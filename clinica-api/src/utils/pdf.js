import PDFDocument from "pdfkit";

const C = {
  primary: "#1a5276",
  accent: "#2980b9",
  stripe: "#eaf4fb",
  white: "#ffffff",
  text: "#1c1c1c",
  muted: "#7f8c8d",
  border: "#bdc3c7",
};

function buildRangeText(desde, hasta) {
  if (!desde && !hasta) return "Todos los registros";
  const fmt = (d) => new Date(d).toLocaleDateString("es-AR");
  if (desde && hasta) return `${fmt(desde)} — ${fmt(hasta)}`;
  if (desde) return `Desde ${fmt(desde)}`;
  return `Hasta ${fmt(hasta)}`;
}

function drawPageHeader(doc, titulo, rangeText) {
  doc.rect(0, 0, doc.page.width, 70).fill(C.primary);

  doc
    .fillColor(C.white)
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("Clínica Médica", 50, 16, { lineBreak: false });

  doc.font("Helvetica").fontSize(10).text(titulo, 50, 40, { lineBreak: false });

  doc.fontSize(8).text(rangeText, doc.page.width - 230, 40, {
    width: 190,
    align: "right",
    lineBreak: false,
  });

  doc.fillColor(C.text);
}

function drawPageFooter(doc) {
  const y = doc.page.height - 36;
  doc.rect(0, y, doc.page.width, 36).fill(C.primary);

  const now = new Date().toLocaleString("es-AR");
  doc
    .fillColor(C.white)
    .font("Helvetica")
    .fontSize(7.5)
    .text(`Generado: ${now}`, 50, y + 12, { lineBreak: false })
    .text("Sistema de Gestión Médica Prog3 UNER", 0, y + 12, {
      align: "center",
      width: doc.page.width,
      lineBreak: false,
    });
}

function drawTable(doc, columnas, filas) {
  const LEFT = 50;
  const ROW_H = 22;
  const HEADER_H = 26;
  const totalW = columnas.reduce((s, c) => s + c.ancho, 0);

  const drawHeaderRow = (y) => {
    doc.rect(LEFT, y, totalW, HEADER_H).fill(C.accent);
    let x = LEFT;
    columnas.forEach((col) => {
      doc
        .fillColor(C.white)
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(col.titulo, x + 5, y + 8, {
          width: col.ancho - 10,
          align: col.align || "left",
          lineBreak: false,
        });
      x += col.ancho;
    });
    return y + HEADER_H;
  };

  let y = doc.y;
  y = drawHeaderRow(y);

  if (filas.length === 0) {
    doc
      .fillColor(C.muted)
      .font("Helvetica")
      .fontSize(9)
      .text("Sin datos para el período seleccionado.", LEFT, y + 8);
    doc.y = y + ROW_H;
    return;
  }

  filas.forEach((fila, i) => {
    if (y + ROW_H > doc.page.height - 50) {
      doc.addPage();
      y = drawHeaderRow(50);
    }

    doc.rect(LEFT, y, totalW, ROW_H).fill(i % 2 === 0 ? C.stripe : C.white);

    let x = LEFT;
    columnas.forEach((col) => {
      const raw = fila[col.clave];
      const val = raw !== undefined && raw !== null ? String(raw) : "-";
      doc
        .fillColor(C.text)
        .font("Helvetica")
        .fontSize(9)
        .text(val, x + 5, y + 6, {
          width: col.ancho - 10,
          align: col.align || "left",
          lineBreak: false,
        });
      x += col.ancho;
    });
    y += ROW_H;
  });

  doc
    .moveTo(LEFT, y)
    .lineTo(LEFT + totalW, y)
    .strokeColor(C.border)
    .lineWidth(0.5)
    .stroke();
  doc.y = y + 10;
}

export function generarPdf(
  res,
  {
    titulo,
    filename,
    fechaDesde,
    fechaHasta,
    columnas,
    filas,
    landscape = false,
  },
) {
  const doc = new PDFDocument({
    size: "A4",
    layout: landscape ? "landscape" : "portrait",
    margins: { top: 50, right: 50, bottom: 0, left: 50 },
    bufferPages: true,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  doc.pipe(res);

  const rangeText = buildRangeText(fechaDesde, fechaHasta);
  drawPageHeader(doc, titulo, rangeText);
  doc.y = 88;

  drawTable(doc, columnas, filas);

  const { start, count } = doc.bufferedPageRange();
  for (let i = 0; i < count; i++) {
    doc.switchToPage(start + i);
    drawPageFooter(doc);
  }

  doc.flushPages();
  doc.end();
}

export const fmt = {
  dinero: (val) => `$ ${Number(val).toFixed(2)}`,
  pct: (val) => `${val}%`,
  bool: (val) => (val ? "Sí" : "No"),
};
