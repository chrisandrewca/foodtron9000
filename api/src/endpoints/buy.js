const emailService = require('../comms/email');
const mongoStore = require('../storage/mdb');
const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE);

router.post('/', async (req, res) => {

  const { orderSession } = req.scoped;

  const handle = 'chris'; // TODO
  const stripeAccount = { // TODO from DB else FT9 account for test checkout
    accountId: process.env.STRIPE_ACCOUNT_ID
  };

  // TODO if not users stripe account
  // TODO user
  await emailService.sendCheckoutWithoutStripeAccountEmail({ user: { email: '' } });

  // TODO from mongo
  // TODO billing/business model
  const currency = 'USD';

  let payment_intent_data;
  // TODO when retrieving a stripe account from mongo
  // payment_intent_data = {
  //   application_fee_amount: 1 // TODO
  // };

  const checkout = {
    cancel_url: `https://${process.env.RUNTIME_DOMAIN}/profile`, // TODO handle in url
    metadata: {
      handle // warning: used in stripe.js for handling webhook events
    },
    mode: 'payment',
    line_items: [{
      price_data: {
        currency,
        product_data: {
          description: 'TODO description',
          //images: item.images, // TODO
          name: 'TODO name'
        },
        // TODO intl amount https://blog.khophi.co/charge-stripe-in-actual-dollars-not-cents/
        unit_amount: 100, // TODO
      },
      quantity: 1 // TODO
    }],
    payment_intent_data,
    payment_method_types: ['card'], // TODO see what can be offered here
    success_url: `https://${process.env.RUNTIME_DOMAIN}/profile?session_id={CHECKOUT_SESSION_ID}` // TODO handle in url
  };

  const session = await stripe.checkout.sessions.create(
    checkout,
    { stripeAccount: stripeAccount.accountId }); // TODO users account id, may be stripified name with underscores _

  return res.json({
    buy: {
      stripe: {
        sessionId: session.id,
        stripeAccount: stripeAccount.accountId // TODO
      }
    }
  });
});

module.exports = router;