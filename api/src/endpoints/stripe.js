const auth = require('../auth/auth');
const mongoStore = require('../storage/mdb');
const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE);
const stripeService = require('../payments/stripe-bl');

router.get('/authorize', auth.validateAuthSession, async (req, res) => {

  const { email, handle } = req.scoped.user;
  const stripeAccount = await mongoStore.getStripeAccount({ handle });

  if (stripeAccount) {

    // TODO is there another way to handle optional JSON responses client side?
    return res.json({ authorize: {} });
  } else {

    const query = new URLSearchParams();
    query.set('client_id', process.env.STRIPE_CONNECT_CLIENT_ID);
    query.set('response_type', 'code');
    query.set('scope', 'read_write');
    query.set('state', handle); // TODO make more secure? CSRF warning: used in /authorize/grant
    query.set('stripe_user[email]', email);

    return res.json({
      authorize: {
        url: `https://connect.stripe.com/oauth/authorize?${query.toString()}`
      }
    });
  }
});

router.get('/authorize/grant', async (req, res) => {

  const stripeAccount = await stripe.oauth.token({
    grant_type: 'authorization_code',
    code: req.query.code
  });

  const { state: handle } = req.query;

  const userExists = await mongoStore.getUserExists({ handle });

  if (stripeAccount && userExists) {

    await mongoStore.setStripeAccount({ handle, ...stripeAccount });

    // since stripeCheckout's initial value is undefined so we don't need a 1st time set variable
    await mongoStore.setUserFeature({ handle, stripeCheckout: true });

    return res.redirect(`/manage-profile?handle=${handle}`);
  }

  return res.redirect('/');
});

router.get('/receipt', async (req, res) => {

  // TODO api validation
  const { handle, orderId, paymentMethod } = req.query;

  // TODO consider querying by { handle, id }

  let receiptProducts, receiptUrl;

  // warning: be careful of race conditions as the stripe webhook needs to be called and completed
    // prior to a stripe order being stored in the db
  if (paymentMethod === 'stripe') {

    const { stripe_user_id } =
      (await mongoStore.getStripeAccount({ handle }))
      || { stripe_user_id: process.env.STRIPE_ACCOUNT_ID };

    const { payment_intent } = await stripe
      .checkout
      .sessions
      .retrieve(orderId, { stripeAccount: stripe_user_id });

    ({ charges: { data: [{ receipt_url: receiptUrl }] } } = await stripe
      .paymentIntents
      .retrieve(payment_intent, { stripeAccount: stripe_user_id }));
  } else {

    // warning: be careful of race conditions, the order has been recorded in buy.js
      // by the time we're here
    const order = await mongoStore.getOrderById({ id: orderId });
    receiptProducts = order.products;
  }

  return res.json({
    receipt: {
      products: receiptProducts,
      url: receiptUrl
    }
  });
});

router.post('/hook', async (req, res) => {

  const { error, event, received } =
    await stripeService.validateHookEvent({
      rawBody: req.rawBody,
      signature: req.headers['stripe-signature'],
      stripeHookPrivateKey: process.env.STRIPE_HOOK_PRIVATE
    });

  if (error) {

    return res
      .status(400)
      .send(`Webhook Error: ${error.message}`);
  }

  await stripeService.handleHookEvent({ event });

  return res.json({ received });
});

router.post('/hook-personal', async (req, res) => {

  const { error, event, received } =
    await stripeService.validateHookEvent({
      rawBody: req.rawBody,
      signature: req.headers['stripe-signature'],
      stripeHookPrivateKey: process.env.STRIPE_HOOK_PERSONAL_PRIVATE
    });

  if (error) {

    return res
      .status(400)
      .send(`Webhook Error: ${error.message}`);
  }

  await stripeService.handleHookEvent({ event });

  return res.json({ received });
});

module.exports = router;