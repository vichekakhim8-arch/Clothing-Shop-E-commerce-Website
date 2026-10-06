/* =========================================================
   KHQR — EMVCo / Bakong compliant payload generator
   Spec: EMV QRCPS + NBC KHQR. TLV encoded, CRC-16/CCITT-FALSE.
   ========================================================= */
const KHQR_TAG = {
  VERSION: '00', INIT_METHOD: '01', MERCHANT_INDIVIDUAL: '29', MERCHANT_ENTITY: '30',
  MCC: '52', CURRENCY: '53', AMOUNT: '54', COUNTRY: '58', NAME: '59', CITY: '60',
  ADDITIONAL: '62', CRC: '63', TIMESTAMP: '99'
}
const KHQR_CCY = { USD: '840', KHR: '116' }

/* TLV: 2-digit tag + 2-digit zero-padded length + value */
const tlv = (tag, value) => (value === null || value === undefined || value === '') ? ''
  : tag + String(String(value).length).padStart(2, '0') + value

/* CRC-16/CCITT-FALSE — poly 0x1021, init 0xFFFF */
export function crc16 (str) {
  let crc = 0xFFFF
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function buildKHQR (o) {
  const opt = Object.assign({
    bakongId: 'shadxw@aclb', merchantName: 'SHADXW', city: 'Phnom Penh',
    amount: 0, currency: 'USD', billNumber: '', mobile: '', storeLabel: 'SHADXW STORE',
    terminal: 'WEB-01', mcc: '5651', isMerchant: true, dynamic: true
  }, o || {})
  const acct = tlv('00', opt.bakongId) + tlv('01', opt.merchantName.slice(0, 25)) + tlv('02', opt.terminal)
  const extra = tlv('01', String(opt.billNumber || '').slice(0, 25)) +
    tlv('02', String(opt.mobile || '').replace(/\D/g, '').slice(0, 25)) +
    tlv('03', String(opt.storeLabel || '').slice(0, 25)) +
    tlv('07', String(opt.terminal || '').slice(0, 25))
  let payload =
    tlv(KHQR_TAG.VERSION, '01') +
    tlv(KHQR_TAG.INIT_METHOD, opt.dynamic ? '12' : '11') +
    tlv(opt.isMerchant ? KHQR_TAG.MERCHANT_ENTITY : KHQR_TAG.MERCHANT_INDIVIDUAL, acct) +
    tlv(KHQR_TAG.MCC, opt.mcc) +
    tlv(KHQR_TAG.CURRENCY, KHQR_CCY[opt.currency] || KHQR_CCY.USD) +
    (Number(opt.amount) > 0 ? tlv(KHQR_TAG.AMOUNT, Number(opt.amount).toFixed(2)) : '') +
    tlv(KHQR_TAG.COUNTRY, 'KH') +
    tlv(KHQR_TAG.NAME, opt.merchantName.slice(0, 25)) +
    tlv(KHQR_TAG.CITY, opt.city.slice(0, 15)) +
    tlv(KHQR_TAG.ADDITIONAL, extra) +
    tlv(KHQR_TAG.TIMESTAMP, tlv('00', String(Date.now())))
  payload += KHQR_TAG.CRC + '04'
  return payload + crc16(payload)
}

/* FNV-ish short hash used as a display transaction reference */
export function shortHash (str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0 }
  return h.toString(16).toUpperCase().padStart(8, '0')
}
export const txnRef = order => 'TXN' + shortHash(String(order && order.id) + String(order && order.total)) +
  String(Math.abs(Math.round((order && order.total || 0) * 100))).padStart(5, '0').slice(0, 5)
