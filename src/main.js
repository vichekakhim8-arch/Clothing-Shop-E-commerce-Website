import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './stores'
import { t } from './utils/i18n'
import { money, priceOf, catName, toast, addToCart, toggleWish, prodById, setLang, toggleLang, requireAuth } from './utils/helpers'
import './styles/main.css'

/* ---- global UI components (used across both experiences) ---- */
import UiIcon from './components/ui/UiIcon.vue'
import UiButton from './components/ui/UiButton.vue'
import UiInput from './components/ui/UiInput.vue'
import UiTextarea from './components/ui/UiTextarea.vue'
import UiSelect from './components/ui/UiSelect.vue'
import UiBadge from './components/ui/UiBadge.vue'
import UiSwitch from './components/ui/UiSwitch.vue'
import UiModal from './components/ui/UiModal.vue'
import ConfirmModal from './components/ui/ConfirmModal.vue'
import ToastHost from './components/ui/ToastHost.vue'
import EmptyState from './components/ui/EmptyState.vue'
import LoadingState from './components/ui/LoadingState.vue'
import UiPagination from './components/ui/UiPagination.vue'
import DataTable from './components/ui/DataTable.vue'
import StarRating from './components/ui/StarRating.vue'
import MiniChart from './components/ui/MiniChart.vue'
import ExportMenu from './components/ui/ExportMenu.vue'
import DateRangeMenu from './components/ui/DateRangeMenu.vue'

import PriceTag from './components/common/PriceTag.vue'
import StatusBadge from './components/common/StatusBadge.vue'
import SectionHead from './components/common/SectionHead.vue'
import ProductCard from './components/common/ProductCard.vue'
import ProductGrid from './components/common/ProductGrid.vue'
import QuickView from './components/common/QuickView.vue'
import ProductFilters from './components/common/ProductFilters.vue'
import ProductShowcase from './components/common/ProductShowcase.vue'
import OrderSummary from './components/common/OrderSummary.vue'
import KhqrCode from './components/common/KhqrCode.vue'
import KhqrPanel from './components/common/KhqrPanel.vue'
import BarCode from './components/common/BarCode.vue'
import OrderReceipt from './components/common/OrderReceipt.vue'
import ReceiptModal from './components/common/ReceiptModal.vue'
import SearchOverlay from './components/common/SearchOverlay.vue'

import AdminHead from './components/layout/AdminHead.vue'
import AdminCard from './components/layout/AdminCard.vue'
import StatCard from './components/layout/StatCard.vue'

const app = createApp(App)

const globals = {
  UiIcon, UiButton, UiInput, UiTextarea, UiSelect, UiBadge, UiSwitch, UiModal, ConfirmModal,
  ToastHost, EmptyState, LoadingState, UiPagination, DataTable, StarRating, MiniChart,
  ExportMenu, DateRangeMenu, PriceTag, StatusBadge, SectionHead, ProductCard, ProductGrid,
  QuickView, ProductFilters, ProductShowcase, OrderSummary, KhqrCode, KhqrPanel, BarCode,
  OrderReceipt, ReceiptModal, SearchOverlay, AdminHead, AdminCard, StatCard
}
Object.entries(globals).forEach(([name, comp]) => app.component(name, comp))

/* template helpers shared by every component */
app.config.globalProperties.$t = t
app.config.globalProperties.$s = store
app.config.globalProperties.$money = money
app.config.globalProperties.$price = priceOf
app.config.globalProperties.$catName = catName
app.config.globalProperties.$toast = toast
app.config.globalProperties.$addToCart = addToCart
app.config.globalProperties.$toggleWish = toggleWish
app.config.globalProperties.$prod = prodById
app.config.globalProperties.$setLang = setLang
app.config.globalProperties.$toggleLang = toggleLang
app.config.globalProperties.$requireAuth = requireAuth

app.use(router).mount('#app')
