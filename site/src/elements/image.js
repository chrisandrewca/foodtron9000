import { html } from 'lit-html';

const Image = (name) => html`
  <picture>
    <source type="image/webp" media="(min-width: 450px)" .srcset=${`/media/512/${name}.webp`} />
    <source type="image/jpeg" media="(min-width: 450px)" .srcset=${`/media/512/${name}.jpeg`} />
    <source type="image/webp" media="(min-width: 321px)" .srcset=${`/media/375/${name}.webp`} />
    <source type="image/jpeg" media="(min-width: 321px)" .srcset=${`/media/375/${name}.jpeg`} />
    <img alt="Me TODO" src="/media/270/chrisandrewca.webp" /><!-- TODO fix me -->
  </picture>`;

export default Image;