import * as Api from './utils/api-client';
import { html } from 'lit-html';
import { setState } from './utils/state';
import { update } from './utils/render';

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

const handleSubmit = async ({ e, fields }) => {

  e.preventDefault();
  await Api.setProduct(fields);
};

const uncapturedState = setState(() => ({ fields: {} }));

const ManageProduct = ({ fields } = uncapturedState) => html`

  <h1>Manage product</h1>
  <form>
    <input
      @change=${handlePhotos}
      multiple
      name="photos",
      type="file"
    />
    <input
      @click=${(e) => handleSubmit({ e, fields })}
      type="submit"
      value="Save"
    />
  </form>`;

export default ManageProduct;