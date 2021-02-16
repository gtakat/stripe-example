const express = require('express')

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const router = express.Router()
router.use(express.json());

router.get('/', (req, res) => {
  res.render('payment/index')
})

router.post("/payment-intent", async (req, res) => {
  const { customer_id, payment_method_id, amount } = req.body;
  let result = {
    intent: null,
    error: false
  }

  try {
    let intent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'jpy',
      payment_method_types: ['card'],
      capture_method: 'automatic', 
      // capture_method: 'manual', // デフォルト(automatic)だと caputureの呼び出しは不要
      customer: customer_id,
      payment_method: payment_method_id,
      confirm: true  // falseだとconfirmの呼び出しが必要
    })
    console.log({status: intent.status})

    if (intent.status == 'requires_confirmation') {
      intent = await stripe.paymentIntents.confirm(intent.id)
      console.log({status: intent.status})
    }

    if (intent.status == 'requires_capture') {
      intent = await stripe.paymentIntents.capture(intent.id)
      console.log({status: intent.status})
    }

    result.intent = intent
  } catch (e) {
    result.error = e
  }

  res.send(result)
})

module.exports = router
