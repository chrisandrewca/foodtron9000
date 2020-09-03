const gotHttp = require('got');

const sendCheckoutWithoutStripeAccountEmail = async ({ lineItems, user }) => {
  try {
    await gotHttp.post(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_PRIVATE}`).toString('base64')}`,
      },
      form: {
        from: "Food-Tron 9000 <chris@foodtron9000.com>",
        html: `
          <p>You've got a hungry customer! 🍽</p>
          <ul>
          ${lineItems.map(({ price_data: { product_data: { images, name, metadata: { note } } }, quantity }) =>
          `<li>
            <img height="64px" src="https://${process.env.RUNTIME_DOMAIN}/media/512/${images[0].split('/').pop()}" width="64px" />
            ${name} x${quantity} ${note ? `<b>${note}</b>` : ''}
          </li>`)}
          </ul>
          <p>
            But before you fire up the grill 🔥, you'll need to choose how to collect payments. Accept payments online with our partner Stripe or collect payments through your own means.
          </p>
          <p>
            Visit your profile and swipe down to the <a href='https://${process.env.RUNTIME_DOMAIN}/manage-profile?handle=${user.handle}'>Collect Payments</a> section to get started with Stripe.
          <p>
          <p>
            Hope to see you on board! 🚀
          </p>
          <p>
            Chris from the Food-Tron 9000
          </p>`,
        to: `${user.email}`,
        subject: "Customer wants to place an order",
      }
    });
  } catch (mailgunError) {
    // TODO logging
    console.log(mailgunError);
    console.log('mailgunError', mailgunError.response.body);
  }
};

const sendLoginEmail = async ({ email, handle, loginLink }) => {

  try {
    await gotHttp.post(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_PRIVATE}`).toString('base64')}`,
      },
      form: {
        from: "Food-Tron 9000 <chris@foodtron9000.com>",
        html: `
          <h1>Thanks for logging in ${handle}!</h1>
          <p><a href="${loginLink}">Tap here to visit your profile.</a></p>
          <p>Happy selling 👍</p>`,
        to: `${email}`,
        subject: "Logged in",
      }
    });

  } catch (mailgunError) {
    // TODO logging
    console.log(mailgunError);
    console.log('mailgunError', mailgunError.response.body);
  }
};

// TODO images...?
const sendOrderPlacedEmail = async ({ order: { customer, products }, user }) => {
  try {
    await gotHttp.post(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_PRIVATE}`).toString('base64')}`,
      },
      form: {
        from: "Food-Tron 9000 <chris@foodtron9000.com>",
        html: `
          <p>Order placed by ${customer.name} <${customer.email}></p>
          <ul>
          ${products.map(({ name, note, quantity }) =>
          `<li>
            ${name} x${quantity} ${note ? `<b>${note}</b>` : ''}
          </li>`).join('\n')}
          </ul>
          <p>Thanks for using the Food-Tron 9000, ${user.handle}!</p>`,
        to: `${user.email}`,
        subject: "Order placed",
      }
    });
  } catch (mailgunError) {
    // TODO logging
    console.log(mailgunError);
    console.log('mailgunError', mailgunError.response.body);
  }
};

/*
 * Assumes user been assigned an auth session after signing up.
 */
const sendStartEmail = async ({ email, handle }) => {

  try {
    await gotHttp.post(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_PRIVATE}`).toString('base64')}`,
      },
      form: {
        from: "Chris from Food-Tron 9000 <chris@foodtron9000.com>",
        html: `
          <h1>Welcome ${handle}!</h1>
          <p>Here at the Food-Tron 9000 we believe...</p>
          <p>
            Just kidding!
            <a href='https://${process.env.RUNTIME_DOMAIN}/manage-profile?handle=${handle}'>
              Tap here to visit your profile.
            </a>
          </p>
          <p>
            Anyone in the world (or just your hometown if you prefer) can now
            order your food online. If your new to this congratulations!
            I hope the Food-Tron 9000 lives up to your expectations. Please reach out
            with your questions and feedback at anytime by tapping the reply button.
          </p>
          <p>
            Ready to get paid?
          </p>
          <p>
            Get payments deposited into your bank account through our partner Stripe.
            <a href='https://${process.env.RUNTIME_DOMAIN}/manage-profile?handle=${handle}'>
              Visit your profile to get started.
            </a>
          </p>`,
        to: `${email}`,
        subject: "Welcome! Lets your first sale.",
      }
    });

  } catch (mailgunError) {
    // TODO logging
    console.log(mailgunError);
    console.log('mailgunError', mailgunError.response.body);
  }
};

module.exports = {
  sendCheckoutWithoutStripeAccountEmail,
  sendLoginEmail,
  sendOrderPlacedEmail,
  sendStartEmail
};