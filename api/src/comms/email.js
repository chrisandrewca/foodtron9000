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
          <p>An cws has been placed by TODO</p>
          <ul>
          ${lineItems.map(({ price_data: { product_data: { images, name, metadata: { note } } }, quantity }) =>
          `<li>
            <img height="72px" src="https://${process.env.RUNTIME_DOMAIN}/media/72/${images[0].split('/').pop()}" width="72px" />
            ${name} x${quantity} ${note ? `<b>${note}</b>` : ''}
          </li>`)}
          </ul>
          <p>TODO incentive text</p>
          <p>Signup with stripe account direct link</p>`,
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
          <p><a href="${loginLink}">Tap here to visit your dashboard.</a></p>
          <p>Happy selling 🤗</p>`,
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
            <a href='https://${process.env.RUNTIME_DOMAIN}'>
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
            <a href='https://${process.env.RUNTIME_DOMAIN}/dashboard'>
              Tap here to connect your bank account.
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