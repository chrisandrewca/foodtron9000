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

  // TODO api validation for req.body

  const { handle } = req.body;

  const { stripeCheckout } = await mongoStore.getUserFeature({ handle });

  // warning: explicit false rather than falsy so we can fall through for new accounts with undefined
    // see /api/stripe/authorize/grant
  // warning: /api/stripe/receipt relies on this code to persist the order prior to response
  if (stripeCheckout === false) {

    // TODO send email to the customer
    // TODO send email for stripe customers
    const customer = {
      name: 'TODO customer name',
      email: 'TODO customer email'
    };

    const products = [];
    // TODO duplicate code between when stripeCheckout !== false below
      // AND stripe /hook checkout.session.completed
    for (const { id, note, quantity } of orderSession.products) {
      const product = await mongoStore.getProductById({ id });

      if (!product) {
        // TODO product has been deleted - won't show up in the checkout sale...
        // somehow notify user...
        continue;
      }

      products.push({
        id,
        name: product.name,
        note,
        quantity
      });
    }

    // TODO move into order business logic
    const order = {
      customer,
      handle,
      id: orderSession.id,
      products
    };

    await mongoStore.setOrder(order);

    const user = await mongoStore.getUserByHandle({ handle });

    await emailService.sendOrderPlacedEmail({
      order,
      user
    });

    return res.json({
      buy: {
        system: {
          orderId: order.id
        }
      }
    });
  }

  // TODO from mongo
  const currency = 'USD';

  const line_items = [];
  for (const { id, note, quantity } of orderSession.products) {

    // TODO duplicate code see above when stripeCheckout === false
    // investigate "stream" processing where an element can be pipped through composable functions
    // prior to functionaly producing an entire new list and re-iterating
    const product = await mongoStore.getProductById({ id });

    if (!product) {
      // TODO product has been deleted - won't show up in the checkout sale...
      // somehow notify user...
      continue;
    }

    const { description, name, photos, price } = product;

    const product_data = {
      description: description ? description : undefined,
      images: photos.map(({ filename }) => `https://${process.env.RUNTIME_DOMAIN}/media/1080/${filename}.jpeg`),
      metadata: {
        id,
        note
      },
      name
    };

    const price_data = {
      currency,
      product_data,
      unit_amount: Math.round(price * 100)
    };

    line_items.push({
      price_data,
      quantity
    });
  }

  const { stripe_user_id } =
    (await mongoStore.getStripeAccount({ handle }))
    || { stripe_user_id: process.env.STRIPE_ACCOUNT_ID };

  const convenience_fee = 30;
  let payment_intent_data;

  if (process.env.STRIPE_ACCOUNT_ID === stripe_user_id) {

    const user = await mongoStore.getUserByHandle({ handle });

    await emailService.sendCheckoutWithoutStripeAccountEmail({
      lineItems: line_items,
      user
    });
  } else {

    // warning: user has no connected stripe account and application_fee_amount requires one
    // TODO could use a permanent dummy account here but any payments would go to us and not the user...
    payment_intent_data = {
      application_fee_amount: convenience_fee
    };
  }

  // TODO consider refactoring email to show convenience fee
  // warning: sendCheckoutWithoutStripeAccountEmail requires a product with images and description
    // so we create the convenience fee after
  line_items.push({
    price_data: {
      currency,
      product_data: {
        name: 'Convenience fee'
      },
      unit_amount: convenience_fee
    },
    quantity: 1
  });

  const checkout = {
    cancel_url: `https://${process.env.RUNTIME_DOMAIN}/${handle}`,
    metadata: {
      handle // warning: used in stripe-bl.js for handling webhook events
    },
    mode: 'payment',
    line_items,
    payment_intent_data,
    payment_method_types: ['card'], // TODO other options?
    success_url: `https://${process.env.RUNTIME_DOMAIN}/${handle}?paymentMethod=stripe&orderId={CHECKOUT_SESSION_ID}`
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