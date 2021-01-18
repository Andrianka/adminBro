// eslint-disable-next-line @typescript-eslint/no-var-requires
const Stripe = require('stripe');
export const stripe = Stripe(process.env.STRIPE_SECRET);
