const apiValidation = require('../validation/api-validation');
const multer = require('multer')({
  dest: 'scratch'
});
const router = require('express').Router();
const sharp = require('sharp');

router.post('/', multer.single('photo'), async (req, res) => {

  const { body, error, file } = await apiValidation.start(req);
  console.dir({ error }, { depth: null });
  // TODO fix joi messages

  if (error) {
    if (file && file.path) {
      fs.delete(`/${file.path}`);
    }

    // TODO support photo key - since is file[path,orignalname]
    // maybe just check !file
    const error = { code: 1, fields: {} };
    for (const detail of details) {
      // warning: only supports single level field[key]
      error.fields[detail.context.key] = detail.message;
    }

    return res.json({ error });
  }

  const userExists = await db.userExists(body);
  if (userExists) {
    const { email, handle } = userExists;
    if (handle) {
      res.json({
        error: {
          code: 2,
          fields: {
            handle: 'Sorry that @handle is taken.'
          }
        }
      });
    }

    if (email) {
      res.json({
        error: {
          code: 3,
          fields: {
            email: 'Welcome back! You\'re already signed up.'
          }
        }
      });
    }
  }

  const validEmail = await email.validate(body);
  if (!validEmail) {
    res.json({
      error: {
        code: 4,
        fields: {
          email: 'Sorry we\'re unable to verify your email address.'
        }
      }
    });
  }

  try {
    await db.setUser();
    const photo = await photos.savePhoto();
    await db.setMenuItem();
    await email.start();

    fs.delete(`/${file.path}`);
  } catch (error) {
    return res.json({
      code: 5
    });
  }

  return res.status(200).end();
});

module.exports = router;