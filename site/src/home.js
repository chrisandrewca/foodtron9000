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

    <h1>hello</h1>
    ${Anchor({ content: 'Buy my T-Shirt', href: '/product' })}
  </div>`;

export default Home;