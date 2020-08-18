import Anchor from './utils/anchor';
import { html, nothing } from 'lit-html';
import Image from './elements/image';
import { setState } from './utils/state';
import { update } from './utils/render';

const uncapturedState = setState(() => ({
  fields: {
    gender: {}
  },
  loading: true, // TODO alternatives?
  product: {}
}));

(async () => {

  const result = await fetch('/api/product/1', {
    method: 'GET',
    headers: { accept: 'application/json' }
  });

  const { product } = await result.json();
  const state = setState(state => ({
    ...state,
    fields: {
      ...state.fields,
      gender: {
        ...state.fields.gender,
        value: product.genders[0]
      }
    },
    loading: false,
    product
  }));

  await update(Product(state));
})();

const onGenderChanged = async (e) => {

  const state = setState(state => ({
    ...state,
    fields: {
      ...state.fields,
      gender: {
        ...state.fields.gender,
        value: e.target.value
      }
    }
  }));

  await update(Product(state));
};

// TODO address defaults
const Product = ({

  fields: { gender },
  loading,
  product: { colors, genders, photos, styles, title } } = uncapturedState) => {

  return loading ? nothing : html`

    ${Anchor({ content: 'Edit', href: '/' })}
    <h1>${title}</h1>

    ${Anchor({ content: 'Edit', href: '/' })}
    ${Image(photos[0])}

    ${Anchor({ content: 'Edit', href: '/' })}
    <select @change=${onGenderChanged}>
      ${genders.map(gender => html`<option>${gender}</option>`)}
    </select>

    ${Anchor({ content: 'Edit', href: '/' })}
    <select>
      ${styles[gender.value].map(style => html`<option>${style}</option>`)}
    </select>

    ${Anchor({ content: 'Edit', href: '/' })}
    <select>
      ${colors[gender.value].map(color => html`<option>${color}</option>`)}
    </select>

    ${Anchor({ content: 'Buy', href: '/' })}

    ${Anchor({ content: 'Back home', href: '/' })}`;
};

export default Product;