const express = require('express')

require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const router = express.Router()
router.use(express.json())

router.get('/', (req, res) => {
  res.render('subscription_change_plan/index')
})

router.post('/', async (req, res) => {
  const { subscription_id, price_id } = req.body
  let result = {
    subscription: null,
    error: false
  }

  try {
    let subscription = await stripe.subscriptions.retrieve(subscription_id)

    subscription = await await stripe.subscriptions.update(
      subscription_id,
      {
        cancel_at_period_end: false,
        items: [
          {
            id: subscription.items.data[0].id,
            price: price_id,
          }
        ]
      }
    )

    result.subscription = subscription
  } catch (e) {
    result.error = e
  }

  res.send(result)
})

module.exports = router