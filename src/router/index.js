import { createRouter, createWebHashHistory } from 'vue-router'
import { store } from '../stores'
import { t } from '../utils/i18n'

/* storefront */
import HomeView from '../views/shop/HomeView.vue'
import ShopView from '../views/shop/ShopView.vue'
import ProductDetailView from '../views/shop/ProductDetailView.vue'
import CartView from '../views/shop/CartView.vue'
import CheckoutView from '../views/shop/CheckoutView.vue'
import OrderSuccessView from '../views/shop/OrderSuccessView.vue'
import OrdersView from '../views/shop/OrdersView.vue'
import OrderDetailView from '../views/shop/OrderDetailView.vue'
import WishlistView from '../views/shop/WishlistView.vue'
import AccountView from '../views/shop/AccountView.vue'
import LoginView from '../views/shop/LoginView.vue'
import RegisterView from '../views/shop/RegisterView.vue'
import NotFoundView from '../views/shop/NotFoundView.vue'

/* admin */
import DashboardView from '../views/admin/DashboardView.vue'
import ProductsView from '../views/admin/ProductsView.vue'
import ProductFormView from '../views/admin/ProductFormView.vue'
import CategoriesView from '../views/admin/CategoriesView.vue'
import AdminOrdersView from '../views/admin/OrdersView.vue'
import AdminOrderDetailView from '../views/admin/OrderDetailView.vue'
import CustomersView from '../views/admin/CustomersView.vue'
import DiscountsView from '../views/admin/DiscountsView.vue'
import CouponsView from '../views/admin/CouponsView.vue'
import PromotionsView from '../views/admin/PromotionsView.vue'
import InventoryView from '../views/admin/InventoryView.vue'
import ReviewsView from '../views/admin/ReviewsView.vue'
import ReportsView from '../views/admin/ReportsView.vue'
import AdminUsersView from '../views/admin/AdminUsersView.vue'
import SettingsView from '../views/admin/SettingsView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/shop', component: ShopView },
  { path: '/category/:slug', component: ShopView, props: true },
  { path: '/product/:id', component: ProductDetailView },
  { path: '/cart', component: CartView },
  { path: '/checkout', component: CheckoutView, meta: { auth: true } },
  { path: '/order-success', component: OrderSuccessView, meta: { auth: true } },
  { path: '/orders', component: OrdersView, meta: { auth: true } },
  { path: '/order/:id', component: OrderDetailView, meta: { auth: true } },
  { path: '/wishlist', component: WishlistView },
  { path: '/account', component: AccountView, meta: { auth: true } },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/admin', component: DashboardView, meta: { admin: true } },
  { path: '/admin/products', component: ProductsView, meta: { admin: true } },
  { path: '/admin/products/create', component: ProductFormView, meta: { admin: true } },
  { path: '/admin/products/:id/edit', component: ProductFormView, meta: { admin: true } },
  { path: '/admin/categories', component: CategoriesView, meta: { admin: true } },
  { path: '/admin/orders', component: AdminOrdersView, meta: { admin: true } },
  { path: '/admin/orders/:id', component: AdminOrderDetailView, meta: { admin: true } },
  { path: '/admin/customers', component: CustomersView, meta: { admin: true } },
  { path: '/admin/discounts', component: DiscountsView, meta: { admin: true } },
  { path: '/admin/coupons', component: CouponsView, meta: { admin: true } },
  { path: '/admin/promotions', component: PromotionsView, meta: { admin: true } },
  { path: '/admin/inventory', component: InventoryView, meta: { admin: true } },
  { path: '/admin/reviews', component: ReviewsView, meta: { admin: true } },
  { path: '/admin/reports', component: ReportsView, meta: { admin: true } },
  { path: '/admin/admin-users', component: AdminUsersView, meta: { admin: true } },
  { path: '/admin/settings', component: SettingsView, meta: { admin: true } },
  { path: '/:pathMatch(.*)*', component: NotFoundView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior () { return { top: 0 } }
})

/* purchasing requires an account */
router.beforeEach((to) => {
  if (to.meta.auth && !store.user) {
    store.authTab = 'login'
    store.authReason = to.path === '/checkout' ? t('loginToCheckout') : t('loginToBuy')
    store.authNext = to.fullPath
    store.authOpen = false /* dedicated page handles it */
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
