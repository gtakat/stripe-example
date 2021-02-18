const express = require('express')

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const router = express.Router()
router.use(express.json());

router.get('/', (req, res) => {
  res.render('refund/index')
})

router.post('/', async (req, res) => {
  const { payment_intent_id } = req.body
  let result = {
    refund: null,
    error: false
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: payment_intent_id
    })
    result.refund = refund
  } catch (e) {
    result.error = e
  }

  res.send(result)
})

module.exports = router