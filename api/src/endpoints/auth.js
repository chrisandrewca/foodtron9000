const auth = require('../auth/auth');
const emailService = require('../comms/email');
const mongoStore = require('../storage/mdb');
const router = require('express').Router();

router.get('/', auth.validateAuthSession, async (req, res) => {

  return res.status(200).end();
});

router.get('/login', async (req, res) => {

  // TODO API validation, error messages
  const { email, key } = req.query;

  if (email !== undefined) {

    const userExists = await mongoStore.getUserExists({ email });

    if (userExists) {

      const { email, handle } = userExists;

      const loginLink = await auth.getLoginLink({ handle });
      console.log({ loginLink });

      await emailService.sendLoginEmail({ email, handle, loginLink });

      return res.status(200).end();

    } else {

      return res.json({
        auth: {
          error: {
            code: 'email',
            params: { email: 'Sorry we\'re unable to log you in. Please check your email address.' }
          }
        }
      });
    }
  } else {

    // TODO API validation
    if (!key) {
      return res.redirect('/');
    }

    const user = await auth.validateLoginLink({ key });
    console.log({ key, user });

    if (!user) {
      return res.redirect('/');
    }

    await auth.setAuthSession(res, user);

    return res.redirect(`/manage-profile?handle=${user.handle}`);
  }
});

module.exports = router;