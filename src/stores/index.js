import { reactive, watch } from 'vue'
import {
  PRODUCTS, CATEGORIES, ORDERS, CUSTOMERS, REVIEWS,
  DISCOUNTS, COUPONS, PROMOTIONS, ADMIN_USERS, STOCK_HISTORY
} from '../utils/data'

const saved = JSON.parse(localStorage.getItem('shx') || '{}')

export const store = reactive({
  lang: saved.lang || 'en',
  theme: saved.theme || 'light',
  products: PRODUCTS.map(p => ({ ...p })),
  categories: CATEGORIES.map(c => ({ ...c })),
  orders: ORDERS, customers: CUSTOMERS, reviews: REVIEWS,
  discounts: DISCOUNTS.map(d => ({ ...d })), coupons: COUPONS.map(c => ({ ...c })),
  promotions: PROMOTIONS.map(p => ({ ...p })), adminUsers: ADMIN_USERS.map(a => ({ ...a })),
  stockHistory: STOCK_HISTORY,
  settings: {
    storeName: 'SHADXW', tagline: 'Technical apparel for the modern city', email: 'hello@shadxw.com',
    phone: '+855 12 345 678', address: 'No. 24, Street 310, Phnom Penh', currency: 'USD', symbol: '$',
    language: 'en', tax: 0, freeShipOver: 150, flatShipping: 5,
    payments: { cod: true, bank: true, qr: true }, notifyOrder: true, notifyStock: true, notifyReview: false,
    khqr: {
      merchantName: 'SHADXW', merchantId: 'SHADXW_PP_01', accountId: 'shadxw_shop@acleda', city: 'Phnom Penh',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNjVmM2EyYjhjNGQxZTAwOTg3NjU0MzIxIn0sImlhdCI6MTczMDAwMDAwMCwiZXhwIjoxNzYxNTM2MDAwfQ.9kQvL2mXzT4pR8sN1wYbHcA7dFgJ3eKu',
      env: 'sandbox', status: 'connected', lastVerified: '2026-02-14 09:12', expires: '2026-12-31'
    },
    social: { instagram: '@shadxw', facebook: '/shadxw', tiktok: '@shadxw' }
  },
  cart: saved.cart || [],
  wishlist: saved.wishlist || [],
  user: saved.user || null,
  admin: { name: 'Sovann Pich', email: 'owner@shadxw.com', role: saved.role || 'Owner' },
  coupon: null,
  toasts: [], cartOpen: false, searchOpen: false,
  authOpen: false, authTab: 'login', authReason: '', authNext: '', loading: false
})

/* persistence + <html> class sync */
watch(
  () => [store.lang, store.theme, store.cart, store.wishlist, store.user, store.admin.role],
  () => {
    localStorage.setItem('shx', JSON.stringify({
      lang: store.lang, theme: store.theme, cart: store.cart,
      wishlist: store.wishlist, user: store.user, role: store.admin.role
    }))
    document.documentElement.classList.toggle('dark', store.theme === 'dark')
    document.documentElement.classList.toggle('km', store.lang === 'km')
    document.documentElement.lang = store.lang
  },
  { deep: true, immediate: true }
)
