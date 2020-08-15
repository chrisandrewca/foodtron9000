import Anchor from './utils/anchor';
import { html } from 'lit-html';

const dpr = window.devicePixelRatio;

const Home = () => html`

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
      <h2>No experience required 	&#128076; No bullshit!</h2>
    </div>
    <div class="start">
      <form class="signup">
          <label class="file">
            <span>Lets get selling! Share a menu item.</span>
              <a class="button" tabIndex="0">
                Snap a photo
              </a>
            <span>
              <input accept="image/*" type="file" tabIndex="-1" />
            </span>
          </label>
        <input placeholder="Menu item" type="text" />
        <input placeholder="Price" type="text" />
        <input placeholder="@handle" type="text" />
        <input placeholder="Email" type="text" />
        <input class="button" type="submit" value="Start selling!" />
      </form>
    </div>
  </div>`;

export default Home;