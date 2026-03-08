import { useState, useCallback, useRef, useEffect } from "react";

// ─────────────────────────────────────────────
//  PA REQUIREMENTS DATA
// ─────────────────────────────────────────────
const PA_SECTIONS = [
  { id:1, title:"หมวด 1: ภาระงานด้านการเรียนการสอน", short:"การสอน", accent:"#60a5fa", bg:"#1e3a5f",
    items:[
      {code:"1.1.1",w:80, desc:"จำนวนชั่วโมงที่รับผิดชอบสอนของรายวิชาในคณะฯ",        hint:"270 ชม./รอบ = 10 | 219-269 = 9 | ลดหลั่นลงไป"},
      {code:"1.1.2",w:20, desc:"คุณภาพการสอน (คะแนน e-Evaluation)",                  hint:"≥4.50 = 10 | 4.20-4.49 = 9 | 3.90-4.19 = 8 | 3.50-3.89 = 7"},
      {code:"1.1.3",w:80, desc:"ควบคุมวิทยานิพนธ์/สารนิพนธ์",                        hint:"270 ชม./รอบ = 10"},
      {code:"1.1.4",w:20, desc:"ควบคุม Independent Study ระดับปริญญาตรี",             hint:"5 เรื่อง = 10 | 4 = 8 | 3 = 6 | 2 = 4 | 1 = 2"},
      {code:"1.1.5",w:20, desc:"คุณภาพการควบคุมวิทยานิพนธ์",                          hint:"≥4.50 = 10 | 4.20-4.49 = 9 ..."},
      {code:"1.1.6",w:50, desc:"ผลิตบทเรียนโครงการ e-learning",                       hint:"≥45 ชม. = 10"},
      {code:"1.1.7",w:10, desc:"อาจารย์รับเชิญสอน/อาจารย์นิเทศนักศึกษาฝึกงาน",      hint:"≥10 ชม./รอบ = 10"},
      {code:"1.1.8",w:20, desc:"ผ่านการประเมิน MUPSF หรือเทียบเท่า",                  hint:"ระดับ 3+ = 10 | ระดับ 2 = 8"},
      {code:"1.1.9",w:5,  desc:"จำนวนรายวิชาที่สอน",                                  hint:"≥5 วิชา = 10"},
      {code:"1.2.1",w:20, desc:"เอกสารประกอบการสอน",                                  hint:"1 เล่ม (≥15 บท) ตามเกณฑ์ ก.พ.อ. = 10"},
      {code:"1.2.2",w:30, desc:"เอกสารคำสอน",                                          hint:"1 เล่ม (≥15 บท) ตามเกณฑ์ ก.พ.อ. = 10"},
      {code:"1.2.3",w:50, desc:"ตำรา",                                                  hint:"1 เล่ม ตามเกณฑ์ ก.พ.อ. = 10"},
      {code:"1.3.1",w:15, desc:"สร้างรายวิชาใหม่ระดับปริญญาตรี (มคอ.3)",              hint:"อนุมัติจากสภา = 10"},
      {code:"1.3.2",w:25, desc:"ปรับปรุงหลักสูตร",                                     hint:"อนุมัติจากสภา = 10"},
      {code:"1.3.3",w:50, desc:"พัฒนาหลักสูตรใหม่ระดับปริญญา",                        hint:"อนุมัติจากสภา = 10"},
    ]
  },
  { id:2, title:"หมวด 2: ภาระงานวิจัยและงานวิชาการอื่น", short:"การวิจัย", accent:"#34d399", bg:"#052e16",
    items:[
      {code:"2.1.1",w:10,  desc:"โครงร่างงานวิจัย (IRB / Self-check)",                  hint:"ผ่าน IRB = 10"},
      {code:"2.1.2",w:30,  desc:"รายงานการวิจัยที่กำลังดำเนินการ",                       hint:"ตามแผน = 10 | ล่าช้าในกรอบ = 8 | ขยายเวลาครั้งที่ 1 = 6"},
      {code:"2.1.3",w:30,  desc:"ขนาดทุนวิจัยที่ได้รับ",                                 hint:"≥400,000 บาท = 10 | 300K-399K = 9 | 200K-299K = 8 ..."},
      {code:"2.1.4",w:30,  desc:"แหล่งทุนวิจัยที่ได้รับ",                                hint:"ทุนต่างประเทศ = 10 | ในประเทศ = 8 | ทุน มมอ. = 6 | ทุนคณะ = 4"},
      {code:"2.1.5",w:20,  desc:"หัวหน้าโครงการวิจัยร่วมกับส่วนงาน/สถาบันอื่น",        hint:"1 ชุด/รอบ = 10"},
      {code:"2.1.6",w:10,  desc:"หัวหน้าชุดโครงการวิจัย",                                hint:"1 ชุด/รอบ = 10"},
      {code:"2.2.1",w:100, desc:"บทความวิจัย (Research Article) ระดับนานาชาติ",          hint:"SCOPUS Q1 / WoS = 10 | Q2 = 8 | Q3/Q4 = 6"},
      {code:"2.2.2",w:70,  desc:"บทความปริทัศน์ (Review Article) ระดับนานาชาติ",         hint:"SCOPUS Q1 / WoS = 10 | Q2 = 8 | Q3/Q4 = 6"},
      {code:"2.2.3",w:50,  desc:"บทความวิชาการ (Academic Article) ระดับนานาชาติ",        hint:"SCOPUS Q1 / WoS = 10 | Q2 = 8 | Q3/Q4 = 6"},
      {code:"2.2.4",w:50,  desc:"บทความวิจัย (Research Article) ระดับชาติ",              hint:"TCI 1 / KCI = 10 | ต่ำกว่า = 5"},
      {code:"2.2.5",w:35,  desc:"บทความปริทัศน์ (Review Article) ระดับชาติ",             hint:"TCI 1 = 10"},
      {code:"2.2.6",w:25,  desc:"บทความวิชาการ (Academic Article) ระดับชาติ",            hint:"TCI 1 = 10"},
      {code:"2.3",  w:50,  desc:"ผลิต/เผยแพร่ผลงานวิชาการ 3 กลุ่ม (ตาม ก.พ.อ. 2564)",  hint:"1 ชิ้นงาน = 10"},
      {code:"2.4",  w:20,  desc:"นำเสนอผลงานในที่ประชุมวิชาการ",                         hint:"นานาชาติ = 10 | ชาติ = 5"},
      {code:"2.5",  w:40,  desc:"ผลงานวิจัย/วิชาการที่ได้รับรางวัล",                     hint:"ระดับชาติ+ = 10 | ระดับมหาวิทยาลัย = 5"},
      {code:"2.6",  w:40,  desc:"ผลงานร่วมนักวิจัยต่างสถาบัน ใน SCOPUS",                hint:"ต่างประเทศ = 10 | ในประเทศ = 8 | มมอ. = 5"},
      {code:"2.7",  w:20,  desc:"ผลงานสอดคล้อง SDGs ในวารสารฐาน SCOPUS",                hint:"1 ชิ้นงาน = 10"},
      {code:"2.8.1",w:20,  desc:"บทความวิจัยถูกอ้างอิงในวารสารวิชาการ",                   hint:"SCOPUS/WoS = 10 | TCI 1 = 6"},
      {code:"2.8.2",w:10,  desc:"ผลงานวิชาการอื่นๆ ที่ถูกอ้างอิง",                       hint:"SCOPUS/WoS = 10 | TCI 1 = 6"},
    ]
  },
  { id:3, title:"หมวด 3: ภาระงานด้านการบริการวิชาการ", short:"บริการวิชาการ", accent:"#fbbf24", bg:"#431407",
    items:[
      {code:"3.1", w:20, desc:"อาจารย์รับเชิญสอนภายนอกคณะ (ครั้งคราว)",                hint:"28-30 ชม. = 10 | 25-27 = 9 | ลดหลั่น"},
      {code:"3.2", w:20, desc:"อาจารย์รับเชิญสอนภายนอกคณะ (ทั้งรายวิชา)",              hint:"1 รายวิชา = 10"},
      {code:"3.3", w:40, desc:"วิทยากร/ผู้บรรยาย/เสวนา ภายในคณะฯ",                    hint:"≥28 ชม. = 10 | ลดหลั่น..."},
      {code:"3.4", w:30, desc:"วิทยากร/ผู้บรรยาย/เสวนา ภายนอกคณะ/มหาวิทยาลัย",       hint:"≥28 ชม. = 10 | ลดหลั่น..."},
      {code:"3.5", w:30, desc:"ผู้ทรงคุณวุฒิ/ผู้ประเมินผลงานวิชาการ/บทความ",           hint:"≥5 บท = 10 | 4 = 8 | 3 = 6 | 2 = 4 | 1 = 2"},
      {code:"3.6", w:30, desc:"Keynote Speaker ในงานประชุมวิชาการ",                      hint:"1 ครั้ง = 10"},
      {code:"3.7", w:20, desc:"เผยแพร่ความรู้ผ่านสื่อของคณะ/มหาวิทยาลัย",              hint:"Digital LAKM 1 เรื่อง หรือสื่ออื่น ≥5 เรื่อง = 10"},
      {code:"3.8", w:15, desc:"เผยแพร่ความรู้ผ่านสื่อภายนอกมหาวิทยาลัย",               hint:"≥5 เรื่อง = 10 | 4 = 8 | 3 = 6 | 2 = 4 | 1 = 2"},
      {code:"3.9", w:20, desc:"ออกข้อสอบ/พัฒนาคลังข้อสอบ MU-ELT/คณะ",                 hint:"≥46 ข้อ = 10"},
      {code:"3.10",w:30, desc:"บริการแปล/ปริวรรต ผ่านศูนย์การแปลฯ",                    hint:"≥28 หน้า = 10"},
      {code:"3.11",w:20, desc:"บริการแปล/ปริวรรต ไม่ผ่านศูนย์การแปลฯ",                 hint:"≥28 หน้า = 10"},
      {code:"3.12",w:30, desc:"บริการล่ามกับหน่วยงานภายใน/ภายนอก",                     hint:"≥19 ชม. = 10"},
      {code:"3.13",w:20, desc:"บริการวิชาการอื่นๆ ภายในคณะ",                            hint:"≥19 ชิ้นงาน = 10"},
      {code:"3.14",w:15, desc:"บริการวิชาการอื่นๆ ภายนอกคณะ",                           hint:"≥19 ชิ้นงาน = 10"},
      {code:"3.15",w:15, desc:"บรรณาธิการวารสารของคณะศิลปศาสตร์",                       hint:"1 ฉบับ ออกตามกำหนด = 10"},
      {code:"3.16",w:10, desc:"กองบรรณาธิการ/คณะกรรมการวารสาร คณะศิลปศาสตร์",          hint:"1 ฉบับ ออกตามกำหนด = 10"},
      {code:"3.17",w:30, desc:"ประธาน/ผู้รับผิดชอบโครงการบริการวิชาการเชิงยุทธศาสตร์",  hint:"1 โครงการ = 10"},
      {code:"3.18",w:20, desc:"กรรมการ/เลขาโครงการบริการวิชาการเชิงยุทธศาสตร์",         hint:"2 โครงการ = 10 | 1 = 5"},
      {code:"3.19",w:20, desc:"กรรมการบริการวิชาการต่อเนื่อง ระดับนานาชาติ",             hint:"2 หน่วยงาน = 10 | 1 = 5"},
      {code:"3.20",w:15, desc:"กรรมการบริการวิชาการต่อเนื่อง ระดับชาติ",                 hint:"2 หน่วยงาน = 10 | 1 = 5"},
      {code:"3.21",w:10, desc:"กรรมการบริการวิชาการครั้งคราว",                           hint:"2 หน่วยงาน = 10 | 1 = 5"},
      {code:"3.22",w:40, desc:"ควบคุมวิทยานิพนธ์บัณฑิตศึกษา (ภายนอกคณะ)",              hint:"≥270 ชม./รอบ = 10"},
      {code:"3.23",w:10, desc:"กรรมการสอบวิทยานิพนธ์/โครงร่าง (ไม่นับ Advisor)",       hint:"1 เรื่อง/คน = 10 (นับทวีคูณ)"},
      {code:"3.24",w:30, desc:"กรรมการตรวจประเมินคุณภาพ (EdPEx/AUN-QA)",                hint:"ประธาน EdPEx 1 ส่วนงาน = 10"},
    ]
  },
  { id:4, title:"หมวด 4: ภาระงานทำนุบำรุงศิลปวัฒนธรรม", short:"ทำนุฯ", accent:"#fb7185", bg:"#4c0519",
    items:[
      {code:"4.1.1",w:35, desc:"ประธาน/ผู้รับผิดชอบโครงการทำนุบำรุงฯ",               hint:"1 โครงการ = 10"},
      {code:"4.1.2",w:25, desc:"กรรมการ/เลขานุการโครงการทำนุบำรุงฯ",                  hint:"2 โครงการ = 10 | 1 = 5"},
      {code:"4.2",  w:50, desc:"เข้าร่วมโครงการทำนุฯ ของคณะ (สงกรานต์ ถวายพระพร ฯลฯ)",hint:"≥3 โครงการ = 10 | 2 = 7 | 1 = 4"},
      {code:"4.3",  w:25, desc:"เข้าร่วมกิจกรรมทำนุฯ มหาวิทยาลัย/ภายนอก",             hint:"≥3 โครงการ = 10 | 2 = 7 | 1 = 4"},
      {code:"4.4",  w:20, desc:"ตัวแทนคณะด้านทำนุบำรุงศิลปวัฒนธรรม",                  hint:"1 โครงการ = 10"},
      {code:"4.5",  w:15, desc:"กรรมการด้านศิลปวัฒนธรรม (ต่อเนื่องทั้งปี)",            hint:"1 หน่วยงาน = 10"},
      {code:"4.6",  w:5,  desc:"กรรมการด้านศิลปวัฒนธรรม (ครั้งคราว)",                  hint:"1 ชุด = 10"},
    ]
  },
  { id:5, title:"หมวด 5: ภาระงานส่วนกลางและงานอื่นๆ ที่ได้รับมอบหมาย", short:"งานอื่นๆ", accent:"#a78bfa", bg:"#2e1065",
    items:[
      {code:"5.1.1", w:40, desc:"กรรมการประจำคณะ (ประเภทผู้แทนคณาจารย์ประจำ)",         hint:"ดีมาก = 10 | ดี = 8 | พอใช้ = 6"},
      {code:"5.1.2", w:60, desc:"รองประธานหลักสูตร/เลขานุการหลักสูตร/ผู้แทนหมวดวิชาฯ", hint:"ดีมาก = 10 | ดี = 8 | พอใช้ = 6"},
      {code:"5.1.3", w:40, desc:"คณะกรรมการบริหารหลักสูตร/ผู้รับผิดชอบหลักสูตร",       hint:"ดีมาก = 10 | ดี = 8 | พอใช้ = 6"},
      {code:"5.1.4", w:20, desc:"ผู้ประสานงานรายวิชาที่ได้รับการแต่งตั้ง",              hint:"ดีมาก = 10 | ดี = 8 | พอใช้ = 6"},
      {code:"5.1.5", w:60, desc:"ประธานศูนย์ฯ ภายใต้หน่วยบริการวิชาการ",               hint:"ดีมาก = 10 | ดี = 8 | พอใช้ = 6"},
      {code:"5.1.6", w:30, desc:"รองประธาน/กรรมการศูนย์ฯ ภายใต้หน่วยบริการวิชาการ",   hint:"ดีมาก = 10 | ดี = 8 | พอใช้ = 6"},
      {code:"5.1.7", w:30, desc:"ภาระงานอื่นๆ ต่อเนื่องทั้งปี (กก.วิจัย/ประชาสัมพันธ์/KM ฯลฯ)",hint:"3 ชุด = 10 | 2 = 7 | 1 = 4"},
      {code:"5.1.8", w:20, desc:"ภาระงานอื่นๆ ครั้งคราว (กก.สอบ/กลั่นกรองข้อสอบ ฯลฯ)", hint:"5 ชุด = 10 | 4 = 8 | 3 = 6 | 2 = 4 | 1 = 2"},
      {code:"5.1.9", w:20, desc:"ประธาน/ผู้รับผิดชอบโครงการ/กิจกรรมของคณะ",            hint:"≥3 = 10 | 2 = 7 | 1 = 4"},
      {code:"5.1.10",w:15, desc:"กรรมการ/เลขานุการโครงการ/กิจกรรมของคณะ",              hint:"≥3 = 10 | 2 = 7 | 1 = 4"},
      {code:"5.1.11",w:10, desc:"ปฏิบัติภารกิจในนามคณะ (ประชุมมหาวิทยาลัย/ภายนอก)",   hint:"≥1 ครั้ง = 10"},
      {code:"5.2.1", w:30, desc:"อาจารย์ที่ปรึกษานักศึกษา",                            hint:"ดีมาก = 10 | ดี = 8 | พอใช้ = 6 (คณะกรรมการประเมิน)"},
      {code:"5.2.2", w:20, desc:"อาจารย์ที่ปรึกษาชุมนุม/ชมรมของคณะ/มหาวิทยาลัย",     hint:"≥2 ชุด = 10 | 1 ชุด = 5"},
      {code:"5.2.3", w:10, desc:"อาจารย์ฝึกซ้อม/ควบคุมนักศึกษาแข่งขัน/ประกวด",       hint:"รางวัลนานาชาติ = 10 | ชาติ = 8 | เข้าร่วม = 6"},
      {code:"5.3.1", w:30, desc:"เข้าร่วมกิจกรรม/โครงการต่างๆ ของคณะ",               hint:"≥8 = 10 | 7 = 9 | 6 = 8 | 5 = 7 | 4 = 6 | 3 = 5 | 2 = 3"},
      {code:"5.3.2", w:20, desc:"เข้าร่วมแข่งขัน/ประกวดในกิจกรรม/โครงการ",            hint:"≥3 = 10 | 2 = 7 | 1 = 4"},
      {code:"5.3.3", w:10, desc:"เข้าร่วมประชุม/กิจกรรม/โครงการภายนอก",               hint:"≥3 = 10 | 2 = 7 | 1 = 4"},
      {code:"5.3.4", w:15, desc:"กรรมการต่างๆ ต่อเนื่องทั้งปี (นอกบริการวิชาการ/ทำนุฯ)", hint:"≥2 ชุด = 10 | 1 ชุด = 5"},
      {code:"5.3.5", w:10, desc:"กรรมการต่างๆ ครั้งคราว (นอกบริการวิชาการ/ทำนุฯ)",     hint:"≥2 ชุด = 10 | 1 ชุด = 5"},
      {code:"5.3.6", w:10, desc:"เข้าร่วมประชุมสาขา/หมวดวิชาที่สังกัด",               hint:"ครบทุกครั้ง = 10 | ≥75% = 8 | ≥50% = 6"},
      {code:"5.3.7", w:10, desc:"เข้าร่วมประชุม Meet the Dean (หรือตามที่คณะฯ กำหนด)", hint:"ครบทุกครั้ง = 10 | 50-99% = 5"},
    ]
  }
];

