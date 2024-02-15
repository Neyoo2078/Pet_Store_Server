const express = require('express');
const app = express();
const cors = require('cors');
// This is your test secret API key.
const stripe = require('stripe')(
  'sk_test_51ObkXbDgUYFhmYhX8OP5ChxuQQd3LiRrfpnDqfvEw3gaymJ1N4JiRAt3gbbcvr9OZNdR4FRUwV0e37yrjRRxf3FH00cFc0WFhV'
);

app.use(express.static('public'));
app.use(express.json());
// Enable CORS for all routes
app.use(cors({ origin: 'http://localhost:3000' }));

const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client

  const Total = items.reduce((a, b) => {
    return (a += b.quantity * b.price);
  }, 0);
  return Total + 15;
};

app.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'usd',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    Amount: paymentIntent.amount,
  });
});

app.listen(5000, () => console.log('Node server listening on port 5000!'));
