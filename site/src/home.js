import * as Api from './utils/api-client';
import { html, nothing } from 'lit-html';
import { setLocation } from './utils/location';
import { setState } from './utils/state';
import { update } from './utils/render';

const fileLabel = ({ photo }) =>
  !photo ? 'Snap a photo' : 'Got it!';

const handleChange = (e) => {

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
  update(Home(state));
};

const handlePhoto = (e) => {

  if (e.target.files.length > 0) {

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
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
      update(Home(state));
    }

    reader.readAsDataURL(file);
  }
};

const handleSubmit = async (e, fields) => {

  e.preventDefault();
  const start = await Api.start(fields);

  const { error } = start;
  if (error) {
    const state = setState(state => {
      state = {
        ...state,
        fields: {
          ...state.fields
        }
      };

      for (const key in error) {
        state.fields[key] = {
          ...state.fields[key],
          error: error[key]
        };
      }

      return state;
    });
    update(Home(state));
  } else {
    setLocation('/profile');
  }
};

const dpr = window.devicePixelRatio;
const uncapturedState = setState(() => ({ fields: {} }));

const Home = ({ fields } = uncapturedState) => html`

  <div class="landing">
    <picture>
      <!--
        larger max-width may have smaller img width
        because device height
      -->
      <source
        media="(max-width: 280px)"
        sizes="100%"
        srcset="/media/${Math.floor(871 * dpr)}/landing.webp ${dpr}x"
        type="image/webp"
      />
      <source
        media="(max-width: 280px)"
        sizes="100%"
        srcset="/media/${Math.floor(871 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />

      <source
        media="(max-width: 320px)"
        sizes="100%"
        srcset="/media/${Math.floor(845 * dpr)}/landing.webp ${dpr}x"
        type="image/webp"
      />
      <source
        media="(max-width: 320px)"
        sizes="100%"
        srcset="/media/${Math.floor(845 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />
  
      <source
        media="(max-width: 360px)"
        sizes="100%"
        srcset="/media/${Math.floor(925 * dpr)}/landing.webp ${dpr}x"
        type="image/webp"
      />
      <source
        media="(max-width: 360px)"
        sizes="100%"
        srcset="/media/${Math.floor(925 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />

      <source
        media="(max-width: 375px)"
        sizes="100%"
        srcset="/media/${Math.floor(930 * dpr)}/landing.webp ${dpr}x"
        type="image/webp"
      />
      <source
        media="(max-width: 375px)"
        sizes="100%"
        srcset="/media/${Math.floor(930 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />
  
      <source
        media="(max-width: 412px)"
        sizes="100%"
        srcset="/media/${Math.floor(980 * dpr)}/landing.webp ${dpr}x"
        type="image/webp"
      />
      <source
        media="(max-width: 412px)"
        sizes="100%"
        srcset="/media/${Math.floor(980 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />
  
      <source
        media="(max-width: 450px)"
        sizes="100%"
        srcset="/media/${Math.floor(982 * dpr)}/landing.webp ${dpr}x"
        type="image/webp"
      />
      <source
        media="(max-width: 450px)"
        sizes="100%"
        srcset="/media/${Math.floor(982 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />

      <source
        media="(max-width: 768px)"
        sizes="100%"
        srcset="/media/${Math.floor(1500 * dpr)}/landing.webp ${dpr}x"
        type="image/webp"
      />
      <source
        media="(max-width: 768px)"
        sizes="100%"
        srcset="/media/${Math.floor(1500 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />

      <source
        media="(max-width: 1024px)"
        sizes="100%"
        srcset="/media/${Math.floor(2000 * dpr)}/landing.webp ${dpr}x"
        type="image/webp"
      />
      <source
        media="(max-width: 1024px)"
        sizes="100%"
        srcset="/media/${Math.floor(2000 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />

      <source
        media="(max-width: 1440px)"
        sizes="100%"
        srcset="/media/${Math.floor(1440 * dpr)}/landing.webp ${dpr}x"
        type="image/webp"
      />
      <source
        media="(max-width: 1440px)"
        sizes="100%"
        srcset="/media/${Math.floor(1440 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />

      <source
        media="(max-width: 1920px)"
        sizes="100%"
        srcset="/media/${Math.floor(1920 * dpr)}/landing.webp ${dpr}x"
        type="image/webp"
      />
      <source
        media="(max-width: 1920px)"
        sizes="100%"
        srcset="/media/${Math.floor(1920 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />

      <img
        sizes="100%"
        srcset="/media/512/landing.jpg ${dpr}x"
      />
    </picture>

    <div class="headers">
      <h1>Sell your food online - right now. Seriously.</h1>
      <h2>No experience required &#9996; No bullshit!</h2>
    </div>
    <div class="start">
      <form class="signup">
          <label class="file">
            <span class="file-label">Start selling! Share a menu item.</span>
            <a
              class="signup-button snap-photo"
              tabIndex="0"
            >
              &#128248; ${fileLabel(fields)}
            </a>
            ${!!fields.photo ? html`
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
          name="productName"
          placeholder="&#127829; Menu item"
          type="text"
        />
        <input
          class="signup-input"
          @change=${handleChange}
          name="price"
          placeholder="&#128178; Price"
          type="text"
        />
        <input
          class="signup-input"
          @change=${handleChange}
          name="handle"
          placeholder="&#128038; @handle"
          type="text"
        />
        <input
          class="signup-input"
          @change=${handleChange}
          name="email"
          placeholder="&#9993; Email"
          type="text"
        />
        <input
          class="signup-button signup-input start-button"
          @click=${(e) => handleSubmit(e, fields)}
          type="submit"
          value="&#129297; Start selling!"
        />
      </form>
    </div>
  </div>`;

export default Home;