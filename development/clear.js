require('dotenv').config();
const fs = require('fs/promises');
const mongoStore = require('./development-mdb');

const clearUsers = async () => {

  await mongoStore.clearAllUsers();
};

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
  users: clearUsers,
  wwwmedia: clearWwwMedia,
};

for (const arg of args) {
  funcs[arg]();
}