import Anchor from './utils/anchor';
import { html } from 'lit-html';
import Image from './elements/image';

const Home = () => html`

    ${Image('chrisandrewca')}
    ${Anchor({ content: 'Buy my T-Shirt', href: '/product' })}`;

export default Home;