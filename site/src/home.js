import Anchor from './utils/anchor';
import { html } from 'lit-html';

console.log(window.devicePixelRatio);

const dpr = window.devicePixelRatio;
const w = window.screen.width;
console.log({ dpr, s: `/media/${1083 * dpr}/landing.jpg ${dpr}x` });
console.log({ w: window.screen.width });

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
        srcset="/media/${Math.floor(871 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
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
        srcset="/media/${Math.floor(925 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
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
        srcset="/media/${Math.floor(980 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
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
        srcset="/media/${Math.floor(1500 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />
      <source
        media="(max-width: 1024px)"
        sizes="100%"
        srcset="/media/${Math.floor(2000 * dpr)}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />
      <img src="/media/100/landing.jpg" />
    </picture>
    <h1>hello</h1>
    ${Anchor({ content: 'Buy my T-Shirt', href: '/product' })}
  </div>`;

export default Home;