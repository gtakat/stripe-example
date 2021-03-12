const express = require('express')

require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const router = express.Router()
router.use(express.json())

router.get('/', (req, res) => {
  res.render('subscription_cancel/index')
})

router.post('/', async (req, res) => {
  const { subscription_id } = req.body
  let result = {
    subscription: null,
    error: false
  }

  try {
    const subscription = await await stripe.subscriptions.del(subscription_id)
    result.subscription = subscription
  } catch (e) {
    result.error = e
  }

  res.send(result)
})

module.exports = router