const gotHttp = require('got');

const sendStartEmail = async ({ email, handle }) => {

  try {
    await gotHttp.post('https://api.mailgun.net/v3/foodtron9000.com/messages', {
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
    console.log(mailgunError);
    console.log('mailgunError', mailgunError.response.body);
  }
};

module.exports = {
  sendStartEmail
};