export const TASK_COLORS = ["#16A34A","#1565C0","#8E44AD","#C2185B","#E65100","#F57F17","#0A66C2","#795548","#37474F","#00838F"];

export const RUOLI_NMS = ["Direzione Creativa","Strategia","Art Director","SMM","Grafico Senior","AI & Google","Video Maker","Fotografo","Marketing Operativo","Grafico Junior","Copywriter","Sviluppatore"];

export const DEFAULT_MEMBERS_NMS = [
  { id:"luca",     nome:"Luca Giunta",       ruolo:"Direzione Creativa",  colore:"#16A34A", tariffa:80, ore:40 },
  { id:"alberto",  nome:"Alberto Arcidiac.", ruolo:"Direzione Creativa",  colore:"#1565C0", tariffa:80, ore:40 },
  { id:"giacomo",  nome:"Giacomo",           ruolo:"Art Director",        colore:"#8E44AD", tariffa:60, ore:32 },
  { id:"paolone",  nome:"Paolone",           ruolo:"Marketing Operativo", colore:"#E65100", tariffa:40, ore:32 },
  { id:"akash",    nome:"Akash",             ruolo:"AI & Google",         colore:"#0A66C2", tariffa:50, ore:24 },
  { id:"paoletto", nome:"Paoletto",          ruolo:"Video Maker",         colore:"#C2185B", tariffa:40, ore:24 },
  { id:"hermes",   nome:"Hermes",            ruolo:"Grafico Junior",      colore:"#F57F17", tariffa:30, ore:32 },
  { id:"matteo",   nome:"Matteo",            ruolo:"Grafico Junior",      colore:"#795548", tariffa:30, ore:24 },
];

export const TP_SK_MEMBERS = "nms-tp:members";

export const tpGet = async k => {
  try {
    const r = await window.storage.get(k);
    return r ? JSON.parse(r.value) : null;
  } catch {
    try {
      const value = window.localStorage?.getItem(k);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  }
};

export const tpSet = async (k, v) => {
  try {
    await window.storage.set(k, JSON.stringify(v));
  } catch {
    try { window.localStorage?.setItem(k, JSON.stringify(v)); } catch {}
  }
};

export function getWeekKey(date) {
  const d = new Date(date), day = d.getDay() || 7;
  d.setDate(d.getDate() + 4 - day);
  const y = d.getFullYear(), w = Math.ceil(((d - new Date(y,0,1)) / 86400000 + 1) / 7);
  return y + "-W" + String(w).padStart(2,"0");
}

export function getMondayOfWeek(weekKey) {
  const [y,w] = weekKey.split("-W").map(Number);
  const jan4 = new Date(y,0,4), dow = jan4.getDay() || 7;
  const mon = new Date(jan4);
  mon.setDate(jan4.getDate() - dow + 1 + (w - 1) * 7);
  return mon;
}

export function addDays(date,n){ const d = new Date(date); d.setDate(d.getDate()+n); return d; }
export function fmtISO(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
export function fmtShort(d){ return String(d.getDate()).padStart(2,"0")+"/"+String(d.getMonth()+1).padStart(2,"0"); }
