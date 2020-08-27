require('dotenv').config();
const fs = require('fs/promises');
const mongoStore = require('./development-mdb');

const showAllByUser = async (args) => {

  const handle = args[args.findIndex(a => a === 'allByUser') + 1];

  console.log('authSession');
  console.dir(await mongoStore.findAllInCollectionByUser({ collection: 'authSession', handle }), { depth: null });

  console.log('loginLink');
  console.dir(await mongoStore.findAllInCollectionByUser({ collection: 'loginLink', handle }), { depth: null });

  console.log('order');
  console.dir(await mongoStore.findAllInCollectionByUser({ collection: 'order', handle }), { depth: null });

  console.log('orderSession');
  console.dir(await mongoStore.findAllInCollectionByUser({ collection: 'orderSession', handle }), { depth: null });

  console.log('product');
  console.dir(await mongoStore.findAllInCollectionByUser({ collection: 'product', handle }), { depth: null });

  console.log('stripeAccount');
  console.dir(await mongoStore.findAllInCollectionByUser({ collection: 'stripeAccount', handle }), { depth: null });

  console.log('user');
  console.dir(await mongoStore.findAllInCollectionByUser({ collection: 'user', handle }), { depth: null });
};

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
  allByUser: showAllByUser,
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
  if (funcs[arg]) {
    funcs[arg](args);
  }
}