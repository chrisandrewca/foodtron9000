const emailService = require('../comms/email');
const mongoStore = require('../storage/mdb');
const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE);

router.get('/receipt', async (req, res) => {

  // TODO api validation
  const { handle, sessionId } = req.query;

  const { stripe_user_id } =
    (await mongoStore.getStripeAccount({ handle }))
    || { stripe_user_id: process.env.STRIPE_ACCOUNT_ID };

  const { payment_intent } = await stripe
    .checkout
    .sessions
    .retrieve(sessionId, { stripeAccount: stripe_user_id });

  const { charges: { data: [{ receipt_url: receiptUrl }] } } = await stripe
    .paymentIntents
    .retrieve(payment_intent, { stripeAccount: stripe_user_id });
  
  return res.json({ receipt: { receiptUrl }});
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