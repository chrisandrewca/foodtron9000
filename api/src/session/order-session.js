const apiValidation = require('../validation/api-validation');
const cookie = require('cookie');
const mongoStore = require('../storage/mdb');
const uuid = require('uuid').v4;

const orderSession = async (req, res, next) => {

  let orderSession;

  // TODO it would be really cool to make this code more functional
  const cookies = cookie.parse(req.headers.cookie || '');
  if (!cookies.order) {

    const id = uuid();

    // TODO per user secret for signing id value
    res.setHeader('Set-Cookie', cookie.serialize('order', id, {
      domain: process.env.RUNTIME_DOMAIN,
      httpOnly: true,
      maxAge: 60 * 60 * 24,
      sameSite: 'strict',
      secure: true
    }));

    // TODO devops/SRE - notify team if there's an error here
    orderSession = { id, products: [] };
    await apiValidation.orderSession({ orderSession });

    await mongoStore.setOrderSession(orderSession, orderSession);
  } else {

    orderSession = await mongoStore.getOrderSession({ id: cookies.order });
    // TODO consider validating / SRE notice
  }

  req.scoped.orderSession = orderSession;

  next();
};

module.exports = orderSession;