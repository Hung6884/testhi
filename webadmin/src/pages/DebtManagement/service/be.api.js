const API_BASE = 'http://localhost:3000/api/v1';

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

