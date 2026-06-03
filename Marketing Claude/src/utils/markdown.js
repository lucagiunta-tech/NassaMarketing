export function escapeHtml(value = "") {
  return String(value).replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

export function renderMarkdown(raw = "") {
  if (!raw) return "";
  const esc = escapeHtml(raw);
  const lines = esc.split("\n");
  const out = [];
  let tableRows = [];
  let inTable = false;

  const flushTable = () => {
    if (!tableRows.length) return;
    const [header] = tableRows;
    const body = tableRows.slice(2);
    out.push(
      `<div class="tbl-wrap"><table><thead><tr>${(header || []).map(c => `<th>${c}</th>`).join("")}</tr></thead><tbody>${body.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`
    );
    tableRows = [];
    inTable = false;
  };

  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith("|") && t.endsWith("|")) {
      inTable = true;
      tableRows.push(t.slice(1, -1).split("|").map(c => c.trim()));
      continue;
    }
    if (inTable) flushTable();
    if (!t) { out.push("<br/>"); continue; }
    if (t.startsWith("### ")) { out.push(`<h3>${t.slice(4)}</h3>`); continue; }
    if (t.startsWith("## ")) { out.push(`<h2>${t.slice(3)}</h2>`); continue; }
    if (t.startsWith("# ")) { out.push(`<h1>${t.slice(2)}</h1>`); continue; }
    if (t === "---") { out.push("<hr/>"); continue; }

    let p = t
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/✅/g, '<span class="ok">✅</span>')
      .replace(/❌/g, '<span class="ko">❌</span>')
      .replace(/⚠️/g, '<span class="warn">⚠️</span>');

    if (t.startsWith("- [ ] ")) { out.push(`<li class="check">${p.slice(6)}</li>`); continue; }
    if (t.startsWith("- [x] ")) { out.push(`<li class="check done">${p.slice(6)}</li>`); continue; }
    if (t.startsWith("- ")) { out.push(`<li>${p.slice(2)}</li>`); continue; }
    const numbered = t.match(/^(\d+)\. (.+)/);
    if (numbered) { out.push(`<oli>${numbered[2].replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</oli>`); continue; }
    out.push(`<p>${p}</p>`);
  }

  if (inTable) flushTable();
  return out.join("\n")
    .replace(/(<li>.*?<\/li>\n?)+/gs, m => `<ul>${m}</ul>`)
    .replace(/(<oli>.*?<\/oli>\n?)+/gs, m => `<ol>${m.replace(/<\/?oli>/g, tag => tag.includes("/") ? "</li>" : "<li>")}</ol>`);
}

export const renderMd = renderMarkdown;
export const defaultRenderMarkdown = renderMarkdown;
export const defaultRenderMd = renderMarkdown;
