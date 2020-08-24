import * as Api from './utils/api-client';
import { copyFields, trimFields } from './utils/form';
import { html, nothing } from 'lit-html';
import { getSearchParams, setLocation } from './utils/location';
import { setState } from './utils/state';
import { update } from './utils/render';

export const loadState = async () => {

  const params = getSearchParams();
  if (!params.has('handle')) {
    setLocation('/');
  }

  const state = setState(() => ({
    fields: {
      description: { value: '' },
      name: { value: '' },
      photos: {},
      price: { value: '' }
    },
    handle: params.get('handle')
  }));

  await update(ManageProduct(state));
};

export const loadEffect = async () => {

  const params = getSearchParams();

  if (params.has('id')) {

    // TODO better error handling
    const product = await Api.getProductById(params.get('id'));

    const state = await setState(state => {

      const fields = copyFields(state.fields);

      fields.description.value = product.description;
      fields.name.value = product.name;

      // TODO webp/jpeg
      fields.photos.value = product.photos.map(({ filename }) =>
        ({ src: `/media/${filename}.jpeg` }));

      fields.price.value = product.price;

      return {
        ...state,
        fields,
        id: product.id
      }
    });

    await update(ManageProduct(state));
  }
};

const handleChange = async (e) => {

  const { name, value } = e.target;

  const state = setState(state => ({
    ...state,
    fields: {
      ...state.fields,
      [name]: {
        ...state.fields[name],
        value
      }
    }
  }));

  await update(ManageProduct(state));
};

const handlePhotos = async (e) => {

  // TODO error handling when API results in 413 via nginx -- payload too large
  // TODO error handling when reader fails

  // order doesnt matter, trying to avoid race conditions on setting state, where
  // two copies of state will be grabbed and then only one committed, whoever finished last
  const readFileAsDataUrl = (file) => {

    const reader = new FileReader();
    return new Promise(resolve => {
      reader.onload = (e) => {
        resolve({ file, result: e.target.result });
      };
      reader.readAsDataURL(file);
    });
  };

  const readers = [];
  for (const file of e.target.files) {
    readers.push(readFileAsDataUrl(file));
  }

  const files = [];
  const sources = [];
  const images = await Promise.all(readers);

  const imageCount = Math.min(images.length, 8);
  for (let i = 0; i < imageCount; i++) {
    const image = images[i];
    files.push(image.file);
    sources.push(image.result);
  }

  const state = setState(state => ({
    ...state,
    fields: {
      ...state.fields,
      photos: {
        ...state.fields.photo,
        srcs: sources,
        value: files
      }
    }
  }));

  await update(ManageProduct(state));
};

const handleDelete = async ({ e, handle, id }) => {

  e.preventDefault();
  e.target.disabled = true;

  // TODO better error handling
  await Api.deleteProduct({ id });

  e.target.disabled = false;
  setLocation(`/manage-profile?handle=${handle}`);
};

const handleSubmit = async ({ e, fields, handle, id }) => {

  e.preventDefault();
  e.target.disabled = true;

  fields = copyFields(fields);
  trimFields(fields);

  const { error } = id
    ? await Api.updateProduct({ fields, id })
    : await Api.createProduct({ fields, handle });

  console.log({ error });
  if (error) {

    const state = setState(state => {

      const { errorText, fields } = Api.getFieldsFromError({
        error,
        fields: copyFields(state.fields)
      });

      return {
        ...state,
        errorText,
        fields
      };
    });

    e.target.disabled = false;

    await update(ManageProduct(state));

    setTimeout(() => alert(state.errorText), 1);

  } else {

    e.target.disabled = false;

    setLocation(`/manage-profile?handle=${handle}`);
  }
};

const ManageProduct = ({ fields, handle, id }) => html`

<h1>Manage product</h1>
<form>
  <input
    @change=${handlePhotos}
    multiple
    name="photos",
    type="file"
  />

  <label>
    Name
    <input
      @change=${handleChange}
      name="name"
      type="text"
      .value=${fields.name.value}
    />
  </label>

  <label>
    Price
    <input
      @change=${handleChange}
      name="price"
      type="number"
      .value=${fields.price.value}
    />
  </label>

  <label>
    Description
    <textarea
      @change=${handleChange}
      name="description"
      .value=${fields.description.value}
    ></textarea>
  </label>

  ${ id ? html`
  <input
    @click=${(e) => handleDelete({ e, handle, id })}
    type="submit"
    value="Delete"
  />` : nothing}

  <input
    @click=${(e) => handleSubmit({ e, fields, handle, id })}
    type="submit"
    value="Save"
  />
</form>`;