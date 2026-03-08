import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, PageOrientation, BorderStyle, WidthType, ShadingType,
  VerticalAlign, HeadingLevel
} from "docx";

const FONT = "TH SarabunPSK";
const FONT_SIZE = 22; // 11pt in half-points (22 = 11pt, 24 = 12pt)
const FONT_SIZE_HEADER = 26; // 13pt
const FONT_SIZE_TITLE = 32; // 16pt

// A4 Landscape: 29.7cm × 21cm → DXA (1440 per inch, 1cm ≈ 567 DXA)
// Width: 29.7cm = 16,838 DXA, Height: 21cm = 11,906 DXA
// Margins: 1.5cm each side = 850 DXA
const PAGE_WIDTH_DXA = 16838;
const MARGIN_DXA = 851; // ~1.5cm
const TABLE_WIDTH_DXA = PAGE_WIDTH_DXA - MARGIN_DXA * 2; // ~15,136 DXA

// Column widths (must sum to TABLE_WIDTH_DXA = 15136)
// (1) รหัส/ภาระงาน  (2) รายงานผล  (3) น้ำหนัก  (4) ตนเอง  (5) ผู้บังคับ  (6) กรรมการ  (7) คะแนน
const COL_WIDTHS = [3200, 6600, 900, 900, 1000, 1000, 1536]; // sum = 15136

const border = { style: BorderStyle.SINGLE, size: 4, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

const cellPad = { top: 60, bottom: 60, left: 100, right: 80 };

function run(text, opts = {}) {
  return new TextRun({
    text: String(text || ""),
    font: FONT,
    size: opts.size || FONT_SIZE,
    bold: opts.bold || false,
    color: opts.color || "000000",
  });
}

function para(children, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { before: 20, after: 20 },
    children: Array.isArray(children) ? children : [children],
  });
}

function infoRow(label, value) {
  return new TableRow({
    children: [
      new TableCell({
        borders: noBorders,
        width: { size: 2400, type: WidthType.DXA },
        margins: cellPad,
        children: [para(run(label, { bold: true }))],
      }),
      new TableCell({
        borders: noBorders,
        width: { size: TABLE_WIDTH_DXA - 2400, type: WidthType.DXA },
        margins: cellPad,
        children: [para(run(value || ""))],
      }),
    ],
  });
}

function headerRow(text, bg = "1B4F8A") {
  return new TableRow({
    children: [
      new TableCell({
        columnSpan: 7,
        borders,
        width: { size: TABLE_WIDTH_DXA, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        shading: { fill: bg, type: ShadingType.CLEAR },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 20, after: 20 },
            children: [run(text, { bold: true, color: "FFFFFF", size: FONT_SIZE_HEADER })],
          }),
        ],
      }),
    ],
  });
}

function colHeaderRow() {
  const headers = [
    "(1) ภาระงาน / กิจกรรม / ตัวชี้วัด",
    "(2) รายงานผลการปฏิบัติงาน",
    "(3)\nน้ำ\nหนัก",
    "(4)\nประ\nเมิน\nตนเอง",
    "(5)\nผู้บังคับ\nบัญชา",
    "(6)\nคณะ\nกรรมการ",
    "(7)\n(3)×(6)\nคะแนน\nที่ได้",
  ];
  return new TableRow({
    tableHeader: true,
    children: headers.map((h, i) =>
      new TableCell({
        borders,
        width: { size: COL_WIDTHS[i], type: WidthType.DXA },
        margins: cellPad,
        shading: { fill: "D9E2F3", type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 20, after: 20 },
            children: [run(h, { bold: true, size: 20 })],
          }),
        ],
      })
    ),
  });
}

