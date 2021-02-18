const express = require('express');
const { subscribe } = require('./customer');

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const router = express.Router()
router.use(express.json());

router.get('/', (req, res) => {
  res.render('subscription/index')
})

router.post('/create-subscription', async (req, res) => {
  const { customer_id, price_id } = req.body
  let result = {
    subscription: null,
    error: false
  }

  try {
    // default_payment_methodも渡せるが、指定しない場合は
    // customer.invoice_settings.default_payment_methodが使用される
    const subscription = await stripe.subscriptions.create({
      customer: customer_id,
      items: [{ price: price_id }],
      expand: ['latest_invoice.payment_intent']
    })
    result.subscription = subscription
  } catch (e) {
    result.error = e
  }

  res.send(result)
})

module.exports = router