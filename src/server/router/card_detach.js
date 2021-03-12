const express = require('express')

require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const router = express.Router()
router.use(express.json())

router.get('/', (req, res) => {
  res.render('card_detach/index')
})

router.post("/", async (req, res) => {
  const { payment_method_id } = req.body
  let result = {
    payment_method: null,
    error: false
  }

  try {
    const payment_method = await stripe.paymentMethods.detach(
      payment_method_id
    )
    result.payment_method = payment_method
  } catch (e) {
    console.log("error")
    console.log(e)
    result.error = e
  }

  res.send(result)
})

module.exports = router