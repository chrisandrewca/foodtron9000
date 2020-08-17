export const start = async (fields) => {

  const body = new FormData();
  for (const key in fields) {
    body.append(key, fields[key].value);
  }

  const result = await fetch('/api/start', {
    body,
    headers: { 'accept': 'json' },
    method: 'POST'
  });

  const { start = {} } = result.ok
    ? {}
    : await result.json();

  return start;
};