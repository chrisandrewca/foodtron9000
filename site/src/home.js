import Anchor from './utils/anchor';
import { html } from 'lit-html';

console.log(window.devicePixelRatio);

const dpr = window.devicePixelRatio;
console.log({ dpr, s: `/media/${1083 * dpr}/landing.jpg ${dpr}x` });

const Home = () => html`

  <div class="landing">
    <picture>
      <source
        media="(max-width: 310px)"
        sizes="100%"
        srcset="/media/${910 * dpr}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />
      <source
        media="(max-width: 319px)"
        sizes="100%"
        srcset="/media/${975 * dpr}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />
      <source
        media="(max-width: 349px)"
        sizes="100%"
        srcset="/media/${980 * dpr}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />
      <source
        media="(max-width: 360px)"
        sizes="100%"
        srcset="/media/${1055 * dpr}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />
      <source
        media="(max-width: 380px)"
        sizes="100%"
        srcset="/media/${1083 * dpr}/landing.jpg ${dpr}x"
        type="image/jpeg"
      />
      <img src="/media/100/landing.jpg" />
    </picture>
    <h1>hello</h1>
    ${Anchor({ content: 'Buy my T-Shirt', href: '/product' })}
  </div>`;

export default Home;