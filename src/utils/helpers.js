import { computed, nextTick } from 'vue'
import { store } from '../stores'
import { t } from './i18n'

/* ---------------- formatting ---------------- */
export const money = v => store.settings.symbol + Number(v || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const round2 = v => Math.round(v * 100) / 100

/* ---------------- discount engine ---------------- */
const inRange = d => { const n = new Date(); return (!d.start || new Date(d.start) <= n) && (!d.end || new Date(d.end) >= n) }

export function bestDiscount (p) {
  const cands = []
  if (p.discount && p.discount.active && inRange(p.discount)) cands.push({ ...p.discount, label: 'Product', source: 'product' })
  store.discounts.forEach(d => {
    if (d.status !== 'active' || !inRange(d)) return
    const match = d.scope === 'all' ||
      (d.scope === 'category' && d.targets.includes(p.category)) ||
      (d.scope === 'products' && d.targets.map(Number).includes(Number(p.id)))
    if (match) cands.push({ ...d, label: d.name, source: d.scope })
  })
  if (!cands.length) return null
  return cands.map(d => ({ d, off: d.type === 'percent' ? p.price * d.value / 100 : Math.min(d.value, p.price) }))
    .sort((a, b) => b.off - a.off)[0].d
}

export function priceOf (p) {
  if (!p) return { base: 0, final: 0, off: 0, percent: 0, has: false, discount: null }
  const d = bestDiscount(p)
  const off = d ? round2(d.type === 'percent' ? p.price * d.value / 100 : Math.min(d.value, p.price)) : 0
  return { base: p.price, final: round2(p.price - off), off, percent: Math.round(off / p.price * 100), has: off > 0.009, discount: d }
}

export const stockState = p => p.stock === 0 ? 'out' : p.stock <= 10 ? 'low' : 'in'
export const prodById = id => store.products.find(p => Number(p.id) === Number(id))
export const catName = slug => { const c = store.categories.find(x => x.slug === slug); return c ? (store.lang === 'km' ? c.nameKm : c.name) : slug }

/* ---------------- toast ---------------- */
export function toast (message, type) {
  const id = Date.now() + Math.random()
  store.toasts.push({ id, message, type: type || 'success' })
  setTimeout(() => { const i = store.toasts.findIndex(x => x.id === id); if (i > -1) store.toasts.splice(i, 1) }, 3200)
}

/* ---------------- auth gate : purchasing requires an account ---------------- */
export function requireAuth (reason) {
  if (store.user) return true
  store.authTab = 'login'
  store.authReason = reason || t('loginToBuy')
  store.authOpen = true
  store.cartOpen = false
  return false
}

/* ---------------- cart / wishlist ---------------- */
export function addToCart (p, size, color, qty) {
  if (!requireAuth(t('loginToBuy'))) return false
  const key = p.id + '|' + (size || '-') + '|' + (color || '-')
  const ex = store.cart.find(i => i.key === key)
  if (ex) ex.qty += (qty || 1)
  else store.cart.push({ key, pid: p.id, size: size || p.sizes[0], color: color || p.colors[0], qty: qty || 1 })
  toast(p.name + ' — ' + t('addToCart'))
  return true
}
export function toggleWish (id) {
  if (!requireAuth(t('loginToWish'))) return false
  const i = store.wishlist.indexOf(id)
  if (i > -1) { store.wishlist.splice(i, 1); toast('Removed from wishlist', 'info') }
  else { store.wishlist.push(id); toast('Added to wishlist') }
  return true
}
export const cartCount = computed(() => store.cart.reduce((s, i) => s + (parseInt(i.qty, 10) || 0), 0))
export const cartLines = computed(() => store.cart.filter(i => !!prodById(i.pid)).map(i => {
  const p = prodById(i.pid); const pr = priceOf(p)
  const qty = parseInt(i.qty, 10) || parseInt(i.quantity, 10) || 0
  const itemRowTotal = pr.final * qty
  const itemRowTotalBase = pr.base * qty
  return { ...i, qty, quantity: qty, product: p, unit: pr.final, base: pr.base, off: pr.off, line: round2(itemRowTotal), pr }
}))
export const cartSubtotal = computed(() => round2(cartLines.value.reduce((s, l) => s + (l.base * l.qty), 0)))
export const cartSubtotalAlt = computed(() => round2(cartLines.value.reduce((s, l) => s + (l.price * l.qty || l.base * l.qty), 0)))
export const cartDiscount = computed(() => round2(cartLines.value.reduce((s, l) => s + (l.off * l.qty), 0)))
export const couponValue = computed(() => {
  const c = store.coupon; if (!c) return 0
  const after = cartSubtotal.value - cartDiscount.value
  const v = c.type === 'percent' ? after * c.value / 100 : c.value
  return round2(Math.min(v, c.max || v))
})
export const shipFee = computed(() => {
  const after = cartSubtotal.value - cartDiscount.value - couponValue.value
  return after <= 0 ? 0 : after >= store.settings.freeShipOver ? 0 : store.settings.flatShipping
})
export const cartTotal = computed(() => round2(Math.max(0, cartSubtotal.value - cartDiscount.value - couponValue.value 
+ shipFee.value)))

/* ---------------- body scroll lock (ref-counted) ---------------- */
let lockCount = 0
export function lockScroll (on) {
  const b = document.body
  if (on) {
    if (++lockCount === 1) {
      const sw = window.innerWidth - document.documentElement.clientWidth
      b.style.overflow = 'hidden'
      if (sw > 0) b.style.paddingRight = sw + 'px'
    }
  } else if (lockCount > 0) {
    if (--lockCount === 0) { b.style.overflow = ''; b.style.paddingRight = '' }
  }
}

/* ---------------- smooth language switch ---------------- */
let langBusy = false
export function setLang (l) {
  if (langBusy || store.lang === l) return
  langBusy = true
  const el = document.documentElement
  const y = window.scrollY
  el.classList.add('lang-switching')
  setTimeout(() => {
    store.lang = l
    nextTick(() => {
      window.scrollTo({ top: y, behavior: 'auto' })
      requestAnimationFrame(() => { el.classList.remove('lang-switching'); langBusy = false })
    })
  }, 170)
}
export const toggleLang = () => setLang(store.lang === 'en' ? 'km' : 'en')

export const swatch = c => ({
  Black: '#111', White: '#fff', Grey: '#9a9a9a', Olive: '#5a5f3d', Sand: '#d8c9ae',
  Silver: '#c9ccd1', Red: '#c23b22', Charcoal: '#3a3a3c', Neon: '#c6ff2e'
}[c] || '#888')
