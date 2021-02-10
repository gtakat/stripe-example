const express = require('express')
const app = express()
const port = 8080

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

app.set('view engine', 'pug')

app.use(express.json());

const calculateOrderAmount = items => (1400)

app.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd"
  });
  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

app.get('/', (req, res) => {
  // res.send('Hello World!')
  res.render('index')
})

app.get('/bundle.js', (req, res) => {
  res.sendFile('/var/app/dist/bundle.js')
})

app.get('/global.css', (req, res) => {
  res.sendFile('/var/app/css/global.css')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})