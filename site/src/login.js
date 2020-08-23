import * as Api from './utils/api-client';
import { getSearchParams, setLocation } from './utils/location';
import { html, nothing } from 'lit-html';
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

  // TODO way better error handling for like when server straight up crashes
  const { error } = await Api.login({ email: fields.email.value });

  if (error) {
    alert(error.params.email);
  } else {
    alert('A link to login has been sent to your email. See ya soon! 😀');
  }
};

const Login = ({ fields }) => html`

<h1>Login</h1>
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
    @click=${(e) => handleSubmit({ e, fields })}
    type="submit"
    value="Login"
  />
</form>`;