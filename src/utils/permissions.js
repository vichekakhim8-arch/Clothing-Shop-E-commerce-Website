import { store } from '../stores'
import { t } from './i18n'

export const NAV = [
  { k: 'dashboard', to: '/admin', i: 'grid', l: () => t('dashboard') },
  { k: 'products', to: '/admin/products', i: 'box', l: () => t('products') },
  { k: 'categories', to: '/admin/categories', i: 'layers', l: () => t('categories') },
  { k: 'orders', to: '/admin/orders', i: 'truck', l: () => t('orders') },
  { k: 'customers', to: '/admin/customers', i: 'users', l: () => t('customers') },
  { k: 'discounts', to: '/admin/discounts', i: 'percent', l: () => t('discounts') },
  { k: 'coupons', to: '/admin/coupons', i: 'ticket', l: () => t('coupons') },
  { k: 'promotions', to: '/admin/promotions', i: 'sparkle', l: () => t('promotions') },
  { k: 'inventory', to: '/admin/inventory', i: 'archive', l: () => t('inventory') },
  { k: 'reviews', to: '/admin/reviews', i: 'star', l: () => t('reviews') },
  { k: 'reports', to: '/admin/reports', i: 'chart', l: () => t('reports') },
  { k: 'users', to: '/admin/admin-users', i: 'shield', l: () => t('adminUsers') },
  { k: 'settings', to: '/admin/settings', i: 'settings', l: () => t('settings') }
]

export const PERMS = {
  Owner: NAV.map(n => n.k),
  Admin: ['dashboard', 'products', 'categories', 'orders', 'customers', 'promotions', 'reviews', 'reports'],
  Staff: ['dashboard', 'orders', 'products', 'inventory']
}

export const can = k => PERMS[store.admin.role].includes(k)

const ROUTE_PERM = {
  '/admin': 'dashboard', '/admin/products': 'products', '/admin/categories': 'categories',
  '/admin/orders': 'orders', '/admin/customers': 'customers', '/admin/discounts': 'discounts',
  '/admin/coupons': 'coupons', '/admin/promotions': 'promotions', '/admin/inventory': 'inventory',
  '/admin/reviews': 'reviews', '/admin/reports': 'reports', '/admin/admin-users': 'users', '/admin/settings': 'settings'
}
export function routeAllowed (path) {
  let key = 'dashboard'
  Object.keys(ROUTE_PERM).forEach(k => { if (path === k || (k !== '/admin' && path.startsWith(k))) key = ROUTE_PERM[k] })
  return can(key)
}
