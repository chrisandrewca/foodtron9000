require('dotenv').config();
const fs = require('fs/promises');
const mongoStore = require('./development-mdb');

const showOrderSessions = async () =>
  console.dir(await mongoStore.findAllInCollection('orderSession'), { depth: null });

const showProducts = async () =>
  console.dir(await mongoStore.findAllInCollection('product'), { depth: null });

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
  orderSession: showOrderSessions,
  product: showProducts,
  user: showUsers,
  wwwmedia: showWwwMedia,
};

for (const arg of args) {
  funcs[arg]();
}