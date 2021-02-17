import {loading, showComplete, showError, clearFormMessage} from './form'
import {loadStripe} from '@stripe/stripe-js';

async function init() {
  const stripe_public_key = process.env.STRIPE_PUBLIC_KEY
  const stripe = await loadStripe(stripe_public_key)

  const form = document.getElementById("subscription-form")
  form.addEventListener("submit", function(event) {
    event.preventDefault()
    confirm(stripe)
  })
}

const confirm = async function(stripe)
{
  clearFormMessage()

  const subscriptionId = document.querySelector("#subscription-id").value
  if (!subscriptionId) {
    showError(`Invalid subscription id: ${subscriptionId}`)
    return
  }

  loading(true)

  await fetch("/subscription_user_action/retrieve", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      subscription_id: subscriptionId
    })
  })
    .then(function(result) {
      return result.json()
    })
    .then(function(result) {
      console.log(result)
      if (result.error) {
        showError(`${result.error.type} : ${result.error.raw.message}`)
      } else if (result.subscription.status == 'incomplete') {
        if (result.subscription.latest_invoice.payment_intent.status == "requires_action") {
          userAction(stripe, result.subscription.latest_invoice.payment_intent)
        } else {
          showError('unknown payment_intent status')
        }
      } else {
        showError('unknown subscription status')
      }
      loading(false)
    })
}

const userAction = async function(stripe, paymentIntent)
{
  await stripe
    .confirmCardPayment(paymentIntent.client_secret, {
      payment_method: paymentIntent.payment_method,
    })
    .then((result) => {
      console.log(result)
      if (result.error) {
        showError(`${result.error.type} : ${result.error.raw.message}`)
      } else {
        showComplete(`status : ${result.status}`)
      }
    })
}

window.addEventListener('DOMContentLoaded', (event) => {
  init()
})