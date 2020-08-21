import * as Api from './utils/api-client';
import { html, nothing } from 'lit-html';
import { getProductById } from './utils/api-client';
import { getSearchParams, setLocation } from './utils/location';
import { setState } from './utils/state';
import { update } from './utils/render';

export const loadState = async () => {

  const state = setState(() => ({
    fields: {},
    loading: true
  }));

  await update(ProfileProduct(state));
};

export const loadEffect = async () => {

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

  const { error } = await Api.addProductToOrder({ fields, product });

  if (error) {

    const state = setState(state => {

      const { errorText, fields } = Api.getFieldsFromError({ error, fields: state.fields });

      return {
        ...state,
        errorText,
        fields
      };
    });

    await update(ProfileProduct(state));
  } else {

    setLocation('/profile');
  }
};

const ProfileProduct = ({ fields, loading, product }) =>
  loading ? nothing : html`
  <h1>${product.name}</h1>
  <p>${product.description}</p>
  <p>${product.price}</p>
  <input
    @change=${handleChange}
    name="quantity"
    inputmode='numeric'
    pattern='\d'
    type="text"
  />
  <textarea
    @change=${handleChange}
    class=""
    name="note"
  ></textarea>
  <input
    @click=${(e) => handleSubmit({ e, fields, product })}
    class="signup-button"
    type="submit"
    value="Add to order"
  />`;

export default ProfileProduct;