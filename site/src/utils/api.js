export const start = async (fields) => {

  const values = {};
  for (const key in fields) {
    values[key] = fields[key].value;
  }

  const result = await fetch('/api/start', {
    body: JSON.stringify(values),
    headers: {
      'accept': 'json',
      'content-type': 'application/json'
    },
    method: 'POST'
  });

  const { start } = await result.json();
  return start;
};