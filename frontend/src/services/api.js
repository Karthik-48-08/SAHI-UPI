const API_URL = 'http://localhost:5000/api';

export const fetchStats = async () => {
  try {
    const res = await fetch(`${API_URL}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const submitTransaction = async (transaction) => {
  try {
    const res = await fetch(`${API_URL}/transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    if (!res.ok) throw new Error('Failed to submit transaction');
    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
