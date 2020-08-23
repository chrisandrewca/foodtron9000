import * as Api from './utils/api-client';
import { html, nothing } from 'lit-html';
import { setLocation } from './utils/location';
import { setState } from './utils/state';
import { update } from './utils/render';

export const loadState = async () => {

  const dpr = window.devicePixelRatio;
  const state = setState(() => ({ dpr, fields: {} }));

  await update(Home(state));
};

export const loadEffect = async () => { };

const fileLabel = ({ photo }) =>
  !photo ? 'Snap a photo' : 'Got it!';

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

  const handle = { ...fields.handle };
  if (handle && handle.value) {

    if ('@' === handle[0])
      handle.value = handle.value.slice(1);

    handle.value = handle.value.replace(/ /g, '');
  }

  fields = {
    ...fields,
    handle
  };

  for (const key in fields) {

    const { value } = fields[key];

    if ('string' === typeof value) {
      fields[key].value = value.trim();
    }
  }

  const start = await Api.start(fields);
  const { error } = start;

  if (error) {

    const state = setState(state => {

      const { errorText, fields } = Api.getFieldsFromError({ error, fields: state.fields });

      return {
        ...state,
        errorText,
        fields
      };
    });

    await update(Home(state));
    setTimeout(() => alert(state.errorText), 1);

  } else {
    setLocation(`/${fields.handle.value}`);
  }
};

const Home = ({ dpr, fields }) => html`

  <div class="landing">
    <picture>
      <!--
        larger max-width may have smaller img width
        because device height
      -->
      <source
        media="(max-width: 280px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(871 * dpr)}/landing.webp ${dpr}x`}
        type="image/webp"
      />
      <source
        media="(max-width: 280px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(871 * dpr)}/landing.jpg ${dpr}x`}
        type="image/jpeg"
      />

      <source
        media="(max-width: 320px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(845 * dpr)}/landing.webp ${dpr}x`}
        type="image/webp"
      />
      <source
        media="(max-width: 320px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(845 * dpr)}/landing.jpg ${dpr}x`}
        type="image/jpeg"
      />
  
      <source
        media="(max-width: 360px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(925 * dpr)}/landing.webp ${dpr}x`}
        type="image/webp"
      />
      <source
        media="(max-width: 360px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(925 * dpr)}/landing.jpg ${dpr}x`}
        type="image/jpeg"
      />

      <source
        media="(max-width: 375px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(930 * dpr)}/landing.webp ${dpr}x`}
        type="image/webp"
      />
      <source
        media="(max-width: 375px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(930 * dpr)}/landing.jpg ${dpr}x`}
        type="image/jpeg"
      />
  
      <source
        media="(max-width: 412px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(980 * dpr)}/landing.webp ${dpr}x`}
        type="image/webp"
      />
      <source
        media="(max-width: 412px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(980 * dpr)}/landing.jpg ${dpr}x`}
        type="image/jpeg"
      />
  
      <source
        media="(max-width: 450px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(982 * dpr)}/landing.webp ${dpr}x`}
        type="image/webp"
      />
      <source
        media="(max-width: 450px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(982 * dpr)}/landing.jpg ${dpr}x`}
        type="image/jpeg"
      />

      <source
        media="(max-width: 768px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(1500 * dpr)}/landing.webp ${dpr}x`}
        type="image/webp"
      />
      <source
        media="(max-width: 768px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(1500 * dpr)}/landing.jpg ${dpr}x`}
        type="image/jpeg"
      />

      <source
        media="(max-width: 1024px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(2000 * dpr)}/landing.webp ${dpr}x`}
        type="image/webp"
      />
      <source
        media="(max-width: 1024px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(2000 * dpr)}/landing.jpg ${dpr}x`}
        type="image/jpeg"
      />

      <source
        media="(max-width: 1440px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(1440 * dpr)}/landing.webp ${dpr}x`}
        type="image/webp"
      />
      <source
        media="(max-width: 1440px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(1440 * dpr)}/landing.jpg ${dpr}x`}
        type="image/jpeg"
      />

      <source
        media="(max-width: 1920px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(1920 * dpr)}/landing.webp ${dpr}x`}
        type="image/webp"
      />
      <source
        media="(max-width: 1920px)"
        sizes="100%"
        .srcset=${`/assets/${Math.floor(1920 * dpr)}/landing.jpg ${dpr}x`}
        type="image/jpeg"
      />

      <img
        sizes="100%"
        .srcset=${`/assets/512/landing.jpg ${dpr}x`}
      />
    </picture>

    <div class="headers">
      <h1>Sell your food to everyone, anywhere 🌎</h1>
      <h2>Instantly at your fingertips ✌</h2>
    </div>
    <div class="start">
      <form class="signup">
          <label class="file">
            <span class="file-label">Start selling! Share a menu item.</span>
            <a
              class="signup-button snap-photo"
              tabIndex="0"
            >
              📸 ${fileLabel(fields)}
            </a>
            ${fields.photo && fields.photo.src ? html`
              <img class="menu-item-photo" .src=${fields.photo.src} />` : nothing}
            <span>
              <input
                accept="image/*"
                @change=${handlePhoto}
                class="file-input"
                tabIndex="-1"
                type="file"
              />
            </span>
          </label>
        <input
          class="signup-input"
          @change=${handleChange}
          name="name"
          placeholder="🍕 Menu item"
          type="text"
        />
        <input
          class="signup-input"
          @change=${handleChange}
          name="price"
          inputmode='decimal'
          placeholder="💲 Price"
          type="number"
        />
        <input
          class="signup-input"
          @change=${handleChange}
          name="handle"
          placeholder="🐤 @handle"
          type="text"
        />
        <input
          class="signup-input"
          @change=${handleChange}
          name="email"
          placeholder="📧 Email"
          type="text"
        />
        <input
          class="signup-button signup-input start-button"
          @click=${(e) => handleSubmit({ e, fields })}
          type="submit"
          value="🚀 Start selling!"
        />
      </form>
    </div>
  </div>`;

export default Home;