const express = require('express')

require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const router = express.Router()
router.use(express.json())

router.get('/', (req, res) => {
  const products = require('/var/app/config.json')['products']
  res.render('subscription/index', { products })
})

router.post('/create-subscription', async (req, res) => {
  const { customer_id, price_id, trial_period_days } = req.body
  let result = {
    subscription: null,
    error: false
  }

  const default_tax_rates = require('/var/app/config.json')['default_tax_rates']

  try {
    // default_payment_methodも渡せるが、指定しない場合は
    // customer.invoice_settings.default_payment_methodが使用される
    const params = {
      customer: customer_id,
      items: [{ price: price_id }],
      default_tax_rates: default_tax_rates,
      expand: ['latest_invoice.payment_intent']
    }

    if (trial_period_days && trial_period_days > 0) {
      params.trial_period_days = trial_period_days
    }

    const subscription = await stripe.subscriptions.create(params)
    result.subscription = subscription
  } catch (e) {
    result.error = e
  }

  res.send(result)
})

module.exports = router