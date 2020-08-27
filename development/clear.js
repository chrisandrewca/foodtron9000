require('dotenv').config();
const fs = require('fs/promises');
const mongoStore = require('./development-mdb');

const clearAllByUser = async (args) => {

  const handle = args[args.findIndex(a => a === 'allByUser') + 1];

  await mongoStore.clearAllInCollectionByUser({ collection: 'authSession', handle });
  await mongoStore.clearAllInCollectionByUser({ collection: 'loginLink', handle });
  await mongoStore.clearAllInCollectionByUser({ collection: 'order', handle });
  await mongoStore.clearAllInCollectionByUser({ collection: 'orderSession', handle });
  await mongoStore.clearAllInCollectionByUser({ collection: 'product', handle });
  await mongoStore.clearAllInCollectionByUser({ collection: 'stripeAccount', handle });
  await mongoStore.clearAllInCollectionByUser({ collection: 'user', handle });
};

const clearAuthSessions = async () =>
  await mongoStore.clearAllInCollection('authSession');

const clearErrors = async () =>
  await mongoStore.clearAllInCollection('error');

const clearLoginLinks = async () =>
  await mongoStore.clearAllInCollection('loginLink');

const clearOrder = async () =>
  await mongoStore.clearAllInCollection('order');

const clearOrderSessions = async () =>
  await mongoStore.clearAllInCollection('orderSession');

const clearProducts = async () =>
  await mongoStore.clearAllInCollection('product');

const clearStripeAccounts = async () =>
  await mongoStore.clearAllInCollection('stripeAccount');

const clearUsers = async () =>
  await mongoStore.clearAllInCollection('user');

const clearWwwMedia = async () => {

  const entries = await fs.readdir('/var/www/media', {
    withFileTypes: true
  });

  for (const entry of entries) {
    if (entry.isFile()) {
      await fs.unlink(`/var/www/media/${entry.name}`)
    }
  }
};

const clearEverything = async () => {

  await clearAuthSessions();
  await clearErrors();
  await clearLoginLinks();
  await clearOrder();
  await clearOrderSessions();
  await clearProducts();
  await clearStripeAccounts();
  await clearUsers();
  await clearWwwMedia();
};

const args = process.argv.slice(2);
const funcs = {
  allByUser: clearAllByUser,
  authSession: clearAuthSessions,
  error: clearErrors,
  everything: clearEverything,
  loginLink: clearLoginLinks,
  order: clearOrder,
  orderSession: clearOrderSessions,
  product: clearProducts,
  stripeAccount: clearStripeAccounts,
  user: clearUsers,
  wwwmedia: clearWwwMedia,
};

for (const arg of args) {
  if (funcs[arg]) {
    funcs[arg](args);
  }
}