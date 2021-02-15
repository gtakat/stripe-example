const express = require('express')

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const router = express.Router()

router.get('/', (req, res) => {
  res.render('payment/index')
})

router.post("/setup-intent", async (req, res) => {
  const setupIntent = await stripe.setupIntents.create({
    payment_method_types: ['card'],
  });

  res.send({
    result: setupIntent
  })
})

router.post("/attach-payment-to-customer", async (req, res) => {
  const { payment_method_id } = req.body;

  // customerが存在しない場合は、customerの作成+payment_methodの紐付け+デフォルトカード設定が同時に可能
  const customer = await stripe.customers.create({
    name: "からあげ", 
    payment_method: payment_method_id,
    invoice_settings: {
      default_payment_method: payment_method_id
    }
  })

  // customerがすでに存在する場合はpayment_methodの紐付けを行う

  // payment_methodの紐付け
  // const paymentMethod = await stripe.paymentMethods.attach(
  //   payment_method_id,
  //   {customer: customer.id}
  // )

  // デフォルトカード設定
  // await stripe.customers.update(
  //   customer.id,
  //   {
  //     invoice_settings: {
  //       default_payment_method: payment_method_id
  //     }
  //   }
  // )

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'jpy',
    payment_method_types: ['card'],
    capture_method: 'automatic', 
    // capture_method: 'manual', // デフォルト(automatic)だと caputureの呼び出しは不要
    customer: customer.id,
    payment_method: payment_method_id,
    confirm: true  // falseだとconfirmの呼び出しが必要
  })
  console.log({status: paymentIntent.status})

  // const confirmResult = await stripe.paymentIntents.confirm(paymentIntent.id)
  // console.log({status: confirmResult.status})

  // const caputureResult = await stripe.paymentIntents.capture(paymentIntent.id)
  // console.log({status: caputureResult.status})


  res.send({
    result: paymentIntent
  })
})

module.exports = router
