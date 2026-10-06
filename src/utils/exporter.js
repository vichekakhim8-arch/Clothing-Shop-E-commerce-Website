import { store } from '../stores'
import { t } from './i18n'
import { toast } from './helpers'
import { isoDay } from './dates'

function downloadBlob (content, filename, mime) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

function buildCSV (headers, rows) {
  const esc = v => {
    const s = (v === null || v === undefined) ? '' : String(v)
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
  }
  return '\ufeff' + [headers.map(esc).join(','), ...rows.map(r => r.map(esc).join(','))].join('\r\n')
}

function buildDocHTML (title, headers, rows, meta) {
  const td = v => '<td>' + String(v === null || v === undefined ? '' : v).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c])) + '</td>'
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>
    @page{ margin:16mm; }
    *{ font-family:-apple-system,Segoe UI,Inter,'Noto Sans Khmer',sans-serif; }
    body{ color:#111; margin:0; }
    .hd{ display:flex; justify-content:space-between; align-items:flex-end; border-bottom:2px solid #111; padding-bottom:12px; margin-bottom:18px; }
    .brand{ font-size:18px; font-weight:700; letter-spacing:.22em; text-transform:uppercase; }
    h1{ font-size:15px; margin:6px 0 0; text-transform:uppercase; letter-spacing:.06em; }
    .meta{ font-size:11px; color:#666; text-align:right; line-height:1.7; }
    table{ width:100%; border-collapse:collapse; font-size:11px; }
    th{ text-align:left; text-transform:uppercase; letter-spacing:.08em; font-size:9.5px; color:#555; border-bottom:1px solid #111; padding:8px 6px; }
    td{ padding:7px 6px; border-bottom:1px solid #e6e6e6; }
    tr:nth-child(even) td{ background:#fafafa; }
    .ft{ margin-top:16px; font-size:10px; color:#888; }
  </style></head><body>
    <div class="hd"><div><div class="brand">${store.settings.storeName}</div><h1>${title}</h1></div>
      <div class="meta">${(meta || []).join('<br>')}</div></div>
    <table><thead><tr>${headers.map(h => '<th>' + h + '</th>').join('')}</tr></thead>
    <tbody>${rows.map(r => '<tr>' + r.map(td).join('') + '</tr>').join('')}</tbody></table>
    <p class="ft">${rows.length} ${t('rows')} · ${store.settings.storeName} · ${store.settings.email}</p>
  </body></html>`
}

export function printDocument (html) {
  const f = document.createElement('iframe')
  f.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;'
  document.body.appendChild(f)
  const d = f.contentWindow.document
  d.open(); d.write(html); d.close()
  setTimeout(() => {
    f.contentWindow.focus(); f.contentWindow.print()
    setTimeout(() => f.remove(), 1200)
  }, 320)
}

export function runExport (kind, payload) {
  const { title, headers, rows, filename, meta } = payload
  if (!rows || !rows.length) return toast(t('noRowsExport'), 'error')
  const name = (filename || title || 'export').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + isoDay(new Date())
  if (kind === 'csv') downloadBlob(buildCSV(headers, rows), name + '.csv', 'text/csv;charset=utf-8')
  else if (kind === 'excel') downloadBlob(buildDocHTML(title, headers, rows, meta), name + '.xls', 'application/vnd.ms-excel;charset=utf-8')
  else if (kind === 'pdf' || kind === 'print') printDocument(buildDocHTML(title, headers, rows, meta))
  if (kind !== 'print' && kind !== 'pdf') toast(rows.length + ' ' + t('rows') + ' → ' + kind.toUpperCase())
}
