const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  apiAddress: process.env.API_ADDRESS,
  staticResources: process.env.STATIC_RESOURCES,
  port: process.env.PORT,
  tax: process.env.TAX,
  appKeys: [process.env.APP_KEY],
  paypalClientId: process.env.PAYPAL_CLIENT_ID,
  paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  paypalMode: process.env.PAYPAL_MODE,
};
