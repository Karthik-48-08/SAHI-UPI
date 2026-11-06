// Sahi UPI API Client Service
// Supports connecting to FastAPI (port 8000) with fallback to port 5000 or custom VITE_API_URL

const BASE_URLS = [
  import.meta.env.VITE_API_URL,
  'http://localhost:8008/api',
  'http://localhost:8000/api',
  'http://localhost:5000/api',
  '/api'
].filter(Boolean);

let activeBaseUrl = BASE_URLS[0];

async function apiFetch(endpoint, options = {}) {
  // Try activeBaseUrl first
  try {
    const res = await fetch(`${activeBaseUrl}${endpoint}`, options);
    if (res.ok) return await res.json();
  } catch (err) {
    // Try other base URLs if primary fails
    for (const alt of BASE_URLS) {
      if (alt === activeBaseUrl) continue;
      try {
        const res = await fetch(`${alt}${endpoint}`, options);
        if (res.ok) {
          activeBaseUrl = alt;
          return await res.json();
        }
      } catch (e) {
        // continue
      }
    }
  }
  return null;
}

export const fetchStats = async () => {
  const data = await apiFetch('/stats');
  if (data) return data;
  // Fallback mock stats if backend is starting up
  return {
    protectionRate: 99.8,
    avgResponseMs: 48,
    todayScans: 2845,
    threatsBlocked: 157,
    suspiciousFlagged: 42,
    usersProtected: "48.2K",
    riskDistribution: { low: 2646, medium: 42, high: 157 }
  };
};

export const submitTransaction = async (transaction) => {
  return await apiFetch('/transaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction)
  });
};

export const fetchTransactions = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return await apiFetch(`/transactions${query ? `?${query}` : ''}`);
};

export const fetchModelMetrics = async () => {
  return await apiFetch('/model/metrics');
};

export const fetchScenarios = async () => {
  return await apiFetch('/scenarios');
};

export const freezeAccount = async (userId = 'user_001', reason = 'Emergency Freeze by User') => {
  return await apiFetch('/emergency/freeze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, reason })
  });
};

export const unfreezeAccount = async (userId = 'user_001') => {
  return await apiFetch('/emergency/unfreeze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });
};

export const reportFraud = async (reportData) => {
  return await apiFetch('/emergency/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData)
  });
};

export const fetchUsers = async () => {
  return await apiFetch('/users');
};
