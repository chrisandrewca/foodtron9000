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
    profile: {
      fields: {
        description: { value: '' }
      },
      products: [],
      user: {}
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

  // warning: flow is as:
    // 1. undefined in backend / true in frontend - results in Test checkout with Stripe
    // 2. undefined in backend / sign up for stripe / set to true (via auth grant)
    // 3. undefined in backend / true in frontend until user unchecks / set to false
  if (profile.user.stripeCheckout === undefined) {
    profile.user.stripeCheckout = true;
  }

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

const handleEnableStripeCheckout = async ({ e, handle }) => {

  e.target.disabled = true;

  await Api.setProfileFeature({ handle, stripeCheckout: e.target.checked });
  // TODO error handling

  const profile = await Api.getProfile(handle);
  // TODO error handling

  const state = setState(state => ({
    ...state,
    profile: {
      ...state.profile,
      ...profile
    }
  }));

  e.target.disabled = false;
  await update(ManageProfile(state));
}

const ManageProfile = ({ handle, profile, stripeAuthorization }) => html`

<style type="text/css">
  /*
  * Resets and initial definitions
  */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  body, html {
    background: #fafafa;
    font-family: system-ui, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 1vw;
    font-weight: 400;
    height: 100%;
    margin: 0;
    overflow-y: scroll;
    padding: 0;
    text-rendering: optimizeLegibility;
    width: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    -webkit-overflow-scrolling: touch;
  }

  body {
    /* Sets overflowing background color when scrolled past the page in
      MacOS or in iOS. */
    background: #fafafa;
    position: relative;
    z-index: -36;
  }

  a, input, label, textarea {
    appearance: none;
    font-family: system-ui, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    font-size: 1vw;
    font-weight: 400;
    margin: 0;
    padding: 0;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  /* TODO re-weight on 16px and use rem over vh/vw, CSS optimizations, consolidation, etc */
  .checkbox {
    background-color: white;
    border: 1px solid #262626;
    border-radius: 3px;
    height: 16px;
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    margin: 3px 8px 0 0;
  }

  .checkbox:focus {
    outline-color: #3b3b3b;
  }

  .checkbox:checked::before {
    color: green;
    content: "\\2713";
    display: inline-block;
    font-size: 16px;
    font-weight: 800;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
  }

  /* img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  } */


  /*
  * Landing page
  */
  .landing {
    position: relative;
    height: 100%;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  /*
  * Landing page headers
  */
  .headers {
    align-items: flex-end;
    display: flex;
    flex-direction: column;
  }

  .headers > h1,
  .headers > h2 {
    background: white;
    box-shadow: 0 2px 1px rgba(0,0,0,0.09), 
                0 4px 2px rgba(0,0,0,0.09), 
                0 8px 4px rgba(0,0,0,0.09), 
                0 16px 8px rgba(0,0,0,0.09),
                0 32px 16px rgba(0,0,0,0.09);
    color: black;
    display: inline-block;
    font-size: 4.5vw;
    margin-block-end: 0.7vh;
    margin-block-start: 0.7vh;
    padding: 1vw 2vw;
  }

  .headers > h2 {
    font-size: 3.75vw;
  }

  video {
    border-right: 1px solid black;
    border: 2px solid black;
    left: 0;
    margin: 0 auto;
    padding: 0;
    position: absolute;
    right: 0;
    top: 12vh;
    width: 90vw;
  }

  /*
  * Landing start + signup form
  */
  .start {
    background: white;
    border-radius: 3px;
    box-shadow: 0 2px 1px rgba(0,0,0,0.09), 
                0 4px 2px rgba(0,0,0,0.09), 
                0 8px 4px rgba(0,0,0,0.09), 
                0 16px 8px rgba(0,0,0,0.09),
                0 32px 16px rgba(0,0,0,0.09);
    margin: 34vh 2vw 0vh 2vw;
    padding: 1.4vh 3vw;
  }

  .signup > input, 
  .signup > label,
  .signup > textarea {
    font-size: 16px; /* relative? */
    width: 100%;
  }

  .signup-input {
    border: 1px solid #dbdbdb;
    border-radius: 3px;
    margin: 0.4vh 0;
    padding: 1vh 1vw;
  }

  /*
    order matters for border: none;
    define .signup-button after .signup-input
  */
  .signup-button {
    background: #ed4dc6;
    border: none;
    border-radius: 3px;
    box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    color: #fff;
    cursor: pointer;
    letter-spacing: .025em;
    text-transform: uppercase;
  }

  /* TODO hover for desktop needs a different animation
    one that pauses on the down portion
  */
  .signup-button:hover {
    animation: button-tap 0.2s ease-in-out;
  }

  /*
    order matters for tap animation
    define :active after :hover
  */
  .signup-button:active {
    animation: none;
  }

  @keyframes button-tap {
    50% {
      transform: translateY(1px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  .file span {
    display: block;
    text-align: center;
  }

  .file-label {
    margin: 0 0 0.4vh 0;
    word-spacing: 0.2vw;
  }

  .snap-photo {
    display: inline-block;
    font-size: 16px;
    margin: 0.8vh 0;
    padding: 0.8vh 0;
    text-align: center;
    width: 100%;
  }

  .snap-photo:focus {
    outline: none; /* TODO needed? */
  }

  .menu-item-photo {
    background: white;
    border: 4px solid white;
    border-radius: 8px;
    box-shadow: 0 1px 1px rgba(0,0,0,0.08), 
                0 2px 2px rgba(0,0,0,0.12), 
                0 4px 4px rgba(0,0,0,0.16), 
                0 8px 8px rgba(0,0,0,0.20);
    left: 0;
    margin: 0 auto;
    max-height: 30vh;
    object-fit: cover;
    padding: 0;
    position: absolute;
    right: 0;
    top: 12vh;
  }

  .file a img {
    display: block;
    margin: 0 auto;
    max-height: 400px;
    max-width: 100%;
    padding-top: 0.7rem;
  }

  .file-input {
    margin: -100vh 0 0 0;
    opacity: 0;
    position: absolute;
    padding: 0;
    right: 0;
    top: 0;
    z-index: 0;
  }

  .start-button {
    font-weight: 600;
  }

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
  }

  a, label, input, textarea {
    font-size: 16px;
  }

  section {
    margin: 0 0 4vh 0;
  }

  form {
    padding: 2vh 0 0 0;
  }

  input, label, textarea {
    display: block;
    margin: 0 0 3vh 0;
    width: 100%;
  }

  textarea {
    border: 0.1rem solid #999;
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
  <h1>Welcome, ${handle}!</h1>
  <p>
    Thanks for trying out the Food-Tron 9000. We're actively adding new features.
    If you have any questions or feedback
    <a href='mailto:chris@foodtron9000.com?subject=Hey%20Food-Tron 9000...'>
      please reach out!</a>
  </p>
</header>

<main>
<section>
<h2>Manage Profile</h2>
<form>
  <label>
    Photo
    <input
      @change=${handleProfilePhoto}
      name="photo",
      type="file"
    />
  </label>

  <label>
    Description
    <textarea
      @change=${handleProfileChange}
      name="description"
      rows="4"
      .value=${profile.fields.description.value}
    ></textarea>
  </label>

  <input
    class="signup-button insta-button"
    @click=${(e) => handleProfileSubmit({ e, fields: profile.fields, handle })}
    type="submit"
    value="Save"
  />
</form>
</section>

<section>
<h2>Manage Menu</h2>
<ul>
  ${profile.products.map(({ id, name }) => html`
    <li>
      <a .href=${`/manage-product?handle=${handle}&id=${id}`}>
        ${name}
      </a>
    </li>`)}
</ul>
<a .href=${`/manage-product?handle=${handle}`}>Add menu item</a>
</section>

<section>
<h2>Collect Payments</h2>
  <form>
    <label>
      <input
        .checked=${profile.user.stripeCheckout}
        class='checkbox'
        @click=${(e) => handleEnableStripeCheckout({ e, handle })}
        name="enable-stripe-checkout"
        type="checkbox">
      Enable Stripe checkout
    </label>
  </form>
  ${profile.user.stripeCheckout ?
    stripeAuthorization.url
      ? html`
        <p>
          <a .href=${stripeAuthorization.url}>Create a Stripe account to get paid.</a>
          Payments will be deposited into your bank account.
        </p>
        <p>
          The Food-Tron 9000 collects .30c on each order. Our payment processor Stripe collects 2.9%. <!--Tap here to calculate your profits.-->
        </p>`
      : html`
        <p>
          Welcome aboard! 🚀 Check your <a href="https://dashboard.stripe.com/" target="_blank">Stripe</a> account to see your collected payments.
        </p>`
    : nothing}
</section>
</main>
</div>`;