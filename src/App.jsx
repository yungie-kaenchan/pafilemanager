import { useState, useCallback, useRef, useEffect } from "react";
import { exportToDocx } from "./docxExport";

const T = {
  bg:"#f4f6fb",surface:"#ffffff",surfaceAlt:"#f8f9fc",border:"#dde3f0",borderMid:"#b0bcda",
  primary:"#1a2f6e",primaryDark:"#111e4a",primaryLight:"#2d4fa3",primaryBg:"#eef1fa",
  text:"#0d1424",textMid:"#1e2d52",textLight:"#4a5980",textMuted:"#7a8aaa",accent:"#1a2f6e",
  aiGreen:"#166534",warn:"#b45309",err:"#dc2626",
  shadow:"0 2px 12px rgba(26,47,110,0.10)",shadowMd:"0 4px 24px rgba(26,47,110,0.14)",
};

const PA_SECTIONS=[{id:1,title:"หมวด 1: ภาระงานด้านการเรียนการสอน",short:"การสอน",accent:"#1a2f6e",items:[{code:"1.1.1",w:80,desc:"จำนวนชั่วโมงที่รับผิดชอบสอนของรายวิชาในคณะฯ",hint:"270 ชม. = 10 | 219-269 = 9 | 192-218 = 8"},{code:"1.1.2",w:20,desc:"คุณภาพการสอน (คะแนน e-Evaluation)",hint:"≥4.50 = 10 | 4.20-4.49 = 9 | 3.90-4.19 = 8"},{code:"1.1.3",w:80,desc:"ควบคุมวิทยานิพนธ์/สารนิพนธ์",hint:"270 ชม./รอบ = 10"},{code:"1.1.4",w:20,desc:"ควบคุม Independent Study ระดับปริญญาตรี",hint:"5 เรื่อง = 10 | 4 = 8 | 3 = 6"},{code:"1.1.5",w:20,desc:"คุณภาพการควบคุมวิทยานิพนธ์",hint:"≥4.50 = 10 | 4.20-4.49 = 9"},{code:"1.1.6",w:50,desc:"ผลิตบทเรียนโครงการ e-learning",hint:"≥45 ชม. = 10"},{code:"1.1.7",w:10,desc:"อาจารย์รับเชิญสอน/อาจารย์นิเทศนักศึกษาฝึกงาน",hint:"≥10 ชม./รอบ = 10"},{code:"1.1.8",w:20,desc:"ผ่านการประเมิน MUPSF หรือเทียบเท่า",hint:"ระดับ 3+ = 10 | ระดับ 2 = 8"},{code:"1.1.9",w:5,desc:"จำนวนรายวิชาที่สอน",hint:"≥5 วิชา = 10"},{code:"1.2.1",w:20,desc:"เอกสารประกอบการสอน",hint:"1 เล่ม (≥15 บท) = 10"},{code:"1.2.2",w:30,desc:"เอกสารคำสอน",hint:"1 เล่ม (≥15 บท) = 10"},{code:"1.2.3",w:50,desc:"ตำรา",hint:"1 เล่ม ตามเกณฑ์ ก.พ.อ. = 10"},{code:"1.3.1",w:15,desc:"สร้างรายวิชาใหม่ระดับปริญญาตรี (มคอ.3)",hint:"อนุมัติจากสภา = 10"},{code:"1.3.2",w:25,desc:"ปรับปรุงหลักสูตร",hint:"อนุมัติจากสภา = 10"},{code:"1.3.3",w:50,desc:"พัฒนาหลักสูตรใหม่ระดับปริญญา",hint:"อนุมัติจากสภา = 10"}]},{id:2,title:"หมวด 2: ภาระงานวิจัยและงานวิชาการอื่น",short:"การวิจัย",accent:"#163a7a",items:[{code:"2.1.1",w:10,desc:"โครงร่างงานวิจัย (IRB / Self-check)",hint:"ผ่าน IRB = 10"},{code:"2.1.2",w:30,desc:"รายงานการวิจัยที่กำลังดำเนินการ",hint:"ตามแผน = 10 | ล่าช้าในกรอบ = 8"},{code:"2.1.3",w:30,desc:"ขนาดทุนวิจัยที่ได้รับ",hint:"≥400,000 บาท = 10"},{code:"2.1.4",w:30,desc:"แหล่งทุนวิจัยที่ได้รับ",hint:"ทุนต่างประเทศ = 10"},{code:"2.1.5",w:20,desc:"หัวหน้าโครงการวิจัยร่วมกับส่วนงาน",hint:"1 ชุด/รอบ = 10"},{code:"2.1.6",w:10,desc:"หัวหน้าชุดโครงการวิจัย",hint:"1 ชุด/รอบ = 10"},{code:"2.2.1",w:100,desc:"บทความวิจัย (Research Article) นานาชาติ",hint:"SCOPUS Q1/WoS = 10 | Q2 = 8 | Q3/Q4 = 6"},{code:"2.2.2",w:70,desc:"บทความปริทัศน์ (Review Article) นานาชาติ",hint:"SCOPUS Q1/WoS = 10 | Q2 = 8"},{code:"2.2.3",w:50,desc:"บทความวิชาการ (Academic Article) นานาชาติ",hint:"SCOPUS Q1/WoS = 10"},{code:"2.2.4",w:50,desc:"บทความวิจัย (Research Article) ระดับชาติ",hint:"TCI 1/KCI = 10"},{code:"2.2.5",w:35,desc:"บทความปริทัศน์ (Review Article) ชาติ",hint:"TCI 1 = 10"},{code:"2.2.6",w:25,desc:"บทความวิชาการ (Academic Article) ชาติ",hint:"TCI 1 = 10"},{code:"2.3",w:50,desc:"ผลิต/เผยแพร่ผลงานวิชาการ 3 กลุ่ม (ก.พ.อ. 2564)",hint:"1 ชิ้นงาน = 10"},{code:"2.4",w:20,desc:"นำเสนอผลงานในที่ประชุมวิชาการ",hint:"นานาชาติ = 10 | ชาติ = 5"},{code:"2.5",w:40,desc:"ผลงานวิจัย/วิชาการที่ได้รับรางวัล",hint:"ระดับชาติ+ = 10"},{code:"2.6",w:40,desc:"ผลงานร่วมนักวิจัยต่างสถาบัน ใน SCOPUS",hint:"ต่างประเทศ = 10 | ในประเทศ = 8"},{code:"2.7",w:20,desc:"ผลงานสอดคล้อง SDGs ใน SCOPUS",hint:"1 ชิ้นงาน = 10"},{code:"2.8.1",w:20,desc:"บทความวิจัยถูกอ้างอิงในวารสารวิชาการ",hint:"SCOPUS/WoS = 10"},{code:"2.8.2",w:10,desc:"ผลงานวิชาการอื่นๆ ที่ถูกอ้างอิง",hint:"SCOPUS/WoS = 10"}]},{id:3,title:"หมวด 3: ภาระงานด้านการบริการวิชาการ",short:"บริการวิชาการ",accent:"#1e3a5f",items:[{code:"3.1",w:20,desc:"อาจารย์รับเชิญสอนภายนอกคณะ (ครั้งคราว)",hint:"28-30 ชม. = 10"},{code:"3.2",w:20,desc:"อาจารย์รับเชิญสอนภายนอกคณะ (ทั้งรายวิชา)",hint:"1 รายวิชา = 10"},{code:"3.3",w:40,desc:"วิทยากร/ผู้บรรยาย/เสวนา ภายในคณะฯ",hint:"≥28 ชม. = 10"},{code:"3.4",w:30,desc:"วิทยากร/ผู้บรรยาย/เสวนา ภายนอกคณะ",hint:"≥28 ชม. = 10"},{code:"3.5",w:30,desc:"ผู้ทรงคุณวุฒิ/ผู้ประเมินผลงานวิชาการ/บทความ",hint:"≥5 บท = 10"},{code:"3.6",w:30,desc:"Keynote Speaker ในงานประชุมวิชาการ",hint:"1 ครั้ง = 10"},{code:"3.7",w:20,desc:"เผยแพร่ความรู้ผ่านสื่อของคณะ/มหาวิทยาลัย",hint:"1 เรื่อง = 10"},{code:"3.8",w:15,desc:"เผยแพร่ความรู้ผ่านสื่อภายนอก",hint:"≥5 เรื่อง = 10"},{code:"3.9",w:20,desc:"ออกข้อสอบ/พัฒนาคลังข้อสอบ",hint:"≥46 ข้อ = 10"},{code:"3.10",w:30,desc:"บริการแปล/ปริวรรต ผ่านศูนย์การแปลฯ",hint:"≥28 หน้า = 10"},{code:"3.11",w:20,desc:"บริการแปล/ปริวรรต ไม่ผ่านศูนย์การแปลฯ",hint:"≥28 หน้า = 10"},{code:"3.12",w:30,desc:"บริการล่ามกับหน่วยงาน",hint:"≥19 ชม. = 10"},{code:"3.13",w:20,desc:"บริการวิชาการอื่นๆ ภายในคณะ",hint:"≥19 ชิ้นงาน = 10"},{code:"3.14",w:15,desc:"บริการวิชาการอื่นๆ ภายนอกคณะ",hint:"≥19 ชิ้นงาน = 10"},{code:"3.15",w:15,desc:"บรรณาธิการวารสารของคณะศิลปศาสตร์",hint:"1 ฉบับ = 10"},{code:"3.16",w:10,desc:"กองบรรณาธิการวารสารคณะศิลปศาสตร์",hint:"1 ฉบับ = 10"},{code:"3.17",w:30,desc:"ประธาน/ผู้รับผิดชอบโครงการบริการวิชาการ",hint:"1 โครงการ = 10"},{code:"3.18",w:20,desc:"กรรมการ/เลขาโครงการบริการวิชาการ",hint:"2 โครงการ = 10"},{code:"3.19",w:20,desc:"กรรมการบริการวิชาการต่อเนื่อง นานาชาติ",hint:"2 หน่วยงาน = 10"},{code:"3.20",w:15,desc:"กรรมการบริการวิชาการต่อเนื่อง ชาติ",hint:"2 หน่วยงาน = 10"},{code:"3.21",w:10,desc:"กรรมการบริการวิชาการครั้งคราว",hint:"2 หน่วยงาน = 10"},{code:"3.22",w:40,desc:"ควบคุมวิทยานิพนธ์บัณฑิตศึกษา ภายนอกคณะ",hint:"≥270 ชม./รอบ = 10"},{code:"3.23",w:10,desc:"กรรมการสอบวิทยานิพนธ์/โครงร่าง",hint:"1 เรื่อง = 10"},{code:"3.24",w:30,desc:"กรรมการตรวจประเมินคุณภาพ (EdPEx/AUN-QA)",hint:"ประธาน EdPEx 1 ส่วนงาน = 10"}]},{id:4,title:"หมวด 4: ภาระงานทำนุบำรุงศิลปวัฒนธรรม",short:"ทำนุฯ",accent:"#1a2f6e",items:[{code:"4.1.1",w:35,desc:"ประธาน/ผู้รับผิดชอบโครงการทำนุบำรุงฯ",hint:"1 โครงการ = 10"},{code:"4.1.2",w:25,desc:"กรรมการ/เลขานุการโครงการทำนุบำรุงฯ",hint:"2 โครงการ = 10"},{code:"4.2",w:50,desc:"เข้าร่วมโครงการทำนุฯ ของคณะ",hint:"≥3 = 10 | 2 = 7 | 1 = 4"},{code:"4.3",w:25,desc:"เข้าร่วมกิจกรรมทำนุฯ มหาวิทยาลัย/ภายนอก",hint:"≥3 = 10 | 2 = 7 | 1 = 4"},{code:"4.4",w:20,desc:"ตัวแทนคณะด้านทำนุบำรุงศิลปวัฒนธรรม",hint:"1 โครงการ = 10"},{code:"4.5",w:15,desc:"กรรมการด้านศิลปวัฒนธรรม (ต่อเนื่องทั้งปี)",hint:"1 หน่วยงาน = 10"},{code:"4.6",w:5,desc:"กรรมการด้านศิลปวัฒนธรรม (ครั้งคราว)",hint:"1 ชุด = 10"}]},{id:5,title:"หมวด 5: ภาระงานส่วนกลางและงานอื่นๆ",short:"งานอื่นๆ",accent:"#111e4a",items:[{code:"5.1.1",w:40,desc:"กรรมการประจำคณะ",hint:"ดีมาก = 10 | ดี = 8"},{code:"5.1.2",w:60,desc:"รองประธานหลักสูตร/เลขานุการหลักสูตร",hint:"ดีมาก = 10 | ดี = 8"},{code:"5.1.3",w:40,desc:"คณะกรรมการบริหารหลักสูตร",hint:"ดีมาก = 10 | ดี = 8"},{code:"5.1.4",w:20,desc:"ผู้ประสานงานรายวิชาที่ได้รับการแต่งตั้ง",hint:"ดีมาก = 10 | ดี = 8"},{code:"5.1.5",w:60,desc:"ประธานศูนย์ฯ ภายใต้หน่วยบริการวิชาการ",hint:"ดีมาก = 10 | ดี = 8"},{code:"5.1.6",w:30,desc:"รองประธาน/กรรมการศูนย์ฯ",hint:"ดีมาก = 10 | ดี = 8"},{code:"5.1.7",w:30,desc:"ภาระงานต่อเนื่องทั้งปี (กก.วิจัย/KM ฯลฯ)",hint:"3 ชุด = 10 | 2 = 7 | 1 = 4"},{code:"5.1.8",w:20,desc:"ภาระงานครั้งคราว (กก.สอบ/กลั่นกรอง ฯลฯ)",hint:"5 ชุด = 10 | 4 = 8 | 3 = 6"},{code:"5.1.9",w:20,desc:"ประธาน/ผู้รับผิดชอบโครงการของคณะ",hint:"≥3 = 10 | 2 = 7 | 1 = 4"},{code:"5.1.10",w:15,desc:"กรรมการ/เลขานุการโครงการของคณะ",hint:"≥3 = 10 | 2 = 7 | 1 = 4"},{code:"5.1.11",w:10,desc:"ปฏิบัติภารกิจในนามคณะ",hint:"≥1 ครั้ง = 10"},{code:"5.2.1",w:30,desc:"อาจารย์ที่ปรึกษานักศึกษา",hint:"ดีมาก = 10 | ดี = 8"},{code:"5.2.2",w:20,desc:"อาจารย์ที่ปรึกษาชุมนุม/ชมรม",hint:"≥2 ชุด = 10 | 1 = 5"},{code:"5.2.3",w:10,desc:"ฝึกซ้อม/ควบคุมนักศึกษาแข่งขัน",hint:"รางวัลนานาชาติ = 10"},{code:"5.3.1",w:30,desc:"เข้าร่วมกิจกรรม/โครงการของคณะ",hint:"≥8 = 10 | 7 = 9 | 6 = 8"},{code:"5.3.2",w:20,desc:"เข้าร่วมแข่งขัน/ประกวด",hint:"≥3 = 10 | 2 = 7 | 1 = 4"},{code:"5.3.3",w:10,desc:"เข้าร่วมประชุม/กิจกรรมภายนอก",hint:"≥3 = 10 | 2 = 7 | 1 = 4"},{code:"5.3.4",w:15,desc:"กรรมการต่างๆ ต่อเนื่องทั้งปี",hint:"≥2 ชุด = 10 | 1 = 5"},{code:"5.3.5",w:10,desc:"กรรมการต่างๆ ครั้งคราว",hint:"≥2 ชุด = 10 | 1 = 5"},{code:"5.3.6",w:10,desc:"เข้าร่วมประชุมสาขา/หมวดวิชาที่สังกัด",hint:"ครบทุกครั้ง = 10 | ≥75% = 8"},{code:"5.3.7",w:10,desc:"เข้าร่วมประชุม Meet the Dean",hint:"ครบทุกครั้ง = 10 | 50-99% = 5"}]}];

