const { request } = require('express');
const express = require('express')
const customer_router = require('./router/customer')
const card_router = require('./router/card')
const card_change_router = require('./router/card_change')
const card_detach_router = require('./router/card_detach')
const payment_router = require('./router/payment')
const refund_router = require('./router/refund')
const subscription_router = require('./router/subscription')
const subscription_user_action_router = require('./router/subscription_user_action')
const subscription_cancel_router = require('./router/subscription_cancel')
const subscription_change_plan_router = require('./router/subscription_change_plan')
const subscription_staged_price_router = require('./router/subscription_staged_price')
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
app.use('/card_change', card_change_router)
app.use('/card_detach', card_detach_router)
app.use('/payment', payment_router)
app.use('/refund', refund_router)
app.use('/subscription', subscription_router)
app.use('/subscription_user_action', subscription_user_action_router)
app.use('/subscription_cancel', subscription_cancel_router)
app.use('/subscription_change_plan', subscription_change_plan_router)
app.use('/subscription_staged_price', subscription_staged_price_router)
app.use('/stripe_webhook', stripe_webhook_router)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})