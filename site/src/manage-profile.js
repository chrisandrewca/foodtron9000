import * as Api from './utils/api-client';
import { copyFields, trimFields } from './utils/form';
import { html } from 'lit-html';
import { getSearchParams, setLocation } from './utils/location';
import { setState } from './utils/state';
import { update } from './utils/render';

export const loadState = async () => {

  const params = getSearchParams();
  if (!params.has('handle')) {
    setLocation('/');
  }

  const state = setState(() => ({
    profile: {
      fields: {
        description: { value: '' }
      },
      products: []
    },
    handle: params.get('handle'),
    stripeAuthorization: {}
  }));

  await update(ManageProfile(state));
};

export const loadEffect = async () => {

  // TODO better error handling
  const handle = getSearchParams().get('handle');
  const profile = await Api.getProfile(handle);
  const stripeAuthorization = await Api.getStripeAuthorization();

  const state = setState(state => ({
    ...state,
    profile: {
      ...state.profile,
      fields: {
        ...state.profile.fields,
        description: {
          ...state.profile.description,
          value: profile.user.description
        }
      },
      ...profile
    },
    stripeAuthorization
  }));

  await update(ManageProfile(state));
};

const handleProfileChange = async (e) => {

  const { name, value } = e.target;

  const state = setState(state => ({
    ...state,
    profile: {
      ...state.profile,
      fields: {
        ...state.profile.fields,
        [name]: {
          ...state.profile.fields[name],
          value
        }
      }
    }
  }));

  await update(ManageProfile(state));
};

const handleProfilePhoto = async (e) => {

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

  const imageCount = Math.min(images.length, 1);
  for (let i = 0; i < imageCount; i++) {
    const image = images[i];
    files.push(image.file);
    sources.push(image.result);
  }

  const state = setState(state => ({
    ...state,
    profile: {
      ...state.profile,
      fields: {
        ...state.profile.fields,
        photos: {
          ...state.profile.fields.photo,
          srcs: sources,
          value: files
        }
      }
    }
  }));

  await update(ManageProfile(state));
};

const handleProfileSubmit = async ({ e, fields, handle }) => {

  e.preventDefault();
  e.target.disabled = false;

  fields = copyFields(fields);
  trimFields(fields);

  const { error } = await Api.setProfile({ fields, handle });

  if (error) {

    const state = setState(state => {

      const { errorText, fields } = Api.getFieldsFromError({
        error,
        fields: copyFields(state.profile.fields)
      });

      return {
        ...state,
        profile: {
          ...state.profile,
          errorText,
          fields
        }
      };
    });

    e.target.disabled = false;

    await update(ManageProfile(state));

    setTimeout(() => alert(state.profile.errorText), 1);

  } else {

    e.target.disabled = false;

    setLocation(`/${handle}`);
  }
};

const ManageProfile = ({ handle, profile, stripeAuthorization }) => html`

<header>
  <h1>Welcome, ${handle}!</h1>
  <p>
    Thanks for trying out the Food-Tron 9000. We're actively adding new features.
    If you have any feedback or questions
    <a href='mailto:chris@foodtron9000.com?subject=Hey%20Food-Tron 9000...'>
      do not hesitate to reach out
    </a>!
  </p>
</header>

<main>

<h2>Manage profile</h2>
<form>
  <input
    @change=${handleProfilePhoto}
    name="photo",
    type="file"
  />

  <label>
    Description
    <textarea
      @change=${handleProfileChange}
      name="description",
      .value=${profile.fields.description.value}
    ></textarea>
  </label>

  <input
    @click=${(e) => handleProfileSubmit({ e, fields: profile.fields, handle })}
    type="submit"
    value="Save"
  />
</form>

<h2>Manage menu</h2>
<ul>
  ${profile.products.map(({ id, name }) => html`
    <li>
      <a .href=${`/manage-product?handle=${handle}&id=${id}`}>
        ${name}
      </a>
    </li>`)}
</ul>
<a .href=${`/manage-product?handle=${handle}`}>Add menu item</a>

<h2>Collect payments</h2>
<p>Payment structure text...</p>
${stripeAuthorization.url
    ? html`
  <p>
    <a .href=${stripeAuthorization.url}>Create a Stripe account to get paid.</a>
    Payments will be depositable into bank account. You'll need things like: x, y, z.
  </p>`
    : html`
  <p>
    Congratulations! Payments will be deposited directly into your Stripe account. 
    Click here to deposit payments into your bank account.
  </p>`}

</main>`;