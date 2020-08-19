import { html, nothing } from 'lit-html';
import { getProductById } from './utils/api-client';
import { getSearchParams } from './utils/location';
import { setState } from './utils/state';
import { update } from './utils/render';

(async () => {

  const params = getSearchParams();
  const product = await getProductById(params.get('id'));
  console.log({ product });

  const state = setState(state => ({
    ...state,
    loading: false,
    product
  }));

  update(ProfileProduct(state));
})();

const handleChange = (e) => {

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

  update(ProfileProduct(state));
};

const handleSubmit = ({ e, fields, product }) => {

  e.preventDefault();
};


const uncapturedState = setState(() => ({
  fields: {},
  loading: true
}));

const ProfileProduct = ({ fields, loading, product } = uncapturedState) =>
  loading ? nothing : html`
  <h1>${product.name}</h1>
  <p>${product.description}</p>
  <p>${product.price}</p>
  <textarea
    @change=${handleChange}
    class=""
    name="notes"
  ></textarea>
  <input
    @change=${(e) => handleSubmit({ e, fields, product })}
    class="signup-button"
    type="submit"
    value="Add to order"
  />`;

export default ProfileProduct;