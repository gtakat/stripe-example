const express = require('express')

// require('dotenv').config();
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2020-08-27',
// })

const router = express.Router()
// router.use(express.json());

router.get('/', (req, res) => {
  res.render('index')
})

module.exports = router