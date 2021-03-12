const express = require('express')

require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const router = express.Router()
router.use(express.json())

router.get('/', (req, res) => {
  res.render('card/index')
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

router.post("/attach-payment-to-customer", async (req, res) => {
  const { customer_id, payment_method_id } = req.body
  let result = {
    customer: null,
    payment_method: null,
    error: false
  }

  // customerが存在しない場合は、customerの作成+payment_methodの紐付け+デフォルトカード設定が同時に可能
  // const customer = await stripe.customers.create({
  //   name: "帆立 太郎", 
  //   payment_method: payment_method_id,
  //   invoice_settings: {
  //     default_payment_method: payment_method_id
  //   }
  // })

  // customerがすでに存在する場合はpayment_methodの紐付けを行う

  try {
    // payment_methodの紐付け
    const paymentMethod = await stripe.paymentMethods.attach(
      payment_method_id,
      {customer: customer_id}
    )
    result.payment_method = paymentMethod
  
    // デフォルトカード設定
    const customer = await stripe.customers.update(
      customer_id,
      {
        invoice_settings: {
          default_payment_method: payment_method_id
        }
      }
    )
    result.customer = customer
  } catch (e) {
    result.error = e
  }
console.log(result)
  res.send(result)
})

module.exports = router
