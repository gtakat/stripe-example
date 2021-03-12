const express = require('express')

require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const router = express.Router()
router.use(express.json())

router.get('/', (req, res) => {
  res.render('subscription_staged_price/index')
})

router.post('/update-unit-amount', async (req, res) => {
  const { subscription_id, unit_amount } = req.body
  let result = {
    usage_record: null,
    error: false
  }

  try {
    const subscriptionItems = await await stripe.subscriptionItems.list({
      subscription: subscription_id
    })

    console.log(subscriptionItems.data[0].plan)

    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      subscriptionItems.data[0].id,
      {
        quantity: unit_amount, 
        timestamp: Math.floor(Date.now() / 1000),
        action: 'set'
      }
    )

    result.usage_record = usageRecord
  } catch (e) {
    result.error = e
  }

  res.send(result)
})

module.exports = router