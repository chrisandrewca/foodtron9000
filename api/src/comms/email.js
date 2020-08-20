const gotHttp = require('got');

const sendOrderPlacedEmail = async ({ customer, productsOrdered, user }) => {
  try {
    await gotHttp.post(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_PRIVATE}`).toString('base64')}`,
      },
      form: {
        from: "Chris from Food-Tron 9000 <chris@foodtron9000.com>",
        html: `
          <p>An order has been placed by ${customer.email}</p>
          <ul>
            ${productsOrdered}
          </ul>`,
        to: `${user.email}`,
        subject: "Order from Food-Tron 9000",
      }
    });
  } catch (mailgunError) {
    // TODO logging
    console.log(mailgunError);
    console.log('mailgunError', mailgunError.response.body);
  }
};

const sendCheckoutWithoutStripeAccountEmail = async ({ user }) => {
  try {
    await gotHttp.post(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${process.env.MAILGUN_PRIVATE}`).toString('base64')}`,
      },
      form: {
        from: "Chris from Food-Tron 9000 <chris@foodtron9000.com>",
        html: `
          <p>An cws has been placed by TODO</p>
          <p>TODO incentive text</p>
          <p>Signup with stripe account direct link</p>`,
        to: `${user.email}`,
        subject: "TODO cws from Food-Tron 9000",
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
  sendOrderPlacedEmail,
  sendCheckoutWithoutStripeAccountEmail,
  sendStartEmail
};