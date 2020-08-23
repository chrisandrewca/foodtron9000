import * as Api from './utils/api-client';
import Anchor from './elements/anchor';
import { getSearchParams, setLocation } from './utils/location';
import { html, nothing } from 'lit-html';
import { setState } from './utils/state';
import { update } from './utils/render';

export const loadState = async () => {

  const state = setState(() => ({
    content: ProfileLoader(),
    // for 0 items / Place Order bar, so we can load as much as the page as we can for a snappy response
    order: { products: [] },
    // for profile image
    profile: { user: { photo: {} } }
  }));

  await update(Profile(state));
};

export const loadEffect = async () => {

  const handle = window.location.pathname.split('/').pop();
  const params = getSearchParams();

  const authenticated = await Api.isAuthenticated();
  // warning: scheme set in app.js https://<domain>/handle
  const profile = await Api.getProfile(handle);

  if (profile.error.code === 'handle') {
    setLocation('/');
  }

  let state;
  if (!params.has('session_id')) {

    // TODO error handling
    const order = await Api.getOrder();

    state = setState(state => ({
      ...state,
      authenticated,
      content: ProfileGallery(profile),
      handle,
      order,
      profile
    }));

  } else {

    const sessionId = params.get('session_id');

    const receipt = await Api.getReceipt({ handle, sessionId });

    // TODO plenty of duplication
    // TODO error handling
    const order = await Api.getOrder(sessionId);

    state = setState(state => ({
      ...state,
      authenticated,
      content: ProfileThankYou({ handle, receipt }),
      handle,
      order,
      profile
    }));
  }

  await update(Profile(state));
};

const handleBuy = async ({ e, handle }) => {

  e.preventDefault();

  const buy = await Api.buy({ handle });

  const script = document.createElement('script');
  script.onload = async () => {

    const stripe = Stripe(import.meta.env.SNOWPACK_PUBLIC_STRIPE_PUBLIC, {
      stripeAccount: buy.stripe.stripeAccount
    });

    // TODO error handling with result
    await stripe.redirectToCheckout({
      sessionId: buy.stripe.sessionId
    });
  };

  script.src = import.meta.env.SNOWPACK_PUBLIC_STRIPE_API;
  document.head.appendChild(script);
};

const ProfileLoader = () => html`<div class="loader"></div>`;

const ProfileGallery = ({ products }) => html`

<div class="gallery">
  ${products.map(({ id, photos: [photo] }) => html`
    <div class="gallery-item" tabindex="0">
      ${Anchor(
  {
    content: html`
        <!-- TODO various media photos size, webp, jpeg -->
        <picture>
          <source
            media="(min-width: 0px)"
            sizes="100%"
            .srcset=${`/media/1080/${photo.filename}.webp`}
            type="image/webp" />

          <source
            media="(min-width: 0px)"
            sizes="100%"
            .srcset=${`/media/1080/${photo.filename}.jpeg`}
            type="image/jpeg" />

          <!-- product name in alt text -->
          <img
            alt=""
            class="gallery-image"'
            sizes="100%"
            .srcset=${`/media/1080/${photo.filename}.jpeg`}
          />
        </picture>`, href: `/profile-product?id=${id}`
  })}
    </div>`)}
</div>`;

const ProfileThankYou = ({ handle, receipt: { receiptUrl } }) => html`

<div class="gallery">
  <h2>Thank you for your purchase</h2>
  <p>Your order will be ready in about 15 minutes.</p>
  <p><a .href=${receiptUrl}>Tap here to view your receipt.</a></p>
  <p><a .href=${`/${handle}`}>Continue shopping</a></p>
</div>`;

