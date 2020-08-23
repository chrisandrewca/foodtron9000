const cookie = require('cookie');
const mongoStore = require('../storage/mdb');
const uuid = require('uuid').v4;

/*
 * The URL is the password (user identifier). Send via HTTPS.
 * Expires in 10 minutes.
 * Verified by the user accessing their inbox.
 */
const getLoginLink = async ({ handle }) => {

  // prevent orphans and multiple logins
  await mongoStore.deleteLoginLinks({ handle });

  const currentTime = new Date();
  const expiry = currentTime.setMinutes(currentTime.getMinutes() + 10).valueOf();
  const key = uuid();

  await mongoStore.setLoginLink({ expiry, handle, key });

  return `https://${process.env.RUNTIME_DOMAIN}/api/auth/login?key=${key}`;
};

const setAuthSession = async (res, { handle }) => {

  const sessionId = uuid();

  // prevent orphans and multiple sessions
  await mongoStore.deleteAuthSessions({ handle });

  await mongoStore.setAuthSession({ created: Date.now(), handle, sessionId });

  res.setHeader('Set-Cookie', cookie.serialize('sessionId', sessionId, {
    domain: process.env.RUNTIME_DOMAIN,
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: '/',
    sameSite: 'strict',
    secure: true
  }));
};

const validateAuthSession = async (req, res, next) => {

  const { sessionId } = cookie.parse(req.headers.cookie || '');

  // notice: users can be revoked by deleting their session from the store
  const authSession = await mongoStore.getAuthSession({ sessionId });

  if (!authSession) {
    return res.status(401).end();
  }

  req.scoped.user = await mongoStore.getUserByHandle({ handle: authSession.handle });

  next();
};

const validateLoginLink = async ({ key }) => {

  const now = Date.now();

  const loginLink = await mongoStore.getLoginLink({ key });

  if (!loginLink) {
    return;
  }

  const { handle, key: serverKey, expiry } = loginLink;

  if (handle) {
    await mongoStore.deleteLoginLinks({ handle });

    if (expiry >= now && serverKey === key) {

      return await mongoStore.getUserByHandle({ handle });
    }
  }
};

module.exports = {
  getLoginLink,
  setAuthSession,
  validateAuthSession,
  validateLoginLink
};