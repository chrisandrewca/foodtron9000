import { html } from 'lit-html';
import { setLocation } from './location';

const Anchor = ({ content, href }) => {

  const onClick = (e) => {
    e.preventDefault();
    setLocation(href);
  };

  if (typeof 'function' === content) {
    content = content();
  }

  return html`<a @click=${onClick} .href=${href}>${content}</a>`;
};

export default Anchor;