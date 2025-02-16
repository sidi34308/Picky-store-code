const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const sendWhatsAppMessage = (to, body) => {
  client.messages
    .create({
      body: body,
      from: "whatsapp:+14155238886", // Your Twilio WhatsApp number
      to: `whatsapp:${to}`,
    })
    .then((message) => console.log(message.sid))
    .catch((error) => console.error(error));
};

module.exports = { sendWhatsAppMessage };