const TOTAL = PA_SECTIONS.reduce((a,s) => a + s.items.length, 0);

// ─────────────────────────────────────────────
//  UTILITIES
// ─────────────────────────────────────────────
function initState() {
  const d = {};
  PA_SECTIONS.forEach(s => s.items.forEach(i => {
    d[i.code] = { activity: "", score: "", status: "empty", files: [] };
  }));
  return d;
}

function parseCodeFromFilename(name) {
  const clean = name.replace(/^[_\s]+/, "");
  // Patterns: 1_1_1_, 2_1_1, 3_3_, 5_1_8, etc.
  const m = clean.match(/^(\d+_\d+(?:_\d+)?)/);
  if (!m) return null;
  return m[1].replace(/_/g, ".");
}

async function fileToBase64(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onloadend = () => res(r.result.split(",")[1]);
    r.readAsDataURL(file);
  });
}

async function readFile(file) {
  if (file.type === "application/pdf") {
    const b64 = await fileToBase64(file);
    return { kind: "pdf", data: b64 };
  } else if (file.type.startsWith("image/")) {
    const b64 = await fileToBase64(file);
    return { kind: "image", data: b64, mime: file.type };
  } else if (file.name.match(/\.docx?$/i)) {
    try {
      const { default: mammoth } = await import("mammoth");
      const ab = await file.arrayBuffer();
      const r = await mammoth.extractRawText({ arrayBuffer: ab });
      return { kind: "text", content: r.value };
    } catch {
      const t = await file.text();
      return { kind: "text", content: t };
    }
  } else {
    const t = await file.text();
    return { kind: "text", content: t };
  }
}

