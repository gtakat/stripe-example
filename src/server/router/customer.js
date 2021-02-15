const express = require('express')

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const router = express.Router()

router.get('/', (req, res) => {
  res.render('customer/index')
})

router.post("/", async (req, res) => {
  const { name } = req.body

  const customer = await stripe.customers.create({
    name
  })

  res.send({
    result: customer
  })
})

module.exports = router