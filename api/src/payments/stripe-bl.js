const emailService = require('../comms/email');
const mongoStore = require('../storage/mdb');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE);

const handleHookEvent = async ({ event }) => {

  if (event.type === 'checkout.session.completed') {

    const session = event.data.object;
    // warning: comes from buy.js checkout metadata
    const { metadata: { handle } } = session;

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

      if (id) {
        products.push({
          id,
          name,
          note,
          quantity: lineItem.quantity
        });
      }
    }

    const paymentIntent = await stripe
      .paymentIntents
      .retrieve(session.payment_intent, { stripeAccount: stripe_user_id });

    const customer = {
      email: paymentIntent.charges.data[0].billing_details.email,
      name: paymentIntent.charges.data[0].billing_details.name
    };

    // TODO refactor into library, see buy.js when stripeCheckout=false
    const order = {
      customer,
      handle,
      // TODO more notes on how come choosing session.id makes sense here
      id: session.id, // warning: probably globally unique
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
};

const validateHookEvent = async ({ rawBody, signature, stripeHookPrivateKey }) => {

  let event, received;
  try {

    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      stripeHookPrivateKey);

  } catch (error) {

    return { error };
  }

  return { event, received };
};

module.exports = {
  handleHookEvent,
  validateHookEvent
};