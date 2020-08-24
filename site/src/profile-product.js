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
    loading: true
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

const ProfileProduct = ({ fields, loading, product }) =>

  loading ? nothing : html`

<h1>${product.name}</h1>
<p>${product.description}</p>
<p>${product.price}</p>

<input
  @change=${handleChange}
  inputmode='numeric'
  name="quantity"
  pattern='\d'
  type="number"
  .value=${fields.quantity.value}
/>

<textarea
  @change=${handleChange}
  name="note"
></textarea>

<input
  class="signup-button"
  @click=${(e) => handleSubmit({ e, fields, product })}
  type="submit"
  value="Add to order"
/>`;