async function callClaude(messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages })
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const d = await res.json();
  const txt = d.content?.find(b => b.type === "text")?.text || "";
  const clean = txt.replace(/```json|```/g, "").trim();
  try { return JSON.parse(clean); } catch { return { activity: txt, score: "" }; }
}

function generateWordDoc(info, formData) {
  const escape = s => String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>");
  const rows = PA_SECTIONS.map(sec => {
    const hdr = `<tr><td colspan="7" style="background:${sec.bg};color:white;font-weight:bold;padding:10px 14px;font-size:14pt">${sec.title}</td></tr>`;
    const cells = sec.items.map(item => {
      const d = formData[item.code] || {};
      const statusBg = d.status==="ai-filled" ? "#f0fdf4" : d.activity ? "#fffbeb" : "#ffffff";
      return `<tr style="background:${statusBg}">
        <td style="padding:7px 10px;border:1px solid #d1d5db;width:18%;vertical-align:top">
          <strong style="color:#1e3a5f">${item.code}</strong><br>
          <span style="font-size:11pt">${escape(item.desc)}</span>
        </td>
        <td style="padding:7px 10px;border:1px solid #d1d5db;width:40%;vertical-align:top">${escape(d.activity)}</td>
        <td style="padding:7px 10px;border:1px solid #d1d5db;text-align:center;vertical-align:middle">${item.w}</td>
        <td style="padding:7px 10px;border:1px solid #d1d5db;text-align:center;vertical-align:middle;font-size:16pt;font-weight:bold">${escape(d.score)}</td>
        <td style="padding:7px 10px;border:1px solid #d1d5db"></td>
        <td style="padding:7px 10px;border:1px solid #d1d5db"></td>
        <td style="padding:7px 10px;border:1px solid #d1d5db"></td>
      </tr>`;
    }).join("");
    return hdr + cells;
  }).join("");

  const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head><meta charset="UTF-8">
<style>
  body { font-family: 'TH Sarabun New','Sarabun',sans-serif; font-size: 14pt; margin: 2cm; }
  table { border-collapse: collapse; width: 100%; margin-top: 16pt; }
  td, th { font-family: 'TH Sarabun New','Sarabun',sans-serif; }
  h2 { text-align: center; color: #1e3a5f; font-size: 18pt; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 16px 0; }
  .info-item { font-size: 13pt; }
</style>
</head>
<body>
<h2>แบบประเมินผลการปฏิบัติงานบุคลากรสายวิชาการ</h2>
<p style="text-align:center;font-size:14pt">รอบการประเมิน ${escape(info.period)}</p>
<hr>
<table style="border:none;width:100%">
  <tr>
    <td style="border:none;padding:4px 0;width:50%"><strong>ชื่อ-สกุล:</strong> ${escape(info.name)}</td>
    <td style="border:none;padding:4px 0"><strong>ตำแหน่ง:</strong> ${escape(info.position)}</td>
  </tr>
  <tr>
    <td style="border:none;padding:4px 0"><strong>สังกัดหลักสูตร:</strong> ${escape(info.department)}</td>
    <td style="border:none;padding:4px 0"><strong>คณะ:</strong> ${escape(info.faculty)}</td>
  </tr>
  <tr>
    <td style="border:none;padding:4px 0" colspan="2"><strong>ผู้บังคับบัญชา:</strong> ${escape(info.supervisor)}</td>
  </tr>
</table>
<br>
<table>
  <thead>
    <tr style="background:#dbeafe">
      <th style="padding:10px;border:1px solid #93c5fd;text-align:center;font-size:13pt">(1) ภาระงาน</th>
      <th style="padding:10px;border:1px solid #93c5fd;text-align:center;font-size:13pt">(2) รายงานผลการปฏิบัติงาน</th>
      <th style="padding:10px;border:1px solid #93c5fd;text-align:center;font-size:13pt">(3) น้ำหนัก</th>
      <th style="padding:10px;border:1px solid #93c5fd;text-align:center;font-size:13pt">(4) ประเมินตนเอง (0-10)</th>
      <th style="padding:10px;border:1px solid #93c5fd;text-align:center;font-size:13pt">(5) ผู้บังคับบัญชา</th>
      <th style="padding:10px;border:1px solid #93c5fd;text-align:center;font-size:13pt">(6) คณะกรรมการ</th>
      <th style="padding:10px;border:1px solid #93c5fd;text-align:center;font-size:13pt">(6)×(3) คะแนนที่ได้</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
<br><p style="font-size:11pt;color:#6b7280">* สถานะ: เขียวอ่อน = AI กรอกให้ | เหลือง = กรอกด้วยตนเอง | ขาว = ยังไม่กรอก</p>
</body></html>`;

  const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `PA_${info.name.replace(/\s/g,"_")}_2568.doc`;
  a.click(); URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────
//  SUB COMPONENTS
// ─────────────────────────────────────────────

function Pill({ text, color = "#334155", textColor = "#94a3b8" }) {
  return (
    <span style={{ display:"inline-flex",alignItems:"center",padding:"2px 8px",borderRadius:99,background:color,color:textColor,fontSize:11,fontWeight:600,lineHeight:1.6 }}>
      {text}
    </span>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const bg = toast.type === "error" ? "#dc2626" : toast.type === "info" ? "#0891b2" : "#059669";
  return (
    <div style={{ position:"fixed",top:20,right:20,zIndex:9999,padding:"12px 20px",borderRadius:10,background:bg,color:"white",fontSize:13,fontWeight:500,boxShadow:"0 8px 32px rgba(0,0,0,0.4)",maxWidth:380,lineHeight:1.5 }}>
      {toast.msg}
    </div>
  );
}

function FileCard({ f, onRemove, onAssign, sections }) {
  const ext = f.name.split(".").pop().toUpperCase();
  const extColor = ext==="PDF" ? "#ef4444" : ext==="DOCX"||ext==="DOC" ? "#3b82f6" : "#8b5cf6";
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div style={{ background:"#1e293b",border:"1px solid #334155",borderRadius:8,padding:"10px 12px",marginBottom:8,position:"relative" }}>
      <div style={{ display:"flex",alignItems:"flex-start",gap:8 }}>
        <div style={{ width:32,height:32,borderRadius:6,background:extColor,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:9,fontWeight:700,color:"white" }}>
          {ext.slice(0,3)}
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <p style={{ margin:0,fontSize:12,color:"#f1f5f9",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
            {f.name}
          </p>
          <div style={{ display:"flex",gap:6,marginTop:4,flexWrap:"wrap" }}>
            {f.assignedCode ? (
              <span style={{ cursor:"pointer",padding:"2px 8px",borderRadius:99,background:"#134e4a",color:"#34d399",fontSize:11,fontWeight:600 }} onClick={() => setShowPicker(p=>!p)}>
                ↔ {f.assignedCode}
              </span>
            ) : (
              <span style={{ cursor:"pointer",padding:"2px 8px",borderRadius:99,background:"#1e3a5f",color:"#93c5fd",fontSize:11 }} onClick={() => setShowPicker(p=>!p)}>
                + กำหนดรหัส
              </span>
            )}
          </div>
        </div>
        <button onClick={onRemove} style={{ background:"none",border:"none",color:"#475569",cursor:"pointer",fontSize:14,padding:"0 2px",lineHeight:1 }}>×</button>
      </div>
      {showPicker && (
        <div style={{ position:"absolute",left:0,right:0,top:"100%",zIndex:100,background:"#1e293b",border:"1px solid #334155",borderRadius:8,boxShadow:"0 8px 32px rgba(0,0,0,0.4)",maxHeight:240,overflowY:"auto",marginTop:4 }}>
          <div style={{ padding:"6px 10px",fontSize:11,color:"#64748b",borderBottom:"1px solid #334155",fontWeight:600 }}>เลือกเกณฑ์</div>
          {sections.map(sec => (
            <div key={sec.id}>
              <div style={{ padding:"4px 10px",fontSize:10,color:sec.accent,fontWeight:700,background:"rgba(0,0,0,0.2)" }}>{sec.short}</div>
              {sec.items.map(item => (
                <div key={item.code} onClick={() => { onAssign(item.code); setShowPicker(false); }} style={{ padding:"5px 12px",fontSize:11,color:"#cbd5e1",cursor:"pointer" }} onMouseOver={e=>e.currentTarget.style.background="#334155"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                  {item.code} — {item.desc.slice(0,45)}{item.desc.length>45?"…":""}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CriterionRow({ item, d, filesList, onUpdate, onExtract, isExtracting }) {
  const [showHint, setShowHint] = useState(false);
  const statusColor = d.status==="ai-filled" ? "#34d399" : d.activity ? "#fbbf24" : "#475569";
  const statusLabel = d.status==="ai-filled" ? "AI" : d.activity ? "✓" : "—";

  return (
    <div style={{ display:"grid",gridTemplateColumns:"1fr auto",gap:0,borderBottom:"1px solid #1e293b",padding:"10px 16px 12px" }}>
      {/* Left: code + desc + files */}
      <div style={{ display:"grid",gridTemplateColumns:"80px 1fr",gap:10 }}>
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
            <span style={{ width:8,height:8,borderRadius:99,background:statusColor,display:"inline-block",flexShrink:0 }} />
            <span style={{ fontFamily:"monospace",fontWeight:700,fontSize:12,color:"#94a3b8" }}>{item.code}</span>
          </div>
          <span style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:36,height:20,borderRadius:4,background:"#0f172a",color:"#64748b",fontSize:10,fontWeight:700 }}>
            ×{item.w}
          </span>
          {filesList.length > 0 && (
            <div style={{ marginTop:6,display:"flex",flexDirection:"column",gap:2 }}>
              {filesList.map((f,i) => (
                <span key={i} style={{ fontSize:9,color:"#34d399",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:72 }}>📎 {f.name}</span>
              ))}
            </div>
          )}
        </div>
        <div>
          {/* Description */}
          <p style={{ margin:"0 0 6px",fontSize:12,color:"#94a3b8",lineHeight:1.4 }}>
            {item.desc}
            <span style={{ cursor:"pointer",marginLeft:6,fontSize:10,color:"#3b82f6" }} onClick={() => setShowHint(h=>!h)}>
              {showHint ? "▲" : "ℹ"}
            </span>
          </p>
          {showHint && <p style={{ margin:"0 0 6px",fontSize:11,color:"#64748b",background:"#1e293b",padding:"4px 8px",borderRadius:4,lineHeight:1.4 }}>{item.hint}</p>}
          {/* Activity textarea */}
          <textarea
            value={d.activity}
            onChange={e => onUpdate(item.code, "activity", e.target.value)}
            placeholder="อธิบายกิจกรรม/ผลการปฏิบัติงาน..."
            rows={d.activity ? Math.max(2, d.activity.split("\n").length + 1) : 2}
            style={{ width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:6,color:"#e2e8f0",fontSize:12,padding:"7px 10px",resize:"vertical",fontFamily:"'Sarabun',sans-serif",lineHeight:1.5,boxSizing:"border-box" }}
          />
        </div>
      </div>
      {/* Right: score + extract btn */}
      <div style={{ width:90,paddingLeft:12,display:"flex",flexDirection:"column",alignItems:"center",gap:8,paddingTop:2 }}>
        <div style={{ fontSize:10,color:"#475569",fontWeight:600 }}>คะแนน (0-10)</div>
        <input
          type="number" min={0} max={10} step={0.5}
          value={d.score}
          onChange={e => onUpdate(item.code, "score", e.target.value)}
          style={{ width:60,background:"#0f172a",border:"1px solid #334155",borderRadius:6,color:"#f59e0b",fontSize:18,fontWeight:700,textAlign:"center",padding:"6px 4px" }}
        />
        <button
          onClick={() => onExtract(item)}
          disabled={isExtracting || filesList.length===0}
          title={filesList.length===0 ? "ต้องแนบไฟล์ก่อน" : "ให้ AI สกัดข้อมูล"}
          style={{ width:68,padding:"5px 0",borderRadius:6,border:"none",background: filesList.length===0 ? "#1e293b" : isExtracting ? "#334155" : "linear-gradient(135deg,#0891b2,#0284c7)",color: filesList.length===0 ? "#334155" : "white",fontSize:11,cursor: filesList.length===0 ? "not-allowed" : "pointer",fontWeight:500 }}
        >
          {isExtracting ? "..." : "⚡ AI"}
        </button>
        <div style={{ fontSize:10,color:statusColor,fontWeight:600 }}>{statusLabel}</div>
      </div>
    </div>
  );
}

function SectionPanel({ sec, formData, files, onUpdate, onExtract, extracting, getFiles, isOpen, onToggle }) {
  const filled = sec.items.filter(i => formData[i.code]?.activity).length;
  const pct = Math.round((filled/sec.items.length)*100);

  return (
    <div style={{ borderBottom:`2px solid ${sec.bg}`, marginBottom:2 }}>
      {/* Section header */}
      <div
        onClick={onToggle}
        style={{ display:"flex",alignItems:"center",gap:12,padding:"12px 20px",cursor:"pointer",background:`linear-gradient(135deg, ${sec.bg}dd 0%, #0f172a 100%)`,userSelect:"none" }}
      >
        <div style={{ flex:1 }}>
          <span style={{ fontWeight:700,fontSize:14,color:"#f1f5f9" }}>{sec.title}</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ width:80,height:4,background:"#1e293b",borderRadius:2 }}>
            <div style={{ width:`${pct}%`,height:"100%",background:sec.accent,borderRadius:2,transition:"width 0.5s" }} />
          </div>
          <span style={{ fontSize:12,color:"#64748b",minWidth:50,textAlign:"right" }}>{filled}/{sec.items.length}</span>
          <span style={{ color:sec.accent,fontSize:16,transform: isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s" }}>▼</span>
        </div>
      </div>
      {/* Items */}
      {isOpen && (
        <div style={{ background:"#111827" }}>
          {sec.items.map(item => (
            <CriterionRow
              key={item.code}
              item={item}
              d={formData[item.code] || {activity:"",score:"",status:"empty"}}
              filesList={getFiles(item.code)}
              onUpdate={onUpdate}
              onExtract={onExtract}
              isExtracting={extracting === item.code}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────
export default function PAAssistant() {
  const [info, setInfo] = useState({
    name: "อาจารย์ ดร.พยุงศักดิ์ แก่นจันทร์",
    position: "อาจารย์",
    department: "หลักสูตรศิลปศาสตรบัณฑิต สาขาวิชาภาษาอังกฤษ",
    faculty: "ศิลปศาสตร์ มหาวิทยาลัยมหิดล",
    supervisor: "อาจารย์ ดร. อนุชยาน์ มนทการติวงศ์",
    period: "1 ก.ค. 2567 – 30 มิ.ย. 2568",
    type: "พนักงานมหาวิทยาลัย"
  });
  const [formData, setFormData] = useState(initState);
  const [files, setFiles] = useState([]);
  const [openSections, setOpenSections] = useState(new Set([1]));
  const [extracting, setExtracting] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [tab, setTab] = useState("form"); // "form" | "info"
  const fileInputRef = useRef();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const processFiles = useCallback((rawFiles) => {
    const added = rawFiles.map(f => {
      const code = parseCodeFromFilename(f.name);
      return { id: `${Date.now()}-${Math.random()}`, file: f, name: f.name, size: f.size, assignedCode: code };
    });
    setFiles(prev => {
      const existing = new Set(prev.map(x => x.name));
      return [...prev, ...added.filter(a => !existing.has(a.name))];
    });
    const auto = added.filter(a => a.assignedCode).length;
    if (auto > 0) showToast(`📂 เพิ่ม ${added.length} ไฟล์ | จับคู่อัตโนมัติ ${auto} รายการ`);
    else showToast(`📂 เพิ่ม ${added.length} ไฟล์`);
  }, []);

  const handleDrop = useCallback(e => {
    e.preventDefault(); setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) processFiles(dropped);
  }, [processFiles]);

  const getFilesForCode = (code) => files.filter(f => f.assignedCode === code);
  const assignFile = (fileId, code) => setFiles(prev => prev.map(f => f.id===fileId ? {...f,assignedCode:code} : f));
  const updateField = (code, field, val) => setFormData(prev => ({ ...prev, [code]: { ...prev[code], [field]: val, status: field==="activity" && val ? (prev[code]?.status==="ai-filled"?"ai-filled":"manual") : prev[code]?.status } }));
  const toggleSection = id => setOpenSections(prev => { const n=new Set(prev); n.has(id)?n.delete(id):n.add(id); return n; });

  const extractForItem = async (item) => {
    const fList = getFilesForCode(item.code);
    if (!fList.length) { showToast("ต้องแนบไฟล์หลักฐานก่อน", "error"); return; }
    setExtracting(item.code);
    try {
      const contents = await Promise.all(fList.map(af => readFile(af.file)));
      const parts = contents.map((c, i) => {
        if (c.kind === "pdf") return { type:"document", source:{ type:"base64", media_type:"application/pdf", data:c.data }};
        if (c.kind === "image") return { type:"image", source:{ type:"base64", media_type:c.mime, data:c.data }};
        return { type:"text", text:`\nเนื้อหาไฟล์ "${fList[i].name}":\n${c.content}\n` };
      });
      parts.push({ type:"text", text:`\nเกณฑ์: ${item.code} – ${item.desc}\nน้ำหนัก: ${item.w} | เกณฑ์คะแนน: ${item.hint}\n\nให้สรุปกิจกรรม/ผลการปฏิบัติงานที่ตรงกับเกณฑ์นี้ (ภาษาไทย กระชับ 2-4 ประโยค) และแนะนำคะแนน 0-10` });
      const result = await callClaude(
        [{ role:"user", content: parts }],
        `คุณเป็นผู้ช่วยกรอกแบบประเมินผลการปฏิบัติงาน (PA) ของอาจารย์คณะศิลปศาสตร์ มหาวิทยาลัยมหิดล วิเคราะห์เอกสารหลักฐานแล้วตอบเป็น JSON เท่านั้น รูปแบบ: {"activity":"คำอธิบายกิจกรรม (ภาษาไทย กระชับ)","score":"ตัวเลข 1-10"}`
      );
      setFormData(prev => ({ ...prev, [item.code]: { ...prev[item.code], activity: result.activity||"", score: result.score||"", status:"ai-filled" }}));
      showToast(`✓ AI กรอก ${item.code} สำเร็จ`);
    } catch(e) {
      showToast(`เกิดข้อผิดพลาด: ${e.message}`, "error");
    } finally { setExtracting(null); }
  };

  const extractAll = async () => {
    const codes = [...new Set(files.filter(f=>f.assignedCode).map(f=>f.assignedCode))];
    if (!codes.length) { showToast("ไม่มีไฟล์ที่กำหนดรหัสเกณฑ์", "error"); return; }
    showToast(`⚡ เริ่มสกัดข้อมูล ${codes.length} รายการ...`, "info");
    for (const code of codes) {
      const item = PA_SECTIONS.flatMap(s=>s.items).find(i=>i.code===code);
      if (item) { await extractForItem(item); await new Promise(r=>setTimeout(r,500)); }
    }
    showToast(`✅ สกัดข้อมูลครบทั้งหมด ${codes.length} รายการ`);
  };

  const filled = Object.values(formData).filter(d=>d.activity).length;
  const pct = Math.round((filled/TOTAL)*100);

  return (
    <div style={{ fontFamily:"'Sarabun',sans-serif",background:"#0f172a",minHeight:"100vh",color:"#e2e8f0",display:"flex",flexDirection:"column" }}>
      <Toast toast={toast} />

      {/* ══ HEADER ══ */}
      <div style={{ background:"linear-gradient(135deg,#0c1a2e 0%,#1e3a5f 100%)",borderBottom:"1px solid #1e293b",padding:"14px 20px",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:16 }}>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex",alignItems:"baseline",gap:10 }}>
              <h1 style={{ margin:0,fontSize:20,fontWeight:800,color:"#f8fafc",letterSpacing:-0.5 }}>PA Assistant</h1>
              <span style={{ fontSize:12,color:"#60a5fa",fontWeight:500 }}>คณะศิลปศาสตร์ มหาวิทยาลัยมหิดล</span>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:6 }}>
              <div style={{ height:6,width:200,background:"#1e293b",borderRadius:3 }}>
                <div style={{ height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,#3b82f6,#10b981)`,borderRadius:3,transition:"width 0.6s" }} />
              </div>
              <span style={{ fontSize:12,color:"#64748b" }}><span style={{ color:"#f59e0b",fontWeight:700 }}>{filled}</span>/{TOTAL} รายการ ({pct}%)</span>
            </div>
          </div>
          <div style={{ display:"flex",gap:8 }}>
            <button onClick={() => setShowInfo(h=>!h)} style={{ padding:"7px 14px",borderRadius:8,border:"1px solid #334155",background:"#1e293b",color:"#94a3b8",fontSize:12,cursor:"pointer" }}>
              👤 ข้อมูลส่วนตัว
            </button>
            <button onClick={extractAll} style={{ padding:"7px 16px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#0891b2,#0369a1)",color:"white",fontSize:12,fontWeight:600,cursor:"pointer" }}>
              ⚡ AI สกัดทั้งหมด
            </button>
            <button onClick={() => generateWordDoc(info, formData)} style={{ padding:"7px 16px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#16a34a,#15803d)",color:"white",fontSize:12,fontWeight:600,cursor:"pointer" }}>
              📥 Export Word
            </button>
          </div>
        </div>
      </div>

      {/* ══ PERSONAL INFO PANEL ══ */}
      {showInfo && (
        <div style={{ background:"#1e293b",borderBottom:"1px solid #334155",padding:"16px 20px" }}>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
            {[
              ["name","ชื่อ-สกุล"],["position","ตำแหน่ง"],["department","สังกัดหลักสูตร"],
              ["faculty","คณะ"],["supervisor","ผู้บังคับบัญชา"],["period","รอบการประเมิน"]
            ].map(([key,label]) => (
              <div key={key}>
                <label style={{ display:"block",fontSize:11,color:"#64748b",marginBottom:4,fontWeight:600 }}>{label}</label>
                <input
                  value={info[key]}
                  onChange={e => setInfo(p=>({...p,[key]:e.target.value}))}
                  style={{ width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:6,color:"#e2e8f0",fontSize:12,padding:"6px 10px",boxSizing:"border-box" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ MAIN BODY ══ */}
      <div style={{ display:"grid",gridTemplateColumns:"300px 1fr",flex:1,minHeight:0,overflow:"hidden" }}>

        {/* ── LEFT: FILE PANEL ── */}
        <div style={{ background:"#1e293b",borderRight:"1px solid #334155",display:"flex",flexDirection:"column",overflow:"hidden" }}>
          <div style={{ padding:"14px 16px",borderBottom:"1px solid #334155" }}>
            <p style={{ margin:0,fontSize:13,fontWeight:700,color:"#f1f5f9" }}>📁 ไฟล์หลักฐาน</p>
            <p style={{ margin:"3px 0 0",fontSize:11,color:"#64748b" }}>{files.length} ไฟล์ | ลากมาวางหรือคลิกเลือก</p>
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            style={{ margin:"12px 12px 0",border:`2px dashed ${isDragging?"#3b82f6":"#334155"}`,borderRadius:10,padding:"20px 12px",textAlign:"center",cursor:"pointer",background: isDragging?"rgba(59,130,246,0.08)":"transparent",transition:"all 0.2s" }}
          >
            <div style={{ fontSize:28 }}>📂</div>
            <p style={{ margin:"8px 0 4px",fontSize:12,color:"#94a3b8" }}>ลากไฟล์มาวางที่นี่</p>
            <p style={{ margin:0,fontSize:10,color:"#475569" }}>PDF · DOCX · JPG · PNG</p>
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style={{ display:"none" }} onChange={e => processFiles(Array.from(e.target.files))} />
          </div>

          {/* File list */}
          <div style={{ flex:1,overflowY:"auto",padding:"10px 12px" }}>
            {files.length === 0 ? (
              <div style={{ textAlign:"center",padding:"30px 16px" }}>
                <p style={{ color:"#334155",fontSize:12,lineHeight:1.6 }}>ยังไม่มีไฟล์<br/>ระบบจะจับคู่ไฟล์กับเกณฑ์อัตโนมัติ<br/>จากชื่อไฟล์ เช่น "2_1_1_IRB..."</p>
              </div>
            ) : (
              files.map(f => (
                <FileCard key={f.id} f={f} sections={PA_SECTIONS}
                  onRemove={() => setFiles(prev => prev.filter(x=>x.id!==f.id))}
                  onAssign={(code) => assignFile(f.id, code)}
                />
              ))
            )}
          </div>

          {/* Quick stats */}
          {files.length > 0 && (
            <div style={{ padding:"10px 16px",borderTop:"1px solid #334155",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:20,fontWeight:700,color:"#34d399" }}>{files.filter(f=>f.assignedCode).length}</div>
                <div style={{ fontSize:10,color:"#64748b" }}>จับคู่แล้ว</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:20,fontWeight:700,color:"#fbbf24" }}>{files.filter(f=>!f.assignedCode).length}</div>
                <div style={{ fontSize:10,color:"#64748b" }}>รอกำหนดรหัส</div>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: PA FORM ── */}
        <div style={{ overflowY:"auto",background:"#0f172a" }}>
          {/* Section nav pills */}
          <div style={{ display:"flex",gap:6,padding:"12px 20px",borderBottom:"1px solid #1e293b",flexWrap:"wrap",position:"sticky",top:0,background:"#0f172a",zIndex:10 }}>
            {PA_SECTIONS.map(sec => {
              const secFilled = sec.items.filter(i=>formData[i.code]?.activity).length;
              return (
                <button key={sec.id} onClick={() => { setOpenSections(p=>{ const n=new Set(p); n.has(sec.id)?n.delete(sec.id):n.add(sec.id); return n; }); }}
                  style={{ padding:"5px 14px",borderRadius:99,border:`1px solid ${openSections.has(sec.id)?sec.accent+"66":"#1e293b"}`,background: openSections.has(sec.id)?`${sec.bg}cc`:"transparent",color:openSections.has(sec.id)?sec.accent:"#475569",fontSize:11,fontWeight:600,cursor:"pointer",transition:"all 0.2s" }}>
                  {sec.short} ({secFilled}/{sec.items.length})
                </button>
              );
            })}
          </div>

          {/* PA sections accordion */}
          {PA_SECTIONS.map(sec => (
            <SectionPanel key={sec.id} sec={sec} formData={formData} files={files}
              onUpdate={updateField}
              onExtract={extractForItem}
              extracting={extracting}
              getFiles={getFilesForCode}
              isOpen={openSections.has(sec.id)}
              onToggle={() => toggleSection(sec.id)}
            />
          ))}

          {/* Footer */}
          <div style={{ padding:"20px",textAlign:"center",color:"#334155",fontSize:11 }}>
            🟢 AI กรอก &nbsp;|&nbsp; 🟡 กรอกเอง &nbsp;|&nbsp; ⚫ ยังว่าง &nbsp;|&nbsp;
            คะแนนสีเขียวจาก AI เป็นเพียงข้อเสนอแนะ โปรดตรวจสอบก่อน Export
          </div>
        </div>
      </div>
    </div>
  );
}
