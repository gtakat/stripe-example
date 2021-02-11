const express = require('express')
const customer_router = require('./router/customer')
const app = express()
const port = 8080

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

app.set('view engine', 'pug')

app.use(express.json());
app.use(express.static('public'))

const calculateOrderAmount = items => (1400)

app.post("/create-customer", async (req, res) => {
  const { name } = req.body
  console.log(name)

  // const customer = await stripe.customers.create({
  //   name
  // });
  const customer = await stripe.customers.retrieve(
    'cus_IuyjKHylXczk65'
  );

  res.send({
    result: customer
  })
})

app.post("/setup-intent", async (req, res) => {
  const setupIntent = await stripe.setupIntents.create({
    payment_method_types: ['card'],
  });

  res.send({
    result: setupIntent
  })
})

app.post("/attach-paymento-to-customer", async (req, res) => {
  
  // const customer_id = "cus_IuyjKHylXczk65"

  const { payment_method_id } = req.body;

  const customer = await stripe.customers.create({
    name: "吉田 花子2"
  });

  const paymentMethod = await stripe.paymentMethods.attach(
    payment_method_id,
    {customer: customer.id}
  );

  await stripe.customers.update(
    customer.id,
    {
      invoice_settings: {
        default_payment_method: payment_method_id
      }
    }
  )

  res.send({
    result: paymentMethod
  })
})

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

app.use('/customer', customer_router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})