const TOTAL=PA_SECTIONS.reduce((a,s)=>a+s.items.length,0);

function initState(){const d={};PA_SECTIONS.forEach(s=>s.items.forEach(i=>{d[i.code]={activity:"",score:"",status:"empty",files:[]}}));return d;}

function parseCodeFromFilename(name){const clean=name.replace(/^[_\s]+/,"");const m=clean.match(/^(\d+_\d+(?:_\d+)?)/);if(!m)return null;return m[1].replace(/_+$/,"").replace(/_/g,".");}

async function fileToBase64(file){return new Promise(res=>{const r=new FileReader();r.onloadend=()=>res(r.result.split(",")[1]);r.readAsDataURL(file);});}

async function extractTextFromFile(file){
  if(file.type==="application/pdf"){const b64=await fileToBase64(file);return{kind:"pdf",data:b64};}
  else if(file.type.startsWith("image/")){const b64=await fileToBase64(file);return{kind:"image",data:b64,mime:file.type};}
  else if(file.name.match(/\.docx?$/i)){
    try{const{default:mammoth}=await import("mammoth");const ab=await file.arrayBuffer();const r=await mammoth.extractRawText({arrayBuffer:ab});return{kind:"text",content:r.value};}
    catch{const t=await file.text();return{kind:"text",content:t};}
  }else{const t=await file.text();return{kind:"text",content:t};}
}

