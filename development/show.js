require('dotenv').config();
const fs = require('fs/promises');
const mongoStore = require('./development-mdb');

const showAuthSessions = async () =>
  console.dir(await mongoStore.findAllInCollection('authSession'), { depth: null });

const showLoginLinks = async () =>
  console.dir(await mongoStore.findAllInCollection('loginLink'), { depth: null });

const showOrder = async () =>
  console.dir(await mongoStore.findAllInCollection('order'), { depth: null });

const showOrderSessions = async () =>
  console.dir(await mongoStore.findAllInCollection('orderSession'), { depth: null });

const showProducts = async () =>
  console.dir(await mongoStore.findAllInCollection('product'), { depth: null });

const showStripeAccounts = async () =>
  console.dir(await mongoStore.findAllInCollection('stripeAccount'), { depth: null });

const showUsers = async () =>
  console.dir(await mongoStore.findAllInCollection('user'), { depth: null });

const showWwwMedia = async () => {

  const entries = await fs.readdir('/var/www/media', {
    withFileTypes: true
  });

  for (const entry of entries) {
    console.log(entry.name);
  }
};

const args = process.argv.slice(2);
const funcs = {
  authSession: showAuthSessions,
  loginLink: showLoginLinks,
  order: showOrder,
  orderSession: showOrderSessions,
  product: showProducts,
  stripeAccount: showStripeAccounts,
  user: showUsers,
  wwwmedia: showWwwMedia,
};

for (const arg of args) {
  funcs[arg]();
}