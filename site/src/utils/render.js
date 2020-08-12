import { render } from 'lit-html';

// async as a queue mechanism
// see https://github.com/Polymer/lit-element/blob/master/src/lib/updating-element.ts
export const update = async (html) => {
  render(html, window.document.body);
};