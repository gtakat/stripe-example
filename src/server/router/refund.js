const express = require('express')

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const router = express.Router()

router.get('/', (req, res) => {
  res.render('refund/index')
})

router.post('/', async (req, res) => {
  const { payment_intent_id } = req.body

  const refund = await stripe.refunds.create({
    payment_intent: payment_intent_id
  })

  res.send({result: refund})
})

module.exports = router