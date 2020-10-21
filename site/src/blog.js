import { html } from 'lit-html';
import { update } from './utils/render';

export const loadState = async () => {
  await update(Blog());
};

export const loadEffect = async () => { };

const Blog = () => html`
<h1>The Food-Tron 9000 Blog</h1>`;