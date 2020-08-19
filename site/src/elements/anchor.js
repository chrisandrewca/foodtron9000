import { html } from 'lit-html';
import { setLocation } from '../utils/location';

const Anchor = ({ content, href }) => {

  const onClick = (e) => {
    e.preventDefault();
    setLocation(href);
  };

  return html`<a @click=${onClick} .href=${href}>${content}</a>`;
};

export default Anchor;