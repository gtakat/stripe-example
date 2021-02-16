const { request } = require('express');
const express = require('express')
const customer_router = require('./router/customer')
const card_router = require('./router/card')
const payment_router = require('./router/payment')
const refund_router = require('./router/refund')
const stripe_webhook_router = require('./router/stripe_webhook')

const app = express()
const port = 8080

// CSP
// app.use(function(req, res, next) {
//   res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com; script-src 'self' 'unsafe-eval' https://js.stripe.com; form-action 'self' https://stripe.com https://hooks.stripe.com")
//   next()
// })

app.set('view engine', 'pug')

app.use(express.static('public'))

// routing
app.use('/customer', customer_router)
app.use('/card', card_router)
app.use('/payment', payment_router)
app.use('/refund', refund_router)
app.use('/stripe_webhook', stripe_webhook_router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})