// warning: someone needs to be responsible for the copy; I think functions should produce
// new state; so this is where we'll do that
export const getFieldsFromError = ({ error, fields }) => {

  fields = { ...fields };
  let errorText = '';

  for (const key in error.fields) {

    fields[key] = {
      ...fields[key],
      error: error.fields[key]
    };

    errorText += error.fields[key] + '\n';
  }

  return { errorText, fields };
};

export const isAuthenticated = async () => {

  const result = await fetch('/api/auth', {
    headers: { Accept: 'application/json' },
    method: 'GET'
  });

  return result.ok;
}

export const buy = async ({ handle }) => {

  const result = await fetch('/api/buy', {
    body: JSON.stringify({ handle }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

  const { buy } = await result.json();
  return buy;
};

export const login = async ({ email }) => {

  const result = await fetch(`/api/auth/login?email=${email}`, {
    headers: { Accept: 'application/json' },
    method: 'GET'
  });

  const { auth = {} } = result.ok
    ? {}
    : await result.json();

  return auth;
}

export const getOrder = async (sessionId) => {

  const params = new URLSearchParams();
  if (sessionId) params.set('sessionId', sessionId);

  const result = await fetch(`/api/order?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    method: 'GET'
  });

  const { order } = await result.json();
  return order;
};

export const createProduct = async ({ fields, handle }) => {

  const body = getFormFromFields(fields);
  body.append('handle', handle);

  const result = await fetch('/api/product', {
    body,
    headers: { Accept: 'application/json' },
    method: 'POST'
  });

  const { product = {} } = result.ok
    ? {}
    : await result.json();

  return product;
};

export const deleteProduct = async ({ id }) => {

  const params = new URLSearchParams();
  params.set('id', id);

  await fetch(`/api/product?${params.toString()}`, {
    headers: { Accept: 'application/json' },
    method: 'DELETE'
  });
};

export const updateProduct = async ({ fields, id }) => {

  const body = getFormFromFields(fields);

  body.append('id', id);

  const result = await fetch('/api/product', {
    body,
    headers: { Accept: 'application/json' },
    method: 'PATCH'
  });

  const { product = {} } = result.ok
    ? {}
    : await result.json();

  return product;
};

export const getProductById = async (id) => {

  const result = await fetch(`/api/product/${id}`);

  const { product } = await result.json();
  return product;
}

export const addProductToOrder = async ({ fields, product }) => {

  const body = {
    id: product.id,
    ...getObjectFromFields(fields)
  };

  const result = await fetch('/api/order', {
    body: JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  });

  const { order = {} } = result.ok
    ? {}
    : await result.json();

  return order;
};

export const getProfile = async (handle) => {

  const result = await fetch(`/api/profile/${handle}`, {
    headers: { Accept: 'application/json' },
    method: 'GET'
  });

  const { profile } = await result.json();
  return profile;
};

export const setProfile = async ({ fields, handle }) => {

  const body = getFormFromFields(fields);
  body.append('handle', handle);

  const result = await fetch(`/api/profile`, {
    body,
    headers: { Accept: 'application/json' },
    method: 'PATCH'
  });

  const { profile = {} } = result.ok
    ? {}
    : await result.json();

  return profile;
};

export const getReceipt = async ({ handle, sessionId }) => {

  const params = new URLSearchParams();
  params.set('handle', handle);
  params.set('sessionId', sessionId);

  const result = await fetch(`/api/stripe/receipt?${params.toString()}`, {
    header: { Accept: 'application/json' },
    method: 'GET'
  });

  const { receipt } = await result.json();
  return receipt;
}

export const start = async (fields) => {

  const result = await fetch('/api/start', {
    body: getFormFromFields(fields),
    headers: { Accept: 'application/json' },
    method: 'POST'
  });

  const { start = {} } = result.ok
    ? {}
    : await result.json();

  return start;
};

export const getStripeAuthorization = async () => {

  const result = await fetch('/api/stripe/authorize', {
    headers: { Accept: 'application/json' },
    method: 'GET'
  });

  const { authorize } = await result.json();
  return authorize;
};

const getFormFromFields = (fields) => {

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

const getObjectFromFields = (fields) => {

  const object = {};

  for (const key in fields) {
    object[key] = fields[key].value;
  }

  return object;
};