const Profile = ({ authenticated, content, handle, order, profile: { user } }) => html`

<style type="text/css">
  :root {
    font-size: 10px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    min-height: 100vh;
    background-color: #fafafa;
    color: #262626;
    padding-bottom: 3rem;
  }

  img {
      display: block;
  }

  .container {
    max-width: 93.5rem;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .btn {
    display: inline-block;
    font: inherit;
    background: none;
    border: none;
    color: inherit;
    padding: 0;
    cursor: pointer;
  }

  .btn:focus {
    outline: 0.5rem auto #4d90fe;
  }

  .visually-hidden {
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
  }

  /* Profile Section */

  .profile {
    padding: 5rem 0;
  }

  .profile::after {
    content: "";
    display: block;
    clear: both;
  }

  .profile-image {
    float: left;
    width: calc(33.333% - 1rem);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 3rem;
  }

  .profile-image img {
    border-radius: 50%;
  }

  .profile-user-settings,
  .profile-stats,
  .profile-bio {
    float: left;
    width: calc(66.666% - 2rem);
  }

  .profile-user-settings {
    margin-top: 1.1rem;
  }

  .store-sign {
    background: white;
    border-radius: 3px;
    font-size: 1.6rem;
    font-weight: 600;
    letter-spacing: 0.05rem;
    text-transform: uppercase;
  }

  .store-sign > p {
    margin: 0;
    padding: 0.6rem;
  }

  .sign-open {
    border: 1px solid red;
    color: red;
  }

  .sign-closed {
    border: 1px solid black;
    color: black;
  }

  .profile-user-name {
    font-size: 3.2rem;
    font-weight: 300;
    overflow-wrap: break-word;
    text-align: center;
  }

  .profile-edit-btn {
    font-size: 1.4rem;
    line-height: 1.8;
    border: 0.1rem solid #dbdbdb;
    border-radius: 0.3rem;
    padding: 0 2.4rem;
    margin-left: 2rem;
  }

  .profile-settings-btn {
    font-size: 2rem;
    margin-left: 1rem;
  }

  .profile-stats {
    margin-top: 2.3rem;
  }

  .profile-stats li {
    display: inline-block;
    font-size: 1.6rem;
    line-height: 1.5;
    margin-right: 4rem;
    cursor: pointer;
  }

  .profile-stats li:last-of-type {
    margin-right: 0;
  }

  .profile-bio {
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 1.5;
    margin-top: 2.3rem;
  }

  .profile-real-name,
  .profile-stat-count,
  .profile-edit-btn {
    font-weight: 600;
  }

  /* Gallery Section */

  .gallery {
    display: flex;
    flex-wrap: wrap;
    margin: -1rem -1rem;
    padding-bottom: 3rem;
  }

  .gallery-item {
    position: relative;
    flex: 1 0 22rem;
    margin: 1rem;
    color: #fff;
    cursor: pointer;
  }

  .gallery-item:hover .gallery-item-info,
  .gallery-item:focus .gallery-item-info {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .gallery-item-info {
    display: none;
  }

  .gallery-item-info li {
    display: inline-block;
    font-size: 1.7rem;
    font-weight: 600;
  }

  .gallery-item-likes {
    margin-right: 2.2rem;
  }

  .gallery-item-type {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2.5rem;
    text-shadow: 0.2rem 0.2rem 0.2rem rgba(0, 0, 0, 0.1);
  }

  .fa-clone,
  .fa-comment {
    transform: rotateY(180deg);
  }

  .gallery-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Loader */

  .loader {
    width: 5rem;
    height: 5rem;
    border: 0.6rem solid #999;
    border-bottom-color: transparent;
    border-radius: 50%;
    margin: 0 auto;
    animation: loader 500ms linear infinite;
  }

  /* Media Query */

  @media screen and (max-width: 40rem) {
    .profile {
      display: flex;
      flex-wrap: wrap;
      padding: 1rem 0 4rem 0;
    }

    .profile::after {
      display: none;
    }

    .profile-image,
    .profile-user-settings,
    .profile-bio,
    .profile-stats {
      float: none;
      width: auto;
    }

    .profile-image img {
      width: 7.7rem;
    }

    .profile-user-settings {
      flex-basis: calc(100% - 10.7rem);
      display: flex;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .profile-user-name {
      font-size: 2.2rem;
    }

    .profile-edit-btn {
      order: 1;
      padding: 0;
      text-align: center;
      margin-top: 1rem;
    }

    .profile-edit-btn {
      margin-left: 0;
    }

    .profile-bio {
      font-size: 1.4rem;
      margin-top: 1.5rem;
    }

    .profile-edit-btn,
    .profile-bio,
    .profile-stats {
      flex-basis: 100%;
    }

    .profile-stats {
      align-items:center;
      display: flex;
      justify-content: center;
      order: 1;
      text-align: center;
    }

    .item-count {
      align-items: center;
      display: inline-block;
      border-bottom: 0.1rem solid #dbdbdb;
      justify-content: center;
      text-align: center;
      width: auto;
    }

    .item-count > p {
      font-size: 1.2rem;
      font-weight: 400;
      margin: 0;
      padding: 0 1.2rem 0.6rem 1.2rem;
      text-transform: uppercase;
    }

    .item-count > p > span {
      display: block;
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 0.4rem 0;
    }

    .place-order {
      border: 0.1rem solid #dbdbdb;
      border-radius: 3px;
      box-shadow: none;
      background: white;
      color: #262626;
      font-size: 2rem;
      font-weight: 400;
      padding: 0.4rem 1.2rem;
      margin: 0 0 0 2rem;
      text-transform: none;
    }

    .profile-stats ul {
      display: flex;
      text-align: center;
      padding: 1.2rem 0;
      border-top: 0.1rem solid #dadada;
      border-bottom: 0.1rem solid #dadada;
    }

    .profile-stats li {
      font-size: 1.4rem;
      flex: 1;
      margin: 0;
    }

    .profile-stat-count {
      display: block;
    }
  }

  /* Spinner Animation */

  @keyframes loader {
    to {
      transform: rotate(360deg);
    }
  }

  /*
  The following code will only run if your browser supports CSS grid.
  Remove or comment-out the code block below to see how the browser will fall-back to flexbox & floated styling.
  */

  @supports (display: grid) {
    .profile {
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-template-rows: repeat(3, auto);
      grid-column-gap: 3rem;
      align-items: center;
    }

    .profile-image {
      grid-row: 1 / -1;
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(22vw, 1fr));
      grid-gap: 1vw;
    }

    .profile-image,
    .profile-user-settings,
    .profile-stats,
    .profile-bio,
    .gallery-item,
    .gallery {
      width: auto;
      margin: 0;
    }

    @media (max-width: 40rem) {
      .profile {
        grid-template-columns: auto 1fr;
        grid-row-gap: 0rem;
      }

      .profile-image {
        grid-row: 1 / 2;
      }

      .profile-user-settings {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap: 1rem;
      }

      .profile-edit-btn,
      .profile-stats,
      .profile-bio {
        grid-column: 1 / -1;
      }

      .profile-user-settings,
      .profile-edit-btn,
      .profile-settings-btn,
      .profile-bio,
      .profile-stats {
        margin: 0;
      }
    }
  }
</style>

<header>
<h1 class="profile-user-name">${handle}</h1>
<div class="container">

  <div class="profile">

    <div class="profile-image">
      ${authenticated ? html`
        <a href=${`/manage-profile?handle=${handle}`}>Edit profile</a>
        <a href='mailto:chris@foodtron9000.com?subject=Hey%20Food-Tron 9000...'>Support</a>` : nothing}
  <!-- TODO better mechanism for defaults -->
  <!-- TODO webp/jpeg -->
  ${user.photo.filename !== 'chrisandrewca'
    ? html`<img src="/media/256/${user.photo.filename}.jpeg" alt="">`
    : html`<img src="/assets/256/${user.photo.filename}.jpeg" alt="">`}
    </div>

    <div class="profile-user-settings">
      <!-- <div class="store-sign sign-open">
        <p>Open</p>
      </div> -->
    </div>

    <div class="profile-stats">
      <div class="item-count">
        <p><span>${order.products.length}</span>Items</p>
      </div>
      <form>
        <input
          class="place-order signup-button"
          @click=${(e) => handleBuy({ e, handle })}
          type="submit"
          value="Place Order"
        />
      </form>
    </div>

    <div class="profile-bio">
      <p><span class="profile-real-name">${handle}</span> ${user.description}</p>
    </div>

  </div>
  <!-- End of profile section -->
</div>
<!-- End of container -->
</header>
<main>
<div class="container">
  ${content}
</div>
</main>`;