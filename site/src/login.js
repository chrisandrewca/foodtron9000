import * as Api from './utils/api-client';
import { copyFields, trimFields } from './utils/form';
import { html } from 'lit-html';
import { setState } from './utils/state';
import { update } from './utils/render';

export const loadState = async () => {

  const state = setState(() => ({
    fields: { }
  }));

  await update(Login(state));
};

export const loadEffect = async () => { };

const handleChange = async (e) => {

  const { name, value } = e.target;

  const state = setState(state => ({
    ...state,
    fields: {
      ...state.fields,
      [name]: {
        ...state.fields[name],
        value
      }
    }
  }));

  await update(Login(state));
};

const handleSubmit = async ({ e, fields }) => {

  e.preventDefault();
  e.target.disabled = true;

  fields = copyFields(fields);
  trimFields(fields);

  const { email } = fields;

  // TODO way better error handling for like when server straight up crashes
  const { error } = await Api.login({ email: email.value });

  if (error) {
    alert(error.params.email);
  } else {
    alert('A link to login has been sent to your email. See ya soon! 😀');
  }

  e.target.disabled = false;
};

const Login = ({ fields }) => html`

<style type="text/css">
  .container {
    font-size: 4vw;
    margin: 0 auto;
    max-width: 90vw;
    overflow-wrap: break-word;
    padding: 1vh 0 0 0;
  }

  h1 {
    font-size: 8vw;
    text-align: center;
  }

  h2 {
    font-weight: 400;
    text-decoration: underline;
  }

  a, label, input, textarea {
    font-size: 16px;
  }

  main {
    padding: 0 0 1vh 0;
  }

  section {
    margin: 0 0 3vh 0;
  }

  form {
    padding: 2vh 0 0 0;
  }

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
    margin: 0 auto;
  }

  input, label, textarea {
    display: block;
    margin: 0 0 3vh 0;
    width: 100%;
  }

  textarea, input {
    border: 0.1rem solid #999;
    padding: 2vw;
    resize: vertical;
  }

  .insta-button {
    border: 0.1rem solid #999;
    border-radius: 3px;
    box-shadow: none;
    background: white;
    color: #262626;
    font-size: 2vh;
    font-weight: 400;
    padding: 1.2vw 4vw;
    text-transform: none;
  }

  .save {
    background: white;
  }
</style>
<div class="container">

<header>
  <h1>Login</h1>
</header>

<main>
<form>
  <label>
    Email
    <input
      @change=${handleChange}
      name="email"
      type="email"
    />
  </label>

  <input
    class="save"
    @click=${(e) => handleSubmit({ e, fields })}
    type="submit"
    value="Login"
  />
</form>
</main>`;