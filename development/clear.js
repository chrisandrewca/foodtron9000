require('dotenv').config();
const fs = require('fs/promises');
const mongoStore = require('./development-mdb');

const clearAuthSessions = async () =>
  await mongoStore.clearAllInCollection('authSession');

const clearLoginLinks = async () =>
  await mongoStore.clearAllInCollection('loginLink');

const clearOrderSessions = async () =>
  await mongoStore.clearAllInCollection('orderSession');

const clearProducts = async () =>
  await mongoStore.clearAllInCollection('product');

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

const args = process.argv.slice(2);
const funcs = {
  authSession: clearAuthSessions,
  loginLink: clearLoginLinks,
  orderSession: clearOrderSessions,
  product: clearProducts,
  user: clearUsers,
  wwwmedia: clearWwwMedia,
};

for (const arg of args) {
  funcs[arg]();
}