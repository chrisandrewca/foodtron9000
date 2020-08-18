export const setProduct = async (fields) => {

  const result = await fetch('/api/product', {
    body: formFromFields(fields),
    headers: { 'accept': 'json' },
    method: 'POST'
  });

  const { product } = await result.json();
  return product;
};

export const start = async (fields) => {

  const result = await fetch('/api/start', {
    body: formFromFields(fields),
    headers: { 'accept': 'json' },
    method: 'POST'
  });

  const { start = {} } = result.ok
    ? {}
    : await result.json();

  return start;
};

const formFromFields = (fields) => {

  const body = new FormData();
  for (const key in fields) {

    const { value } = fields[key];

    if (!Array.isArray(value)) {

      body.append(key, fields[key].value);
    } else {

      for (const item of value) {
        body.append(key, item);
      }
    }
  }

  return body;
};