function dataRow(item, d) {
  const activity = d?.activity || "";
  const score = d?.score || "";
  const bgFill = d?.status === "ai-filled" ? "F0FFF4" : activity ? "FFFDE7" : "FFFFFF";

  return new TableRow({
    children: [
      // Col 1: code + desc
      new TableCell({
        borders,
        width: { size: COL_WIDTHS[0], type: WidthType.DXA },
        margins: cellPad,
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.TOP,
        children: [
          para([
            run(item.code + "  ", { bold: true, size: 20 }),
            run(item.desc, { size: FONT_SIZE }),
          ]),
          para(run(`น้ำหนัก: ${item.w}`, { size: 18, color: "555555" })),
        ],
      }),
      // Col 2: activity description
      new TableCell({
        borders,
        width: { size: COL_WIDTHS[1], type: WidthType.DXA },
        margins: cellPad,
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.TOP,
        children: activity
          ? activity.split("\n").map(line => para(run(line)))
          : [para(run(""))],
      }),
      // Col 3: weight
      new TableCell({
        borders,
        width: { size: COL_WIDTHS[2], type: WidthType.DXA },
        margins: cellPad,
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [run(String(item.w), { bold: true })],
          }),
        ],
      }),
      // Col 4: self-score
      new TableCell({
        borders,
        width: { size: COL_WIDTHS[3], type: WidthType.DXA },
        margins: cellPad,
        shading: { fill: bgFill, type: ShadingType.CLEAR },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [run(score, { bold: true, size: FONT_SIZE_HEADER, color: score ? "1B5E20" : "CCCCCC" })],
          }),
        ],
      }),
      // Col 5: supervisor score (blank)
      new TableCell({
        borders,
        width: { size: COL_WIDTHS[4], type: WidthType.DXA },
        margins: cellPad,
        children: [para(run(""))],
      }),
      // Col 6: committee score (blank)
      new TableCell({
        borders,
        width: { size: COL_WIDTHS[5], type: WidthType.DXA },
        margins: cellPad,
        children: [para(run(""))],
      }),
      // Col 7: weighted score (blank)
      new TableCell({
        borders,
        width: { size: COL_WIDTHS[6], type: WidthType.DXA },
        margins: cellPad,
        children: [para(run(""))],
      }),
    ],
  });
}

const SECTION_COLORS = ["1B4F8A", "145A32", "7E5109", "6C3483", "212F3D"];

export async function exportToDocx(info, formData, paSections) {
  const tableRows = [];

  // Add column header
  tableRows.push(colHeaderRow());

  paSections.forEach((sec, sIdx) => {
    tableRows.push(headerRow(sec.title, SECTION_COLORS[sIdx % SECTION_COLORS.length]));
    sec.items.forEach(item => {
      const d = formData[item.code] || {};
      tableRows.push(dataRow(item, d));
    });
  });

  const mainTable = new Table({
    width: { size: TABLE_WIDTH_DXA, type: WidthType.DXA },
    columnWidths: COL_WIDTHS,
    rows: tableRows,
  });

  // Info table (top header section)
  const infoTable = new Table({
    width: { size: TABLE_WIDTH_DXA, type: WidthType.DXA },
    columnWidths: [2400, TABLE_WIDTH_DXA - 2400],
    rows: [
      infoRow("ชื่อ - สกุล :", info.name),
      infoRow("ตำแหน่ง :", info.position),
      infoRow("สังกัดหลักสูตร :", info.department),
      infoRow("คณะ :", info.faculty),
      infoRow("ผู้บังคับบัญชา :", info.supervisor),
      infoRow("รอบการประเมิน :", info.period),
      infoRow("ประเภทบุคลากร :", info.type || "พนักงานมหาวิทยาลัย"),
    ],
  });

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: FONT, size: FONT_SIZE },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,   // A4 short edge (portrait width) — docx-js swaps for landscape
              height: 16838,  // A4 long edge
              orientation: PageOrientation.LANDSCAPE,
            },
            margin: {
              top: MARGIN_DXA,
              right: MARGIN_DXA,
              bottom: MARGIN_DXA,
              left: MARGIN_DXA,
            },
          },
        },
        children: [
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 160 },
            children: [
              run("แบบประเมินผลการปฏิบัติงานบุคลากรสายวิชาการ", {
                bold: true,
                size: FONT_SIZE_TITLE,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 240 },
            children: [
              run("คณะศิลปศาสตร์ มหาวิทยาลัยมหิดล", {
                bold: true,
                size: FONT_SIZE_HEADER,
              }),
            ],
          }),
          // Info section
          infoTable,
          // Spacer
          new Paragraph({ spacing: { before: 120, after: 120 }, children: [run("")] }),
          // Main PA table
          mainTable,
          // Footer note
          new Paragraph({
            spacing: { before: 160, after: 60 },
            children: [
              run("หมายเหตุ: ", { bold: true, size: 18 }),
              run("🟢 = AI กรอกให้ (ตรวจสอบก่อน Submit)  |  🟡 = กรอกด้วยตนเอง  |  ⬜ = ยังว่าง", { size: 18, color: "555555" }),
            ],
          }),
          new Paragraph({
            spacing: { before: 40, after: 60 },
            children: [run(`สร้างโดย PA Assistant  |  วันที่พิมพ์: ${new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}`, { size: 18, color: "888888" })],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBlob(doc);
  const url = URL.createObjectURL(buffer);
  const a = document.createElement("a");
  const safeName = (info.name || "PA").replace(/\s/g, "_");
  a.href = url;
  a.download = `PA_${safeName}_2568.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
