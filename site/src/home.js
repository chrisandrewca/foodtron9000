import * as Api from './utils/api-client';
import { copyFields, trimFields } from './utils/form';
import { html, nothing } from 'lit-html';
import { setLocation } from './utils/location';
import { setState } from './utils/state';
import { update } from './utils/render';

export const loadState = async () => {

  const state = setState(() => ({
    fields: {},
    showSignup: false
  }));

  await update(Home(state));
};

export const loadEffect = async () => { };

const handleChange = async (e) => {

  const { name, value } = e.target;
  const state = setState(state => ({
    ...state,
    fields: {
      ...state.fields,
      [name]: {
        ...state.fields[name],
        value
      }
    }
  }));
  await update(Home(state));
};

const handlePhoto = async (e) => {

  // TODO error handling when API results in 413 via nginx -- payload too large
  // TODO error handling when reader fails

  if (e.target.files.length > 0) {

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const state = setState(state => ({
        ...state,
        fields: {
          ...state.fields,
          photo: {
            ...state.fields.photo,
            name: file.name,
            src: reader.result,
            value: file
          }
        }
      }));
      await update(Home(state));
    }

    reader.readAsDataURL(file);
  }
};

const handleSubmit = async ({ e, fields }) => {

  e.preventDefault();
  e.target.disabled = true;

  fields = copyFields(fields);
  trimFields(fields);

  // TODO eligible for removal
  // const { handle } = fields;

  // if (handle && handle.value) {

  //   if ('@' === handle.value[0])
  //     handle.value = handle.value.slice(1);

  //   handle.value = handle.value.replace(/ /g, '');
  // }

  const { error } = await Api.start(fields);

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

    await update(Home(state));

    setTimeout(() => alert(state.errorText), 1);

  } else {

    e.target.disabled = false;
    setLocation(`/${fields.handle.value}`);
  }
};

const handleShowSignup = async () => {

  let shouldUpdate = false;
  const state = setState(state => {
    if (!state.showSignup) {
      shouldUpdate = true;
      return ({
        ...state,
        showSignup: true
      });
    } else {
      return state;
    }
  });

  if (shouldUpdate)
    await update(Home(state));
};

const handleSeeDemo = () => {

  setLocation('/chris');
};

const handleNavSignup = async (e) => {

  e.preventDefault();
  await handleShowSignup();
  document.getElementById('signup').scrollIntoView();

  const form = document.getElementById('signup-form-container');
  form.style.background = 'rgba(250, 203, 11, 100)';

  let t = 100;
  const f = () => {
    if (t > 0) {
      t -= 10;
      form.style.background = `rgba(250, 203, 11, ${t * 0.01})`;
      setTimeout(f, 25);
    }
  };

  setTimeout(f, 150);
};

const handleProfitCalculation = (e) => {

  document.getElementById('order-total').innerHTML = `$${e.target.value}`;

  const total = parseInt(e.target.value);
  const byopp_rev = total;
  const stripe_rev = total - ((total * 0.029) + 0.3 + 0.3);

  document.getElementById('byopp-revenue').innerHTML = `$${byopp_rev}`;
  document.getElementById('stripe-revenue').innerHTML = `$${stripe_rev.toFixed(2)}`;
};

const california = 'careers';
const dreamin = ['food', '9000', '@', 'tron'];
const plumbing = ['m', 'lt', ':', 'o', 'ai', 'om', '.c'];
const handleCareers = (e) => {

  e.target.href =
    `${plumbing[0]}${plumbing[4]}${plumbing[1]}${plumbing[3]}${plumbing[2]}` +
    `${california}` +
    `${dreamin[2]}${dreamin[0]}${dreamin[3]}${dreamin[1]}${plumbing[6]}${plumbing[5]}`;
};

