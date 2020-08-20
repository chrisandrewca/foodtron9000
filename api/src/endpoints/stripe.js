const emailService = require('../comms/email');
const mongoStore = require('../storage/mdb');
const router = require('express').Router();
const Stripe = require('stripe');

router.post('/hook', async (req, res) => {

  let event;
  try {

    const stripe = Stripe(process.env.STRIPE_PRIVATE);

    event = stripe.webhooks.constructEvent(
      req.rawBody, // warning: from custom middleware
      req.headers['stripe-signature'],
      process.env.STRIPE_HOOK_PRIVATE);
  } catch (err) {

    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {

    const session = event.data.object;
    const { handle } = session.metadata; // warning: comes from buy.js
    const { access_token } = process.env.STRIPE_PRIVATE; // TODO await mongoStore.getStripeAccount({ handle });

    // TODO
    // await db.incrementStat(handle, 'orderCount', 1);
    // const dollarSales = money.tallyCheckoutSale(event.data.object.display_items);
    // await db.incrementStat(handle, 'dollarSales', dollarSales);

    // TODO customer engagement for restaurants
    // TODO fix email
    let customer = { email: '' };
    if (session.customer) {
      customer = await Stripe(access_token)
        .customers
        .retrieve(session.customer);
    }

    // TODO quantity, note
    // TODO move html generation into emailService
    // TODO
    // const productsOrdered = session.display_items.map(item =>
    //   `<li>${item.custom.name}</li>`
    // );

    const productsOrdered = '<li>TODO Product name, quantity, note</li>';

    // TODO
    //const user = await mongoStore.getUser({ handle });
    const user = { email: '' };

    await emailService.sendOrderPlacedEmail({ customer, productsOrdered, user });
  }

  res.json({ received: true });
});

module.exports = router;