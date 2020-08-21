const emailService = require('../comms/email');
const mongoStore = require('../storage/mdb');
const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE);

router.post('/', async (req, res) => {

  const { orderSession } = req.scoped;
  if (!orderSession.products.length) {
    // TODO joi?
    return res.status(500).json({
      buy: {
        error: {
          code: 'schema',
          fields: {
            order: 'Your order must have at least one product.'
          }
        }
      }
    });
  }

  const handle = 'chris'; // TODO
  // TODO from mongo
  // TODO billing/business model
  const currency = 'USD';

  const line_items = [];
  for (const product of orderSession.products) {

    const { id, note, quantity } = product;
    const { description, name, photos, price } = await mongoStore.getProductById({ id });

    const product_data = {
      description,
      images: photos.map(({ filename }) => `https://${process.env.RUNTIME_DOMAIN}/media/1080/${filename}.jpeg`),
      metadata: {
        id,
        note
      },
      name
    };

    const price_data = {
      currency: 'USD',
      product_data,
      unit_amount: Number(price) * 100
    };

    line_items.push({
      price_data,
      quantity
    });
  }

  const { stripe_user_id } =
    (await mongoStore.getStripeAccount({ handle }))
    || { stripe_user_id: process.env.STRIPE_ACCOUNT_ID };

  // TODO user
  if (process.env.STRIPE_ACCOUNT_ID === stripe_user_id) {
    await emailService.sendCheckoutWithoutStripeAccountEmail({
      lineItems: line_items,
      user: { handle: 'chris', email: '' }
    });
  }

  let payment_intent_data;
  // TODO when retrieving a stripe account from mongo
  payment_intent_data = {
    //application_fee_amount: 1 // TODO
  };

  const checkout = {
    cancel_url: `https://${process.env.RUNTIME_DOMAIN}/profile`, // TODO handle in url
    metadata: {
      handle // warning: used in stripe.js for handling webhook events
    },
    mode: 'payment',
    line_items,
    payment_intent_data,
    payment_method_types: ['card'], // TODO other options?
    success_url: `https://${process.env.RUNTIME_DOMAIN}/profile?session_id={CHECKOUT_SESSION_ID}` // TODO handle in url
  };

  const session = await stripe
    .checkout
    .sessions
    .create(checkout, { stripeAccount: stripe_user_id });

  return res.json({
    buy: {
      stripe: {
        sessionId: session.id,
        stripeAccount: stripe_user_id
      }
    }
  });
});

module.exports = router;