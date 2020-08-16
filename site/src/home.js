import { html, nothing } from 'lit-html';
import { setState } from './utils/state';
import { update } from './utils/render';

const fileLabel = (photo) =>
  !photo ? 'Snap a photo' : 'Got it!';

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
            name: file.name,
            src: reader.result
          }
        }
      }));
      update(Home(state));
    }

    reader.readAsDataURL(file);
  }
};

const dpr = window.devicePixelRatio;
const uncapturedState = setState(() => ({
  fields: {}
}));

const Home = ({
  fields: { photo }
} = uncapturedState) => html`

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
              &#128248; ${fileLabel(photo)}
            </a>
            ${!!photo ? html`
              <img class="menu-item-photo" .src=${photo.src} />` : nothing}
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
        <input class="signup-input" placeholder="&#127829; Menu item" type="text" />
        <input class="signup-input" placeholder="&#128178; Price" type="text" />
        <input class="signup-input" placeholder="&#128038; @handle" type="text" />
        <input class="signup-input" placeholder="&#9993; Email" type="text" />
        <input class="signup-button signup-input start-button" type="submit" value="&#129297; Start selling!" />
      </form>
    </div>
  </div>`;

export default Home;