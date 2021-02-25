const express = require('express');

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const router = express.Router()
router.use(express.json());

router.get('/', (req, res) => {
  res.render('subscription_promotion_code/index')
})

router.post('/attach-code', async (req, res) => {
  const { subscription_id, promotion_code } = req.body
  let result = {
    subscription: null,
    error: false
  }

  try {
    const promotionCodes = await stripe.promotionCodes.list({
      code: promotion_code,
      limit: 1
    })
    
    const subscription = await await stripe.subscriptions.update(
      subscription_id,
      {
        promotion_code: promotionCodes.data[0].id
      }
    )

    result.subscription = subscription
  } catch (e) {
    result.error = e
  }

  res.send(result)
})

module.exports = router