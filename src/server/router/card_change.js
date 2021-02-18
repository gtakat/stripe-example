const express = require('express')

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const router = express.Router()
router.use(express.json());

router.get('/', (req, res) => {
  res.render('card_change/index')
})

router.post("/setup-intent", async (req, res) => {
  let result = {
    intent: null,
    error: false
  }

  try {
    const intent = await stripe.setupIntents.create({
      payment_method_types: ['card'],
    })
    result.intent = intent
  } catch (e) {
    result.error = e
  }

  res.send(result)
})

router.post("/update-payment-method", async (req, res) => {
  const { customer_id, payment_method_id, new_payment_method_id } = req.body;
  let result = {
    customer: null,
    payment_method: null,
    error: false
  }

  try {
    // 新しいpayment_methodの紐付け
    const paymentMethod = await stripe.paymentMethods.attach(
      new_payment_method_id,
      {customer: customer_id}
    )
    result.payment_method = paymentMethod
  
    // デフォルトカード設定
    const customer = await stripe.customers.update(
      customer_id,
      {
        invoice_settings: {
          default_payment_method: new_payment_method_id
        }
      }
    )
    result.customer = customer

    // 古いpayment_methodをデタッチ
    await stripe.paymentMethods.detach(
      payment_method_id
    )
  } catch (e) {
    result.error = e
  }
  
  res.send(result)
})

module.exports = router
