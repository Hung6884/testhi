const RAW_BASE =
  (typeof window !== 'undefined' && window.env && window.env.API_HOST) ||
  '/api';

const API_BASE = RAW_BASE.replace(/\/$/, ''); // bỏ dấu / cuối nếu có

function joinUrl(base, path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

async function postJson(path, body) {
  const token = localStorage.getItem('token'); // nếu có lưu trong localStorage
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// gọi trực tiếp API production orders
export function getListProductionOrders(body) {
  return postJson('/production-orders/get-list', body);
}
export function getListProductionOrdersPet(body) {
  return postJson('/production-order-pets/get-list', body);
}

export function getPetSummary(body) {
  return postJson('/production-order-pets/get-sumary-price', body);
}
export function getListDirectOrders(body) {
  return postJson('/production-order-direct/get-list', body);
}
export function getCashbookList(body) {
  return postJson('/revenue-expenditure-histories/get-list', body);
}

export function getCashbookTotals(body) {
  return postJson('/revenue-expenditure-histories/get-totals', body);
}

export function getThermalPriceSummary(body) {
  return postJson('/production-orders/get-sumary-price', body);
}
export function getSumaryPriceDirect(body) {
  return postJson('/production-order-direct/get-sumary-price', body);
}
export function getCustomers(body) {
  return postJson('/customers/get-list', body);
}
export function getReceiptList(body) {
  return postJson('/receipts/get-list', body);
}