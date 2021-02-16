const express = require('express')

require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const router = express.Router()
router.use(express.json());

router.get('/', (req, res) => {
  res.render('customer/index')
})

router.post("/", async (req, res) => {
  const { name } = req.body
  let result = {
    customer: null,
    error: false
  }

  try {
    const customer = await stripe.customers.create({
      name
    })
    result.customer = customer
  } catch (e) {
    result.error = e
  }

  res.send(result)
})

module.exports = router