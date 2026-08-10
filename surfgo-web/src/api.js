export const api = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-Platform': 'SpaceBookWeb',
    'X-Epoch': Math.floor(Date.now() / 86400000).toString(), // Days since unix epoch
    'X-Cycle': Math.floor((Date.now() % 86400000) / 3600000).toString(), // Hours within current day
    ...options.headers,
  };

  const response = await fetch(`http://localhost:8787${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
};
