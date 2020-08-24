const auth = require('../auth/auth');
const emailService = require('../comms/email');
const mongoStore = require('../storage/mdb');
const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE);

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

    return res.redirect(`/manage-profile?handle=${handle}`);
  }

  return res.redirect('/');
});

router.get('/receipt', async (req, res) => {

  // TODO api validation
  const { handle, stripeSessionId } = req.query;

  const { stripe_user_id } =
    (await mongoStore.getStripeAccount({ handle }))
    || { stripe_user_id: process.env.STRIPE_ACCOUNT_ID };

  const { payment_intent } = await stripe
    .checkout
    .sessions
    .retrieve(stripeSessionId, { stripeAccount: stripe_user_id });

  const { charges: { data: [{ receipt_url: receiptUrl }] } } = await stripe
    .paymentIntents
    .retrieve(payment_intent, { stripeAccount: stripe_user_id });

  return res.json({ receipt: { receiptUrl } });
});

router.post('/hook', async (req, res) => {

  let event;
  try {

    event = stripe.webhooks.constructEvent(
      req.rawBody, // warning: from custom middleware
      req.headers['stripe-signature'],
      process.env.STRIPE_HOOK_PRIVATE);
  } catch (err) {

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {

    const session = event.data.object;
    const { metadata: { handle } } = session; // warning: comes from buy.js

    const { stripe_user_id } =
      (await mongoStore.getStripeAccount({ handle }))
      || { stripe_user_id: process.env.STRIPE_ACCOUNT_ID };

    const { data: lineItems } = await stripe
      .checkout
      .sessions
      // TODO paginate
      .listLineItems(session.id, { limit: 100 }, { stripeAccount: stripe_user_id });

    const products = [];
    for (const lineItem of lineItems) {

      // warning: comes from buy.js
      const { metadata: { id, note }, name } = await stripe
        .products
        .retrieve(lineItem.price.product, { stripeAccount: stripe_user_id });

      products.push({
        id,
        name,
        note,
        quantity: lineItem.quantity
      });
    }

    const paymentIntent = await stripe
      .paymentIntents
      .retrieve(session.payment_intent, { stripeAccount: stripe_user_id });

    const customer = {
      email: paymentIntent.charges.data[0].billing_details.email,
      name: paymentIntent.charges.data[0].billing_details.name
    };

    const order = {
      customer,
      handle,
      products,
      stripe: {
        lineItems,
        paymentIntent,
        sessionId: session.id
      }
    };

    await mongoStore.setOrder(order);

    // TODO stats and customer engagement for restaurants things
    // await db.incrementStat(handle, 'orderCount', 1);
    // const dollarSales = money.tallyCheckoutSale(event.data.object.display_items);
    // await db.incrementStat(handle, 'dollarSales', dollarSales);

    const user = await mongoStore.getUserByHandle({ handle });

    await emailService.sendOrderPlacedEmail({ order, user });
  }

  res.json({ received: true });
});

module.exports = router;