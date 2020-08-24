import * as Api from './utils/api-client';
import { copyFields, trimFields } from './utils/form';
import { html, nothing } from 'lit-html';
import { getProductById } from './utils/api-client';
import { getSearchParams, setLocation } from './utils/location';
import { setState } from './utils/state';
import { update } from './utils/render';

export const loadState = async () => {

  const state = setState(() => ({
    fields: {
      quantity: { value: 1 }
    },
    loading: true,
    product: {
      photos: []
    }
  }));

  await update(ProfileProduct(state));
};

export const loadEffect = async () => {

  // TODO better error handling
  const params = getSearchParams();
  const product = await getProductById(params.get('id'));

  const state = setState(state => ({
    ...state,
    loading: false,
    product
  }));

  await update(ProfileProduct(state));
};

const handleChange = async (e) => {

  const { name, value } = e.target;

  const state = setState(state => ({
    ...state,
    fields: {
      ...state.fields,
      [name]: {
        ...state.fields[name],
        value: value
      }
    }
  }));

  await update(ProfileProduct(state));
};

const handleSubmit = async ({ e, fields, product }) => {

  e.preventDefault();
  e.target.disabled = true;

  fields = copyFields(fields);
  trimFields(fields);

  const { error } = await Api.addProductToOrder({ fields, product });

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

    await update(ProfileProduct(state));

    setTimeout(() => alert(state.errorText), 1);
  } else {

    e.target.disabled = false;

    setLocation(`/${product.handle}`);
  }
};

const ProfileProduct = ({
  fields,
  loading,
  product
}) => loading ? nothing : html`

<style type="text/css">
  .container {
    font-size: 4vw;
    margin: 0 auto;
    max-width: 90vw;
    overflow-wrap: break-word;
    padding: 1vh 0 0 0;
  }

  h1 {
    font-size: 8vw;
    text-align: center;
  }

  h2 {
    font-weight: 400;
    text-decoration: underline;
  }

  a, label, input, textarea {
    font-size: 16px;
  }

  main {
    padding: 0 0 1vh 0;
  }

  section {
    margin: 0 0 3vh 0;
  }

  form {
    padding: 2vh 0 0 0;
  }

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
    margin: 0 auto;
  }

  input, label, textarea {
    display: block;
    margin: 0 0 3vh 0;
    width: 100%;
  }

  textarea, input {
    border: 0.1rem solid #999;
    padding: 2vw;
    resize: vertical;
  }

  .insta-button {
    border: 0.1rem solid #999;
    border-radius: 3px;
    box-shadow: none;
    background: white;
    color: #262626;
    font-size: 2vh;
    font-weight: 400;
    padding: 1.2vw 4vw;
    text-transform: none;
  }
</style>

<div class="container">
<header>
  <h1>${product.name}</h1>
</header>

<main>

<picture>
  <source
    media="(min-width: 0px)"
    sizes="100%"
    .srcset=${`/media/1080/${product.photos[0].filename}.webp`}
    type="image/webp" />

  <source
    media="(min-width: 0px)"
    sizes="100%"
    .srcset=${`/media/1080/${product.photos[0].filename}.jpeg`}
    type="image/jpeg" />

  <img
    .alt=${name}
    class="gallery-image"'
    sizes="100%"
    .srcset=${`/media/1080/${product.photos[0].filename}.jpeg`}
  />
</picture>

<p>${product.description}</p>
<p>$${product.price}</p>

<label>
  Quantity
  <input
    @change=${handleChange}
    inputmode='numeric'
    name="quantity"
    pattern='\d'
    type="number"
    .value=${fields.quantity.value}
  />
</label>

<label>
  Note
  <textarea
    @change=${handleChange}
    name="note"
  ></textarea>
</label>

<input
  class="signup-button"
  @click=${(e) => handleSubmit({ e, fields, product })}
  type="submit"
  value="Add to order"
/>
</main>
</div>`;