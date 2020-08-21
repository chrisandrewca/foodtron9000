const apiValidation = require('../validation/api-validation');
const cookie = require('cookie');
const mongoStore = require('../storage/mdb');
const uuid = require('uuid').v4;

const orderSession = async (req, res, next) => {

  const createOrderSession = async (id) => {

    const orderSession = { id, products: [] };
    // TODO devops/SRE - notify team if there's an error here
    await apiValidation.orderSession({ orderSession });

    await mongoStore.setOrderSession(orderSession, orderSession);

    res.setHeader('Set-Cookie', cookie.serialize('order', id, {
      domain: process.env.RUNTIME_DOMAIN,
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      path: '/',
      sameSite: 'strict',
      secure: true
    }));

    return orderSession;
  };

  const cookies = cookie.parse(req.headers.cookie || '');

  req.scoped.orderSession = await mongoStore.getOrderSession({ id: cookies.order || undefined });

  if (!orderSession) {
    req.scoped.orderSession = await createOrderSession(uuid());
  }

  next();
};

module.exports = orderSession;