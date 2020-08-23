import * as Api from './utils/api-client';
import { getSearchParams, setLocation } from './utils/location';
import { html, nothing } from 'lit-html';
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

    const product = await Api.getProductById(params.get('id'));

    const state = await setState(state => ({
      ...state,
      fields: {
        ...state.fields,
        description: {
          ...state.fields.description,
          value: product.description
        },
        name: {
          ...state.fields.name,
          value: product.name
        },
        photos: {
          ...state.fields.photos,
          // TODO webp/jpeg
          value: product.photos.map(({ filename }) => ({ src: `/media/${filename}.jpeg` }))
        },
        price: {
          ...state.fields.price,
          value: product.price
        }
      },
      id: product.id
    }));

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

  await Api.deleteProduct({ id });

  setLocation(`/manage-profile?handle=${handle}`);
};

const handleSubmit = async ({ e, fields, handle, id }) => {

  e.preventDefault();

  let error;
  if (!id) {

    error = (await Api.createProduct({ fields, handle })).error;
  } else {

    error = (await Api.updateProduct({ fields, id })).error;
  }

  if (error) {

    const state = setState(state => {

      const { errorText, fields } = Api.getFieldsFromError({ error, fields: state.fields });

      return {
        ...state,
        errorText,
        fields
      };
    });

    await update(ManageProduct(state));
    setTimeout(() => alert(state.errorText), 1);

  } else {
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
      type="text"
      .value=${fields.price.value}
    />
  </label>
  <label>
    Description
    <textarea
      @change=${handleChange}
      class=""
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

export default ManageProduct;