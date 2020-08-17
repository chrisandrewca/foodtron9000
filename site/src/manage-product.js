import { html } from 'lit-html';

const handlePhotos = (e) => {
};

const ManageProduct = () => html`

  <h1>Manage product</h1>
  <form>
    <input
      @change=${handlePhotos}
      name="photos",
      type="file"
    />
  </form>`;

export default ManageProduct;