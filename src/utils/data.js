import { isoDay, daysAgo } from './dates'

/* ---------------- images ---------------- */
const px = (id, w, h) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w || 900}&h=${h || 1200}`
export const M = {
  a: px(8108297), b: px(8108484), c: px(16229293), d: px(8108589), e: px(16272922), f: px(17246722),
  g: px(37988452), h: px(8108408), i: px(15883360), j: px(8108418), k: px(7193629), l: px(40000157), m: px(12628400),
  n: px(4271701), o: px(18202637), p: px(11324526), q: px(11559288), r: px(11392004), s: px(29197620), u: px(34372583)
}

/* ---------------- categories ---------------- */
export const CATEGORIES = [
  { id: 1, name: 'Techwear Clothing', nameKm: 'សម្លៀកបំពាក់', slug: 'clothing', image: M.i, desc: 'Engineered layers for the modern city.', active: true, order: 1 },
  { id: 2, name: 'Footwear', nameKm: 'ស្បែកជើង', slug: 'footwear', image: M.m, desc: 'Silhouettes built for movement.', active: true, order: 2 },
  { id: 3, name: 'Headwear', nameKm: 'មួក', slug: 'headwear', image: M.g, desc: 'Caps, beanies and tactical covers.', active: true, order: 3 },
  { id: 4, name: 'Accessories', nameKm: 'គ្រឿងបន្លាស់', slug: 'accessories', image: M.a, desc: 'Bags, belts and modular gear.', active: true, order: 4 },
  { id: 5, name: 'Jewelry', nameKm: 'គ្រឿងអលង្ការ', slug: 'jewelry', image: M.u, desc: 'Cold steel, quiet statements.', active: true, order: 5 },
  { id: 6, name: 'Cyberpunk', nameKm: 'សាយប័រផាង', slug: 'cyberpunk', image: M.j, desc: 'Night-coded limited drops.', active: true, order: 6 }
]

/* ---------------- products ---------------- */
const RAW = [
  ['Japanese Windbreaker', 'clothing', 129.99, [M.a, M.i, M.e], ['XS', 'S', 'M', 'L', 'XL'], ['Black', 'White'], 4.8, 142, 38, 920, '2025-09-12', ['new', 'best', 'featured'], { type: 'percent', value: 20, active: true }],
  ['Shadow Cargo Pants', 'clothing', 89.00, [M.i, M.b, M.s], ['S', 'M', 'L', 'XL'], ['Black', 'Grey'], 4.6, 98, 24, 640, '2025-08-28', ['best'], null],
  ['Tactical Shell Hoodie', 'clothing', 149.00, [M.g, M.c, M.f], ['S', 'M', 'L', 'XL'], ['Black', 'Olive'], 4.9, 210, 12, 1180, '2025-09-30', ['new', 'best', 'featured'], { type: 'percent', value: 15, active: true }],
  ['Neo Trench Coat', 'clothing', 219.00, [M.b, M.d, M.a], ['S', 'M', 'L'], ['Black', 'Charcoal'], 4.7, 64, 6, 310, '2025-10-04', ['new', 'featured'], null],
  ['Utility Vest 02', 'clothing', 99.00, [M.s, M.i, M.g], ['S', 'M', 'L', 'XL'], ['Black', 'Sand'], 4.4, 51, 0, 220, '2025-07-19', [], { type: 'fixed', value: 15, active: true }],
  ['Monochrome Base Tee', 'clothing', 39.00, [M.e, M.f, M.c], ['XS', 'S', 'M', 'L', 'XL'], ['White', 'Black'], 4.3, 310, 120, 1540, '2025-06-11', ['best'], null],
  ['Phantom Runner', 'footwear', 159.00, [M.m, M.o, M.q], ['40', '41', '42', '43', '44'], ['White', 'Black'], 4.8, 176, 27, 860, '2025-09-22', ['new', 'featured'], { type: 'percent', value: 10, active: true }],
  ['Mono Court Sneaker', 'footwear', 119.00, [M.k, M.p, M.m], ['39', '40', '41', '42', '43'], ['White', 'Grey'], 4.5, 142, 44, 730, '2025-08-05', ['best'], null],
  ['Velocity Trainer', 'footwear', 139.00, [M.q, M.o, M.k], ['40', '41', '42', '43'], ['Black', 'Red'], 4.6, 88, 9, 410, '2025-09-02', [], null],
  ['Onyx Heel 01', 'footwear', 179.00, [M.l, M.n, M.u], ['36', '37', '38', '39'], ['Black'], 4.7, 42, 14, 180, '2025-10-10', ['new'], { type: 'percent', value: 25, active: true }],
  ['Kanji Tactical Cap', 'headwear', 49.00, [M.r, M.g, M.a], ['One Size'], ['Black', 'White'], 4.7, 205, 62, 1320, '2025-09-18', ['best', 'featured'], null],
  ['Visor Beanie', 'headwear', 35.00, [M.e, M.f, M.j], ['One Size'], ['Black', 'Grey'], 4.2, 77, 3, 290, '2025-07-30', [], { type: 'fixed', value: 8, active: true }],
  ['Harness Sling Bag', 'accessories', 79.00, [M.a, M.h, M.b], ['One Size'], ['Black'], 4.6, 131, 31, 560, '2025-08-21', ['best'], null],
  ['Techwear Gloves', 'accessories', 45.00, [M.f, M.c, M.s], ['S', 'M', 'L'], ['Black'], 4.1, 38, 18, 160, '2025-06-26', [], null],
  ['Modular Belt System', 'accessories', 59.00, [M.s, M.a, M.i], ['One Size'], ['Black', 'Grey'], 4.4, 54, 0, 240, '2025-05-14', [], null],
  ['Chain Pendant 440', 'jewelry', 69.00, [M.u, M.n, M.l], ['One Size'], ['Silver', 'Black'], 4.9, 96, 21, 470, '2025-10-01', ['new', 'featured'], null],
  ['Steel Cuff Bracelet', 'jewelry', 55.00, [M.n, M.u, M.l], ['S', 'M', 'L'], ['Silver'], 4.5, 61, 35, 330, '2025-08-12', [], { type: 'percent', value: 12, active: true }],
  ['Neon Mask 03', 'cyberpunk', 89.00, [M.h, M.j, M.d], ['One Size'], ['Black', 'Neon'], 4.8, 73, 8, 380, '2025-10-08', ['new', 'featured'], null],
  ['LED Visor Unit', 'cyberpunk', 129.00, [M.j, M.d, M.h], ['One Size'], ['Black'], 4.6, 45, 5, 210, '2025-09-26', ['new'], { type: 'percent', value: 30, active: true }]
]
const DESC = 'Cut from weather-sealed technical fabric with taped seams and a matte finish. Designed in-studio, produced in limited runs — built to move through the city and disappear into it.'
/* every product carries exactly 4 gallery frames → 01 — 04 slider */
const EXTRA = [M.b, M.e, M.f, M.h, M.k, M.l, M.n, M.o, M.p, M.q, M.r, M.s, M.u]
function four (imgs, seed) {
  const out = [...imgs]
  for (let i = 0; out.length < 4 && i < EXTRA.length * 2; i++) {
    const c = EXTRA[(seed * 3 + i) % EXTRA.length]
    if (!out.includes(c)) out.push(c)
  }
  return out.slice(0, 4)
}
export const PRODUCTS = RAW.map((r, idx) => ({
  id: idx + 1, name: r[0], slug: r[0].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  sku: 'SHX-' + String(1000 + idx * 7), category: r[1], price: r[2], images: four(r[3], idx),
  sizes: r[4], colors: r[5], rating: r[6], reviewCount: r[7], stock: r[8], sold: r[9],
  createdAt: r[10], tags: r[11],
  discount: r[12] ? { type: r[12].type, value: r[12].value, active: r[12].active, start: '2025-01-01', end: '2026-12-31' } : null,
  status: r[8] === 0 ? 'archived' : 'active', description: DESC,
  specs: [['Material', 'Nylon ripstop / recycled poly'], ['Weight', '480 g'], ['Finish', 'Matte sealed'], ['Origin', 'Designed in Phnom Penh'], ['Care', 'Cold wash, hang dry']],
  outOfStockSizes: idx % 4 === 0 ? [r[4][r[4].length - 1]] : []
}))

/* ---------------- customers / orders / reviews ---------------- */
const FIRST = ['Sophea', 'Dara', 'Chantha', 'Vannak', 'Lina', 'Kosal', 'Mealea', 'Rithy', 'Sreyneang', 'Pisey', 'Marcus', 'Yuki']
const LAST = ['Chan', 'Sok', 'Kim', 'Nguyen', 'Prak', 'Heng', 'Lim', 'Ty', 'Sen', 'Chea', 'Reed', 'Tanaka']
export const CUSTOMERS = Array.from({ length: 14 }, (_, i) => ({
  id: i + 1, name: FIRST[i % FIRST.length] + ' ' + LAST[(i * 3) % LAST.length],
  email: (FIRST[i % FIRST.length] + '.' + LAST[(i * 3) % LAST.length]).toLowerCase() + '@mail.com',
  phone: '+855 ' + (70 + i % 20) + ' ' + (100 + i * 7) + ' ' + (200 + i * 13),
  orders: 1 + ((i * 5) % 9), spent: 120 + i * 87.5, status: i % 7 === 3 ? 'inactive' : 'active',
  joined: '2025-0' + (1 + i % 9) + '-1' + (i % 9),
  address: { line: (12 + i) + ' Street ' + (200 + i * 3), city: 'Phnom Penh', province: 'Phnom Penh', postal: '1200' + (i % 9) }
}))
export const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
const PAYMENTS = ['cod', 'bank', 'qr']
export const ORDERS = Array.from({ length: 26 }, (_, i) => {
  const c = CUSTOMERS[i % CUSTOMERS.length]
  const items = Array.from({ length: 1 + (i % 3) }, (_, k) => {
    const p = PRODUCTS[(i * 3 + k * 5) % PRODUCTS.length]
    return { pid: p.id, name: p.name, image: p.images[0], size: p.sizes[0], color: p.colors[0], qty: 1 + ((i + k) % 2), price: p.price }
  })
  const sub = items.reduce((s, it) => s + it.price * it.qty, 0)
  const disc = Math.round(sub * 0.1 * 100) / 100
  const ship = sub > 150 ? 0 : 5
  return {
    id: '#SHX-' + (2410 + i), customer: c.name, customerId: c.id, email: c.email, phone: c.phone,
    date: isoDay(daysAgo(i === 0 ? 0 : i * 4 + (i % 3))), items, itemCount: items.reduce((s, it) => s + it.qty, 0),
    subtotal: Math.round(sub * 100) / 100, discount: disc, shipping: ship,
    total: Math.round((sub - disc + ship) * 100) / 100,
    payment: PAYMENTS[i % 3], status: STATUSES[i % STATUSES.length], address: c.address,
    timeline: [{ label: 'Order placed', at: '09:12' }, { label: 'Payment confirmed', at: '09:40' }, { label: 'Packed', at: '13:05' }]
  }
})
export const REVIEWS = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1, customer: CUSTOMERS[i % CUSTOMERS.length].name, customerId: CUSTOMERS[i % CUSTOMERS.length].id,
  productId: PRODUCTS[(i * 2) % PRODUCTS.length].id, product: PRODUCTS[(i * 2) % PRODUCTS.length].name,
  rating: 3 + (i % 3), date: '2025-10-' + String(1 + (i % 28)).padStart(2, '0'),
  text: ['Exceptional build quality. The fabric feels premium and the fit is exactly as described.', 'Shipping was fast and the packaging felt high-end. Will order again.', 'Great piece, slightly larger than expected — size down if you are between sizes.', 'Clean design, perfect for daily wear. Worth the price.'][i % 4],
  status: ['approved', 'approved', 'pending', 'hidden'][i % 4]
}))
export const DISCOUNTS = [
  { id: 1, name: 'Summer Flash Sale', type: 'percent', value: 10, scope: 'all', targets: [], start: '2025-10-01', end: '2026-10-15', status: 'active' },
  { id: 2, name: 'Footwear Week', type: 'percent', value: 20, scope: 'category', targets: ['footwear'], start: '2025-10-05', end: '2026-11-20', status: 'active' },
  { id: 3, name: 'Jewelry Fixed Off', type: 'fixed', value: 10, scope: 'category', targets: ['jewelry'], start: '2025-09-01', end: '2026-12-31', status: 'inactive' },
  { id: 4, name: 'Hero Picks', type: 'percent', value: 25, scope: 'products', targets: [1, 3], start: '2025-10-02', end: '2026-10-31', status: 'inactive' }
]
export const COUPONS = [
  { id: 1, code: 'WELCOME10', type: 'percent', value: 10, min: 50, max: 30, limit: 500, used: 214, start: '2025-01-01', end: '2026-12-31', status: 'active' },
  { id: 2, code: 'SHX25', type: 'percent', value: 25, min: 150, max: 80, limit: 200, used: 67, start: '2025-09-01', end: '2026-11-30', status: 'active' },
  { id: 3, code: 'FREESHIP', type: 'fixed', value: 5, min: 0, max: 5, limit: 1000, used: 803, start: '2025-01-01', end: '2026-12-31', status: 'active' },
  { id: 4, code: 'NEWYEAR', type: 'fixed', value: 20, min: 120, max: 20, limit: 300, used: 300, start: '2025-12-20', end: '2026-01-10', status: 'inactive' }
]
export const PROMOTIONS = [
  { id: 1, title: 'Autumn Drop 04', type: 'Homepage Banner', image: M.b, desc: 'Hero banner for the seasonal drop.', start: '2025-10-01', end: '2026-10-30', order: 1, status: 'active' },
  { id: 2, title: 'Flash Sale 48H', type: 'Flash Sale', image: M.c, desc: '48-hour site-wide flash campaign.', start: '2025-10-12', end: '2026-10-14', order: 2, status: 'active' },
  { id: 3, title: 'Jewelry Editorial', type: 'Featured Products', image: M.u, desc: 'Featured carousel on homepage.', start: '2025-09-15', end: '2026-12-01', order: 3, status: 'inactive' }
]
export const ADMIN_USERS = [
  { id: 1, name: 'Sovann Pich', email: 'owner@shadxw.com', role: 'Owner', status: 'active', last: '2 min ago' },
  { id: 2, name: 'Maly Chea', email: 'admin@shadxw.com', role: 'Admin', status: 'active', last: '1 h ago' },
  { id: 3, name: 'Rathana Keo', email: 'staff@shadxw.com', role: 'Staff', status: 'active', last: 'Yesterday' },
  { id: 4, name: 'Dara Nou', email: 'dara@shadxw.com', role: 'Staff', status: 'inactive', last: '12 Sep 2025' }
]
export const STOCK_HISTORY = [
  { date: '2025-10-12', sku: 'SHX-1000', change: +40, reason: 'Restock — supplier batch 23', by: 'Maly Chea' },
  { date: '2025-10-10', sku: 'SHX-1014', change: -6, reason: 'Order fulfilment', by: 'System' },
  { date: '2025-10-08', sku: 'SHX-1049', change: +25, reason: 'Restock', by: 'Sovann Pich' },
  { date: '2025-10-02', sku: 'SHX-1021', change: -12, reason: 'Damaged in transit', by: 'Rathana Keo' }
]
