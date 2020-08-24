const fs = require('fs/promises');

const _delete = async (path) => {

  try {
    await fs.unlink(path);
  } catch (fsError) {
    //console.dir({ fsError }, { depth: null });
  }
}

module.exports = {
  delete: _delete
};