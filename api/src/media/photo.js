const sharp = require('sharp');

const saveFromFiles = async ({ files }) => {

  const photos = [];
  for (const { filename, path } of files) {

    const destFolder = '/var/www/media';

    const sharpService = await sharp(path)
      .rotate()
      .resize(1080, null, { fit: 'inside' });

    await sharpService
      .webp()
      .toFile(`${destFolder}/${filename}.webp`);

    await sharpService
      .jpeg()
      .toFile(`${destFolder}/${filename}.jpeg`);

    photos.push({ filename });
  }

  return photos;
};

module.exports = {
  saveFromFiles
};