const Home = ({ fields, showSignup }) => html`
  <style>
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    body {
      font-family: Verdana;
    }

    h2 {
      letter-spacing: 0.014rem;
      font-weight: 500;
    }

    h3 {
      letter-spacing: 0.014rem;
      font-size: 1.5rem;
      font-weight: 500;
    }

    p {
      line-height: 1.35rem;
    }

    article>div:nth-child(even) {
      display: flex;
      flex-direction: row-reverse;
      flex-wrap: wrap;
    }

    article>div:nth-child(odd) {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }

    article {
      padding: 0 0.8rem;
    }

    article>div>div {
      flex-grow: 1;
    }

    article>div>img {
      flex-grow: 1;
      max-width: 100%;
      min-width: 1%;
      width: 100%;
      height: 100%;
    }

    @media all and (min-width: 953px) {
      header {
        flex-wrap: nowrap;
      }

      article>div:nth-child(even) {
        flex-wrap: nowrap;
      }

      article>div:nth-child(odd) {
        flex-wrap: nowrap;
      }

      article>div>img {
        width: auto;
        height: auto;
      }
    }

    .try-or-sign-up-container {
      padding: 2rem 0;
    }

    .try-or-sign-up {
      padding-bottom: 0.8rem;
      text-align: center;
    }

    /* starting to put in classes, divs for flex */
    .brand-header {
      display: flex;
      flex-wrap: wrap;
      padding-left: 0.8rem;
    }

    @media all and (min-width: 953px) {
      .brand-header {
        align-items: flex-end;
        flex-wrap: nowrap;
      }
    }

    .brand {
      flex-basis: 100%;
      /* preferred width in mobile world */
    }

    @media all and (min-width: 953px) {
      .brand {
        flex-shrink: 1;
        max-width: fit-content;
      }
    }

    .brand>h1 {
      font-family: 'Trebuchet MS';
      font-size: 1.4rem;
      text-align: center;
    }

    .brand>h1>img {
      display: block;
      margin: 0 auto;
      padding: 0.83rem;
      width: 175px;
    }

    .brand-nav {
      flex-basis: 100%;
      /* preferred width in mobile world */
    }

    @media all and (min-width: 953px) {
      .brand-nav {
        margin: 0 4rem;
        max-width: fit-content;
      }
    }

    .brand-nav>nav {
      display: flex;
      justify-content: center;
    }

    .list-nav {
      border: 1px solid rgba(0, 0, 0, .11);
      border-radius: 3px;
      list-style: none;
      padding: 0.8rem;
    }

    .list-nav-item {
      float: left;
    }

    .list-nav-item:not(:last-of-type) {
      margin-right: 1rem;
    }

    .list-nav-item>a {
      font-size: 1rem;
      font-family: Verdana;
      text-decoration: none;
    }

    .list-nav-item>a:link {
      color: #1E1E1E;
    }

    .list-nav-item>a:visited {
      color: #1E1E1E;
    }

    .list-nav-item>a:hover {
      color: #0000FF;
      text-decoration: underline;
    }

    .list-nav-item>a:active {
      color: #0000FF;
    }

    button {
      cursor: pointer;
      font-size: 1rem;
      margin-right: 0.4rem;
      padding: 0.4rem 0.8rem;
    }

    @media all and (min-width: 953px) {
      .signup-form {
        margin: 0 auto;
        max-width: 24rem;
      }
    }

    .signup-form label {
      display: block;
      margin-bottom: 0.8rem;
    }

    .signup-form input {
      width: 100%;
    }

    .signup-form fieldset {
      margin-bottom: 0.8rem;
    }

    .signup-form input[type="submit"] {
      font-size: 1rem;
      padding: 0.4rem 0;
    }

    input {
      font-size: 1rem;
    }

    .pricing {
      flex-grow: 0;
      margin: 0 auto;
    }

    .pricing>h3 {
      text-align: center;
    }

    .profit-calculator>div {
      display: flex;
      justify-content: space-between;
    }

    .profit-calculator>input {
      width: 100%;
    }

    .about-us {
      flex-grow: 0;
      margin: 0 auto;
      text-align: center;
    }

    footer {
      flex-basis: 100%;
      /* preferred width in mobile world */
    }

    @media all and (min-width: 953px) {
      footer {
        margin: 0 auto;
        max-width: fit-content;
      }
    }

    footer>nav {
      display: flex;
      justify-content: center;
    }
  </style>
  <header class="brand-header">
    <div class="brand">
      <h1>
        <img src="/assets/logo.png" />
        The Food-Tron 9000
      </h1>
    </div>
    <div class="brand-nav">
      <nav>
        <ul class="list-nav">
          <li class="list-nav-item"><a href="#pricing">Pricing</a></li>
          <li class="list-nav-item"><a href="/blog">Blog</a></li>
          <li class="list-nav-item">
            <a
              @click=${handleNavSignup}
              href="#signup"
            >
              Sign up
            </a>
          </li>
          <li class="list-nav-item"><a href="/login">Login</a></li>
        </ul>
      </nav>
    </div>
  </header>
  <article>
    <div>
      <div>
        <h2>Digital Menu</h2>
        <p>Start your own digital menu today and begin promoting your food.</p>
        <p>Just bring your menu items name, price, and photo.</p>
      </div>
      <img src="/assets/digital-menu.svg" />
    </div>
    <div>
      <div>
        <h2>No Fees, Cuts, or Percentages</h2>
        <p>That's right! Bring your own payment processor or optionally connect with ours.</p>
      </div>
      <img src="/assets/no-fees.svg" />
    </div>
    <div>
      <div>
        <h2>Grow Kitchen Utilization</h2>
        <p>Additional sales channels help increase your revenue.</p>
        <p>Farm House Cafe increased their sales by $3247.11/month on average.</p>
      </div>
      <img src="/assets/grow-kitchen-usage.svg" />
    </div>
    <div>
      <div>
        <h2>Order Notifications</h2>
        <p>Receive emails when customers place orders.</p>
      </div>
      <img src="/assets/notifications.svg" />
    </div>
    <div>
      <div>
        <h2>Order Pickup</h2>
        <p>Instantly add local pickup to your restaurant.</p>
        <p>Delivery will be available soon for a monthly fee.</p>
      </div>
      <img src="/assets/moped-delivery.svg" />
    </div>
    <div>
      <div>
        <h2>Customer Receipts</h2>
        <p>Automatically share receipts with your customers.</p>
      </div>
      <img src="/assets/receipts.svg" />
    </div>
    <div>
      <div>
        <h2>Human Support</h2>
        <p>The Food-Tron 9000 is a digital waiter who understands your restaurant.</p>
        <p>And its creators have your back.</p>
      </div>
      <img src="/assets/human-support.svg" />
    </div>
    <div>
      <div class="try-or-sign-up-container">
        <div class="try-or-sign-up">
          <h3 id="signup">Start Selling in <u>2 Minutes</u></h3>
          <button @click=${handleShowSignup}>Sign up</button>
          <button @click=${handleSeeDemo}>See demo</button>
        </div>
        ${showSignup ? html`
        <div id="signup-form-container">
          <form class="signup-form">
            <fieldset>
              <legend>Menu Item</legend>
              <label>
                Photo
                <input
                  accept="image/*"
                  @change="${handlePhoto}"
                  type="file"
                />
              </label>
              <label>
                Name
                <input
                  @change=${handleChange}
                  name="name"
                  type="text"
                />
              </label>
              <label>
                Price
                <input
                  @change=${handleChange}
                  inputmode="decimal"
                  name="price"
                  type="number"
                />
              </label>
            </fieldset>
            <label>
              Profile Name
              <input
                @change=${handleChange}
                name="handle"
                type="text"
                placeholder="https://foodtron9000.com/&lt;your profile name&gt;"
              />
            </label>
            <label>
              Email
              <input
                @change=${handleChange}
                name="email"
                type="text"
              />
            </label>
            <input
              @click=${(e) => handleSubmit({ e, fields })}
              type="submit" 
              value="Sign up"
            />
          </form>
        </div>`: nothing}
      </div>
    </div>
    <div>
      <div id="pricing" class="pricing">
        <h3>Pricing</h3><!-- anchor scroll -->
        <h4>BYOPP</h4>
        <p>Bring your own payment processor - free!</p>
        <h4>Collect payments with Stripe (optional)</h4>
        <p>Connect with our payment processor in less than 10 minutes.</p>
        <ul>
          <li>We charge your customers a .30c convenience fee</li>
          <li>Stripe collects 2.9% + .30c per transaction to</li>
        </ul>
        <h4>Revenue Calculator</h4>
        <div class="profit-calculator">
          <div>
            <p>$1</p>
            <p>Order total: <span id="order-total">$16</span></p>
            <p>$100</p>
          </div>
          <input
            @change=${handleProfitCalculation}
            max="100"
            min="1"
            type="range"
            value="16"
          />
          <div>
            <div></div>
            <div>
              <p>w/ BYOPP revenue: <span id="byopp-revenue">$16</span></p>
              <p>w/ Stripe revenue: <span id="stripe-revenue">$14.94</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div id="about-us" class="about-us">
        <h3>About Us</h3><!-- anchor scroll -->
        <p>We're the little guy bringing you the best in market value.</p>
        <p>And we're as reliable as the big guys - because we're built on top of their work.</p>
        <p>Let's stand together on the shoulders of giants.</p>
      </div>
    </div>
  </article>
  <footer>
    <nav>
      <ul class="list-nav">
        <li class="list-nav-item"><a @click=${handleCareers} href="#">Careers</a></li>
        <li class="list-nav-item"><a href="/terms">Terms</a></li>
        <li class="list-nav-item">© 2020, The Food-Tron 9000</li>
      </ul>
    </nav>
  </footer>`;