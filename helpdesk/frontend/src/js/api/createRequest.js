const BASE_URL = '/api';

// Единая точка запросов к бэкенду. Возвращает Promise с данными или null (для 204).
export default function createRequest(method, { id = null, body = null } = {}) {
  const url = new URL(BASE_URL, window.location.origin);
  url.searchParams.set('method', method);
  if (id !== null) url.searchParams.set('id', id);

  const options = {};
  if (body) {
    options.method = 'POST';
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  return fetch(url, options).then((response) => {   // ← return обязателен!
    if (!response.ok) throw new Error(`Ошибка запроса: ${response.status}`);
    if (response.status === 204) return null;
    return response.json();
  });
}