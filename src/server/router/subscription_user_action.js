const express = require('express');

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const router = express.Router()
router.use(express.json());

router.get('/', (req, res) => {
  res.render('subscription_user_action/index')
})

router.post('/retrieve', async (req, res) => {
  const { subscription_id } = req.body
  let result = {
    subscription: null,
    error: false
  }

  try {
    const subscription = await await stripe.subscriptions.retrieve(subscription_id, {
      expand: ['latest_invoice.payment_intent']
    })
    result.subscription = subscription
  } catch (e) {
    result.error = e
  }

  res.send(result)
})

module.exports = router