async function callClaude(messages,system){
  const res=await fetch("/api/extract",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system,messages})});
  if(!res.ok){const e=await res.json().catch(()=>({}));throw new Error(e.error||`Server error ${res.status}`);}
  const data=await res.json();
  if(data.error)throw new Error(data.error);
  const txt=data.content?.find(b=>b.type==="text")?.text||"";
  const clean=txt.replace(/```json[\s\S]*?```/g,m=>m.slice(7,-3)).replace(/```/g,"").trim();
  try{return JSON.parse(clean);}catch{return{activity:txt.slice(0,400),score:""};}
}

function Toast({toast}){if(!toast)return null;const bg=toast.type==="error"?T.err:toast.type==="info"?T.accent:T.primary;return(<div style={{position:"fixed",top:20,right:20,zIndex:9999,padding:"12px 20px",borderRadius:12,background:bg,color:"white",fontSize:22,fontWeight:500,boxShadow:"0 8px 32px rgba(0,0,0,0.18)",maxWidth:380,lineHeight:1.5}}>{toast.msg}</div>);}

function FileCard({f,onRemove,onAssign}){
  const ext=f.name.split(".").pop().toUpperCase();
  const extBg=ext==="PDF"?"#fecdd3":ext==="DOCX"||ext==="DOC"?"#bfdbfe":"#ddd6fe";
  const extColor=ext==="PDF"?"#be123c":ext==="DOCX"||ext==="DOC"?"#1d4ed8":"#6d28d9";
  const[open,setOpen]=useState(false);
  return(
    <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 12px",marginBottom:8,position:"relative",boxShadow:T.shadow}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:8}}>
        <div style={{width:30,height:30,borderRadius:6,background:extBg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:15,fontWeight:800,color:extColor}}>{ext.slice(0,4)}</div>
        <div style={{flex:1,minWidth:0}}>
          <p style={{margin:0,fontSize:15,color:T.text,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</p>
          <div style={{marginTop:4}}>
            {f.assignedCode
              ?<span onClick={()=>setOpen(o=>!o)} style={{cursor:"pointer",padding:"2px 8px",borderRadius:99,background:"#d1fae5",color:"#065f46",fontSize:22,fontWeight:700,border:"1px solid #a7f3d0"}}>↔ {f.assignedCode}</span>
              :<span onClick={()=>setOpen(o=>!o)} style={{cursor:"pointer",padding:"2px 8px",borderRadius:99,background:T.primaryBg,color:T.primary,fontSize:22,border:`1px solid ${T.borderMid}`}}>+ กำหนดรหัส</span>}
          </div>
        </div>
        <button onClick={onRemove} style={{background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontSize:22,lineHeight:1,padding:2}}>×</button>
      </div>
      {open&&(
        <div style={{position:"absolute",left:0,right:0,top:"100%",zIndex:200,background:T.surface,border:`1px solid ${T.borderMid}`,borderRadius:10,boxShadow:T.shadowMd,maxHeight:220,overflowY:"auto",marginTop:4}}>
          <div style={{padding:"6px 12px",fontSize:22,color:T.textMuted,borderBottom:`1px solid ${T.border}`,fontWeight:600}}>เลือกเกณฑ์</div>
          {PA_SECTIONS.map(sec=>(
            <div key={sec.id}>
              <div style={{padding:"4px 12px",fontSize:22,color:sec.accent,fontWeight:800,background:`${sec.accent}10`}}>{sec.short}</div>
              {sec.items.map(item=>(
                <div key={item.code} onClick={()=>{onAssign(item.code);setOpen(false);}} style={{padding:"5px 14px",fontSize:22,color:T.text,cursor:"pointer"}} onMouseOver={e=>e.currentTarget.style.background=T.primaryBg} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                  <strong>{item.code}</strong> — {item.desc.slice(0,48)}{item.desc.length>48?"…":""}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CriterionRow({item,d,filesList,onUpdate,onExtract,isExtracting}){
  const[showHint,setShowHint]=useState(false);
  const status=d.status;
  const dotColor=status==="ai-filled"?T.aiGreen:d.activity?T.warn:"#cbd5e1";
  const rowBg=status==="ai-filled"?"#f0fdf4":d.activity?"#fffbeb":T.surface;
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 96px",gap:0,borderBottom:`1px solid ${T.border}`,background:rowBg,padding:"10px 16px 12px",transition:"background 0.3s"}}>
      <div style={{display:"grid",gridTemplateColumns:"88px 1fr",gap:10}}>
        <div style={{paddingTop:2}}>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:5}}>
            <span style={{width:8,height:8,borderRadius:99,background:dotColor,display:"inline-block",flexShrink:0}}/>
            <span style={{fontFamily:"monospace",fontWeight:800,fontSize:15,color:T.primaryDark}}>{item.code}</span>
          </div>
          <span style={{display:"inline-block",padding:"2px 7px",borderRadius:6,background:`${T.primary}15`,color:T.primary,fontSize:22,fontWeight:700}}>×{item.w}</span>
          {filesList.length>0&&(<div style={{marginTop:5}}>{filesList.map((f,i)=>(<div key={i} style={{fontSize:15,color:T.aiGreen,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:80}}>📎 {f.name.slice(0,14)}…</div>))}</div>)}
        </div>
        <div>
          <p style={{margin:"0 0 4px",fontSize:15,color:T.textMid,lineHeight:1.5}}>
            {item.desc}
            <span style={{cursor:"pointer",marginLeft:6,color:T.accent,fontSize:22,fontWeight:700}} onClick={()=>setShowHint(h=>!h)}>{showHint?"▲ซ่อน":"ℹ เกณฑ์"}</span>
          </p>
          {showHint&&(<p style={{margin:"0 0 5px",fontSize:22,color:"#64748b",background:"#f1f5f9",padding:"5px 8px",borderRadius:6,border:"1px solid #e2e8f0",lineHeight:1.5}}>{item.hint}</p>)}
          <textarea value={d.activity} onChange={e=>onUpdate(item.code,"activity",e.target.value)} placeholder="อธิบายกิจกรรม/ผลการปฏิบัติงาน (ภาษาไทย)..." rows={Math.max(2,(d.activity||"").split("\n").length+(d.activity?0:1))} style={{width:"100%",background:T.surface,border:`1.5px solid ${T.border}`,borderRadius:7,color:T.text,fontSize:15,padding:"7px 10px",resize:"vertical",fontFamily:"'Sarabun',sans-serif",lineHeight:1.6,boxSizing:"border-box",outline:"none"}} onFocus={e=>e.target.style.borderColor=T.primaryLight} onBlur={e=>e.target.style.borderColor=T.border}/>
        </div>
      </div>
      <div style={{paddingLeft:10,display:"flex",flexDirection:"column",alignItems:"center",gap:7,paddingTop:2}}>
        <span style={{fontSize:22,color:T.textMuted,fontWeight:600}}>คะแนน</span>
        <span style={{fontSize:15,color:T.textMuted}}>(0–10)</span>
        <input type="number" min={0} max={10} step={0.5} value={d.score} onChange={e=>onUpdate(item.code,"score",e.target.value)} style={{width:68,background:T.surface,border:`2px solid ${d.score?T.primary:T.border}`,borderRadius:8,color:T.primaryDark,fontSize:21,fontWeight:700,textAlign:"center",padding:"5px 4px",outline:"none"}}/>
        <button onClick={()=>onExtract(item)} disabled={isExtracting||filesList.length===0} title={filesList.length===0?"แนบไฟล์ก่อน":"AI สกัดข้อมูลจากไฟล์"} style={{width:72,padding:"8px 0",borderRadius:7,border:"none",background:filesList.length===0?"#e2e8f0":isExtracting?T.borderMid:`linear-gradient(135deg,${T.primary},${T.accent})`,color:filesList.length===0?T.textMuted:"white",fontSize:22,cursor:filesList.length===0?"not-allowed":"pointer",fontWeight:600}}>
          {isExtracting?"⏳":"⚡ AI"}
        </button>
        <span style={{fontSize:22,color:dotColor,fontWeight:700}}>{status==="ai-filled"?"🤖":d.activity?"✓":"—"}</span>
      </div>
    </div>
  );
}

function SectionAccordion({sec,formData,onUpdate,onExtract,extracting,getFiles,isOpen,onToggle}){
  const filled=sec.items.filter(i=>formData[i.code]?.activity).length;
  const pct=Math.round((filled/sec.items.length)*100);
  return(
    <div style={{border:`1px solid ${T.border}`,borderRadius:12,overflow:"hidden",marginBottom:10,boxShadow:T.shadow}}>
      <div onClick={onToggle} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 20px",cursor:"pointer",background:isOpen?`${sec.accent}10`:T.surface,borderBottom:isOpen?`1px solid ${T.border}`:"none",userSelect:"none"}}>
        <div style={{width:4,height:28,borderRadius:2,background:sec.accent,flexShrink:0}}/>
        <div style={{flex:1}}><span style={{fontWeight:700,fontSize:22.5,color:T.text}}>{sec.title}</span></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:80,height:5,background:T.border,borderRadius:3}}><div style={{width:`${pct}%`,height:"100%",background:sec.accent,borderRadius:3,transition:"width 0.5s"}}/></div>
          <span style={{fontSize:15,color:T.textMuted,minWidth:48,textAlign:"right"}}>{filled}/{sec.items.length}</span>
          <span style={{color:sec.accent,fontSize:22,transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s",fontWeight:700}}>▼</span>
        </div>
      </div>
      {isOpen&&(<div>{sec.items.map(item=>(<CriterionRow key={item.code} item={item} d={formData[item.code]||{activity:"",score:"",status:"empty"}} filesList={getFiles(item.code)} onUpdate={onUpdate} onExtract={onExtract} isExtracting={extracting===item.code}/>))}</div>)}
    </div>
  );
}

export default function PAAssistant(){
  const[info,setInfo]=useState({name:"อาจารย์ ดร.พยุงศักดิ์ แก่นจันทร์",position:"อาจารย์",department:"หลักสูตรศิลปศาสตรบัณฑิต สาขาวิชาภาษาอังกฤษ",faculty:"ศิลปศาสตร์ มหาวิทยาลัยมหิดล",supervisor:"อาจารย์ ดร. อนุชยาน์ มนทการติวงศ์",period:"1 ก.ค. 2567 – 30 มิ.ย. 2568",type:"พนักงานมหาวิทยาลัย"});
  const[formData,setFormData]=useState(initState);
  const[files,setFiles]=useState([]);
  const[openSections,setOpenSections]=useState(new Set([1]));
  const[extracting,setExtracting]=useState(null);
  const[isDragging,setIsDragging]=useState(false);
  const[toast,setToast]=useState(null);
  const[showInfo,setShowInfo]=useState(false);
  const fileInputRef=useRef();

  useEffect(()=>{
    const link=document.createElement("link");link.href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&family=Noto+Sans+Thai:wght@400;600;700&display=swap";link.rel="stylesheet";document.head.appendChild(link);
    document.body.style.fontFamily="'Sarabun','Noto Sans Thai',sans-serif";document.body.style.background=T.bg;
  },[]);

  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),4500);};

  const processFiles=useCallback((rawFiles)=>{
    const added=rawFiles.map(f=>{const code=parseCodeFromFilename(f.name);return{id:`${Date.now()}-${Math.random()}`,file:f,name:f.name,size:f.size,assignedCode:code};});
    setFiles(prev=>{const ex=new Set(prev.map(x=>x.name));return[...prev,...added.filter(a=>!ex.has(a.name))];});
    const auto=added.filter(a=>a.assignedCode).length;
    showToast(`📂 เพิ่ม ${added.length} ไฟล์${auto>0?` | จับคู่อัตโนมัติ ${auto} รายการ`:""}`);
  },[]);

  const handleDrop=useCallback(e=>{e.preventDefault();setIsDragging(false);const dropped=Array.from(e.dataTransfer.files);if(dropped.length)processFiles(dropped);},[processFiles]);
  const getFilesForCode=code=>files.filter(f=>f.assignedCode===code);
  const assignFile=(id,code)=>setFiles(prev=>prev.map(f=>f.id===id?{...f,assignedCode:code}:f));
  const updateField=(code,field,val)=>setFormData(prev=>({...prev,[code]:{...prev[code],[field]:val,status:field==="activity"?(prev[code]?.status==="ai-filled"&&val?"ai-filled":"manual"):prev[code]?.status}}));
  const toggleSection=id=>setOpenSections(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});

  const extractForItem=async(item)=>{
    const fList=getFilesForCode(item.code);
    if(!fList.length){showToast("ต้องแนบไฟล์หลักฐานก่อน","error");return;}
    setExtracting(item.code);
    try{
      const contents=await Promise.all(fList.map(af=>extractTextFromFile(af.file)));
      const parts=contents.map((c,i)=>{
        if(c.kind==="pdf")return{type:"document",source:{type:"base64",media_type:"application/pdf",data:c.data}};
        if(c.kind==="image")return{type:"image",source:{type:"base64",media_type:c.mime,data:c.data}};
        return{type:"text",text:`\n--- ไฟล์: "${fList[i].name}" ---\n${c.content.slice(0,3000)}\n`};
      });
      parts.push({type:"text",text:`\n\nเกณฑ์ PA: ${item.code} – ${item.desc}\nน้ำหนัก: ${item.w} | เกณฑ์คะแนน: ${item.hint}\n\nงาน: สรุปกิจกรรมที่ตรงเกณฑ์นี้เป็นภาษาไทย กระชับ 2–3 ประโยค ระบุชื่อโครงการ/กิจกรรม วันที่ หน่วยงาน และผลที่ได้ จากนั้นแนะนำคะแนน 0–10\nตอบด้วย JSON เท่านั้น: {"activity":"...","score":"N"}`});
      const result=await callClaude([{role:"user",content:parts}],"คุณเป็นผู้ช่วยกรอกแบบประเมินผลการปฏิบัติงาน (PA) คณะศิลปศาสตร์ มหาวิทยาลัยมหิดล วิเคราะห์หลักฐานแล้วตอบด้วย JSON เท่านั้น ห้ามมี text นอก JSON");
      setFormData(prev=>({...prev,[item.code]:{...prev[item.code],activity:result.activity||"",score:result.score||"",status:"ai-filled"}}));
      showToast(`✅ AI กรอก ${item.code} เรียบร้อย`);
    }catch(e){
      const msg=e.message.includes("ANTHROPIC_API_KEY")?"⚠️ ยังไม่ได้ตั้งค่า API Key ใน Vercel Environment Variables":`เกิดข้อผิดพลาด: ${e.message}`;
      showToast(msg,"error");
    }finally{setExtracting(null);}
  };

  const extractAll=async()=>{
    const codes=[...new Set(files.filter(f=>f.assignedCode).map(f=>f.assignedCode))];
    if(!codes.length){showToast("ไม่มีไฟล์ที่กำหนดรหัสเกณฑ์","error");return;}
    showToast(`⚡ เริ่มสกัดข้อมูล ${codes.length} รายการ...`,"info");
    for(const code of codes){const item=PA_SECTIONS.flatMap(s=>s.items).find(i=>i.code===code);if(item){await extractForItem(item);await new Promise(r=>setTimeout(r,600));}}
    showToast(`✅ สกัดข้อมูลครบ ${codes.length} รายการ`);
  };

  const handleExport=async()=>{
    try{showToast("⏳ กำลังสร้างไฟล์ Word...","info");await exportToDocx(info,formData,PA_SECTIONS);showToast("📥 ดาวน์โหลด Word สำเร็จ");}
    catch(e){showToast(`Export ผิดพลาด: ${e.message}`,"error");}
  };

  const filled=Object.values(formData).filter(d=>d.activity).length;
  const pct=Math.round((filled/TOTAL)*100);

  return(
    <div style={{fontFamily:"'Sarabun','Noto Sans Thai',sans-serif",background:T.bg,minHeight:"100vh",color:T.text}}>
      <Toast toast={toast}/>

      {/* HEADER */}
      <header style={{background:T.surface,borderBottom:`2px solid ${T.borderMid}`,padding:"0 24px",position:"sticky",top:0,zIndex:50,boxShadow:T.shadow}}>
        <div style={{maxWidth:1400,margin:"0 auto",display:"flex",alignItems:"center",gap:16,height:72}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.primary},${T.accent})`,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontSize:21,flexShrink:0}}>📋</div>
            <div>
              <h1 style={{margin:0,fontSize:22,fontWeight:800,color:T.primaryDark,lineHeight:1.2}}>PA Assistant</h1>
              <p style={{margin:0,fontSize:22,color:T.textMuted}}>คณะศิลปศาสตร์ มหาวิทยาลัยมหิดล</p>
            </div>
          </div>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:8,padding:"0 16px"}}>
            <div style={{flex:1,height:7,background:T.border,borderRadius:4,maxWidth:240}}>
              <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${T.primary},${T.primaryLight})`,borderRadius:4,transition:"width 0.6s"}}/>
            </div>
            <span style={{fontSize:15,color:T.textMid,fontWeight:600}}><span style={{color:T.primary,fontWeight:800}}>{filled}</span>/{TOTAL} ({pct}%)</span>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={()=>setShowInfo(h=>!h)} style={{padding:"10px 18px",borderRadius:8,border:`1.5px solid ${T.borderMid}`,background:showInfo?T.primaryBg:T.surface,color:T.primaryDark,fontSize:15,fontWeight:600,cursor:"pointer"}}>👤 ข้อมูลส่วนตัว</button>
            <button onClick={extractAll} style={{padding:"10px 20px",borderRadius:8,border:"none",background:`linear-gradient(135deg,${T.primary},${T.accent})`,color:"white",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:T.shadow}}>⚡ AI สกัดทั้งหมด</button>
            <button onClick={handleExport} style={{padding:"10px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#059669,#047857)",color:"white",fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:T.shadow}}>📥 Export Word</button>
          </div>
        </div>
      </header>

      {/* INFO PANEL */}
      {showInfo&&(
        <div style={{background:T.surface,borderBottom:`1px solid ${T.border}`,padding:"16px 24px"}}>
          <div style={{maxWidth:1400,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
            {[["name","ชื่อ-สกุล"],["position","ตำแหน่ง"],["department","สังกัดหลักสูตร"],["faculty","คณะ"],["supervisor","ผู้บังคับบัญชา"],["period","รอบการประเมิน"]].map(([k,label])=>(
              <div key={k}>
                <label style={{display:"block",fontSize:22,color:T.textMuted,marginBottom:4,fontWeight:700}}>{label}</label>
                <input value={info[k]} onChange={e=>setInfo(p=>({...p,[k]:e.target.value}))} style={{width:"100%",background:T.bg,border:`1.5px solid ${T.border}`,borderRadius:7,color:T.text,fontSize:22,padding:"7px 10px",boxSizing:"border-box",outline:"none",fontFamily:"'Sarabun',sans-serif"}} onFocus={e=>e.target.style.borderColor=T.primary} onBlur={e=>e.target.style.borderColor=T.border}/>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BODY */}
      <div style={{maxWidth:1400,margin:"0 auto",display:"grid",gridTemplateColumns:"290px 1fr",gap:0,minHeight:"calc(100vh - 72px)"}}>

        {/* FILE PANEL */}
        <aside style={{background:T.surface,borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",minHeight:0,position:"sticky",top:72,height:"calc(100vh - 72px)",overflow:"hidden"}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.border}`,background:`${T.primary}08`}}>
            <p style={{margin:0,fontSize:22,fontWeight:800,color:T.primaryDark}}>📁 ไฟล์หลักฐาน</p>
            <p style={{margin:"2px 0 0",fontSize:22,color:T.textMuted}}>{files.length} ไฟล์ | ลากมาวางหรือคลิกเลือก</p>
          </div>
          <div onDrop={handleDrop} onDragOver={e=>{e.preventDefault();setIsDragging(true);}} onDragLeave={()=>setIsDragging(false)} onClick={()=>fileInputRef.current?.click()} style={{margin:"12px 12px 0",border:`2px dashed ${isDragging?T.primaryLight:T.borderMid}`,borderRadius:12,padding:"18px 12px",textAlign:"center",cursor:"pointer",background:isDragging?`${T.primary}08`:T.bg,transition:"all 0.2s"}}>
            <div style={{fontSize:30,marginBottom:6}}>📂</div>
            <p style={{margin:0,fontSize:15,color:T.textMid,fontWeight:600}}>ลากไฟล์มาวางที่นี่</p>
            <p style={{margin:"4px 0 0",fontSize:22,color:T.textMuted}}>PDF · DOCX · JPG · PNG</p>
            <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style={{display:"none"}} onChange={e=>processFiles(Array.from(e.target.files))}/>
          </div>
          <div style={{margin:"8px 12px 0",padding:"8px 10px",background:"#fffbeb",borderRadius:8,border:"1px solid #fde68a"}}>
            <p style={{margin:0,fontSize:22,color:"#92400e",lineHeight:1.5}}>💡 ชื่อไฟล์ขึ้นต้นด้วยรหัส เช่น <strong>3_4_จดหมาย...</strong> → จับคู่กับ 3.4 อัตโนมัติ</p>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"8px 12px"}}>
            {files.length===0?(<div style={{textAlign:"center",padding:"30px 12px",color:T.textMuted,fontSize:15,lineHeight:1.8}}>ยังไม่มีไฟล์<br/>อัปโหลดไฟล์หลักฐานเพื่อ<br/>ให้ AI ช่วยกรอกข้อมูล</div>):files.map(f=>(<FileCard key={f.id} f={f} onRemove={()=>setFiles(p=>p.filter(x=>x.id!==f.id))} onAssign={code=>assignFile(f.id,code)}/>))}
          </div>
          {files.length>0&&(
            <div style={{padding:"10px 16px",borderTop:`1px solid ${T.border}`,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,background:T.bg}}>
              <div style={{textAlign:"center",padding:"6px 0",borderRadius:8,background:"#d1fae5"}}><div style={{fontSize:22,fontWeight:800,color:"#065f46"}}>{files.filter(f=>f.assignedCode).length}</div><div style={{fontSize:22,color:"#6ee7b7",fontWeight:600}}>จับคู่แล้ว</div></div>
              <div style={{textAlign:"center",padding:"6px 0",borderRadius:8,background:"#fef3c7"}}><div style={{fontSize:22,fontWeight:800,color:"#92400e"}}>{files.filter(f=>!f.assignedCode).length}</div><div style={{fontSize:22,color:"#fcd34d",fontWeight:600}}>รอกำหนดรหัส</div></div>
            </div>
          )}
          <div style={{padding:"10px 14px",borderTop:`1px solid ${T.border}`,background:"#eff6ff",fontSize:22,color:"#1e40af",lineHeight:1.6}}>
            🔑 <strong>ใช้ AI ครั้งแรก:</strong> ต้องตั้งค่า <code>ANTHROPIC_API_KEY</code> ใน Vercel → Settings → Environment Variables
          </div>
        </aside>

        {/* FORM PANEL */}
        <main style={{padding:"20px 24px",overflowY:"auto"}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
            {PA_SECTIONS.map(sec=>{const n=sec.items.filter(i=>formData[i.code]?.activity).length;return(<button key={sec.id} onClick={()=>toggleSection(sec.id)} style={{padding:"5px 14px",borderRadius:99,border:`1.5px solid ${openSections.has(sec.id)?sec.accent:T.border}`,background:openSections.has(sec.id)?`${sec.accent}12`:T.surface,color:openSections.has(sec.id)?sec.accent:T.textMuted,fontSize:22,fontWeight:700,cursor:"pointer",transition:"all 0.2s"}}>{sec.short} ({n}/{sec.items.length})</button>);})}
          </div>
          {PA_SECTIONS.map(sec=>(<SectionAccordion key={sec.id} sec={sec} formData={formData} onUpdate={updateField} onExtract={extractForItem} extracting={extracting} getFiles={getFilesForCode} isOpen={openSections.has(sec.id)} onToggle={()=>toggleSection(sec.id)}/>))}
          <div style={{textAlign:"center",padding:"16px 0",color:T.textMuted,fontSize:22,borderTop:`1px solid ${T.border}`,marginTop:8}}>
            🟢 AI กรอก &nbsp;|&nbsp; 🟡 กรอกเอง &nbsp;|&nbsp; ⚪ ยังว่าง &nbsp;|&nbsp; คะแนน AI เป็นข้อเสนอแนะ — ตรวจสอบก่อน Export เสมอ
          </div>
        </main>
      </div>
    </div>
  );
}
