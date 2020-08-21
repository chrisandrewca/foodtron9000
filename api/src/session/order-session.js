const apiValidation = require('../validation/api-validation');
const cookie = require('cookie');
const mongoStore = require('../storage/mdb');
const uuid = require('uuid').v4;

// TODO future - this can be generalized to createSession('name')
const orderSession = async (req, res, next) => {

  const setOrderSession = async (id) => {

    const { orderSession, validationError } = await apiValidation.orderSession({
      orderSession: {
        id,
        products: []
      }
    });

    if (validationError) {
      console.dir('orderSession error', { validationError });
      // TODO devops/SRE - notify team if there's an error here
    }

    await mongoStore.setOrderSession(orderSession, orderSession);

    res.setHeader('Set-Cookie', cookie.serialize('orderSessionId', orderSession.id, {
      domain: process.env.RUNTIME_DOMAIN,
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: '/',
      sameSite: 'strict',
      secure: true
    }));

    return orderSession;
  };

  const { orderSessionId } = cookie.parse(req.headers.cookie || '');

  req.scoped.orderSession = await mongoStore.getOrderSession({ id: orderSessionId });

  if (!req.scoped.orderSession) {
    req.scoped.orderSession = await setOrderSession(uuid());
  }

  next();
};

module.exports = orderSession;