/* Date helpers + range presets shared by data, helpers and components */
export const isoDay = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
export const dOnly = d => new Date(d.getFullYear(), d.getMonth(), d.getDate())
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x }
export const daysAgo = n => addDays(dOnly(new Date()), -n)
export const startOfWeek = d => { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x }

export const RANGE_PRESETS = [
  'today', 'yesterday', 'thisWeek', 'lastWeek', 'thisMonth', 'lastMonth',
  'thisQuarter', 'lastQuarter', 'thisYear', 'lastYear',
  '—', 'last7Days', 'last30Days', 'last90Days', '—', 'customRange'
]

export function resolveRange (key, custom) {
  const T = dOnly(new Date()), y = T.getFullYear(), m = T.getMonth(), q = Math.floor(m / 3) * 3
  let from = T, to = T
  switch (key) {
    case 'yesterday':   from = to = addDays(T, -1); break
    case 'thisWeek':    from = startOfWeek(T); to = addDays(from, 6); break
    case 'lastWeek':    from = addDays(startOfWeek(T), -7); to = addDays(from, 6); break
    case 'thisMonth':   from = new Date(y, m, 1);     to = new Date(y, m + 1, 0); break
    case 'lastMonth':   from = new Date(y, m - 1, 1); to = new Date(y, m, 0); break
    case 'thisQuarter': from = new Date(y, q, 1);     to = new Date(y, q + 3, 0); break
    case 'lastQuarter': from = new Date(y, q - 3, 1); to = new Date(y, q, 0); break
    case 'thisYear':    from = new Date(y, 0, 1);     to = new Date(y, 11, 31); break
    case 'lastYear':    from = new Date(y - 1, 0, 1); to = new Date(y - 1, 11, 31); break
    case 'last7Days':   from = addDays(T, -6); break
    case 'last30Days':  from = addDays(T, -29); break
    case 'last90Days':  from = addDays(T, -89); break
    case 'customRange': return { key, from: (custom && custom.from) || isoDay(T), to: (custom && custom.to) || isoDay(T) }
  }
  return { key, from: isoDay(from), to: isoDay(to) }
}

/* ISO 'YYYY-MM-DD' strings compare lexicographically — safe inclusive filter */
export const inDateRange = (date, r) => !r || !date ? true : (date >= r.from && date <= r.to)
