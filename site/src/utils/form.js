/*
 * Copy fields object and each fields value
 */
export const copyFields = (fields) => {

  fields = { ...fields };
  for (const key in fields) {

    fields[key] = { ...fields[key] };
  }

  return fields;
};

export const trimFields = (fields) => {

  for (const key in fields) {

    const { value } = fields[key];

    if ('string' === typeof value) {
      fields[key].value = value.trim();
    }
  }
};