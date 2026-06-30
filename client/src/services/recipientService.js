const BASE = 'http://localhost:4000/recipients';

async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function getRecipients() {
  return handleResponse(await fetch(BASE));
}

export async function createRecipient(data) {
  return handleResponse(await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }));
}

export async function updateRecipient(id, data) {
  return handleResponse(await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }));
}

export async function deleteRecipient(id) {
  return handleResponse(await fetch(`${BASE}/${id}`, { method: 'DELETE' }));
}
