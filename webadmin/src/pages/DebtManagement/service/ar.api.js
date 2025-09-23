const API_BASE = 'https://fastexapp.vtgo.vn';

async function postJson(path, body) {
  const token = localStorage.getItem('token'); // nếu có
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

export function getListPaymentHistory(body) {
  return postJson('/customers/get-list-payment-history-v5', body);
}

// placeholder cho hàng tổng, sẽ thay bằng API thật sau
export function getSumRevenue() {
  return Promise.resolve({
    sumRevenue: 0, sumQuantity: 0, sumOtherArising: 0, sumReduce: 0, sumPayment: 0,
  });
}
