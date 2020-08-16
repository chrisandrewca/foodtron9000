const fs = require('fs/promises');

const _delete = async (path) => {
  await fs.unlink(path);
};

module.exports = {
  delete: _delete
};