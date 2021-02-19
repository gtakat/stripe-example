import {loading, showComplete, showError, clearFormMessage} from './form'
import {loadStripe} from '@stripe/stripe-js';

async function init() {
  const stripe_public_key = process.env.STRIPE_PUBLIC_KEY
  const stripe = await loadStripe(stripe_public_key)

  const form = document.getElementById("payment-form")
  form.addEventListener("submit", function(event) {
    event.preventDefault()
    pay(stripe)
  })
}

const pay = async function(stripe)
{
  clearFormMessage()

  const customerId = document.querySelector("#customer-id").value
  if (!customerId) {
    showError(`Invalid customer id: ${customerId}`)
    return
  }

  const paymentMethodId = document.querySelector("#payment-method-id").value
  if (!paymentMethodId) {
    showError(`Invalid payment id: ${paymentMethodId}`)
    return
  }

  const amount = document.querySelector("#amount").value
  if (!amount) {
    showError(`Invalid amount: ${amount}`)
    return
  }

  loading(true)

  await fetch("/payment/payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customer_id: customerId,
      payment_method_id: paymentMethodId,
      amount: amount
    })
  })
    .then(function(result) {
      return result.json()
    })
    .then(function(result) {
      console.log(result)
      if (result.error) {
        showError(`${result.error.type} : ${result.error.raw.message}`)
      } else if (result.intent.status == 'succeeded') {
        showComplete(`payment_intent_id: ${result.intent.id}`)
        loading(false)
      } else if (result.intent.status == 'requires_action') {
        handleCardAction(stripe, result.intent)
      } else {
        showError(`Error: ${result.intent.status}`)
      }
    })
}

const handleCardAction = async function(stripe, intent) {
  console.log("handleCardAction")
  await stripe.confirmCardPayment(
    intent.client_secret
  ).then(function(result) {
    console.log(result)
    if (result.error) {
      showError(result.error.message)
    } else {
      showComplete(`payment_intent_id: ${result.paymentIntent.id}`)
    }
    loading(false)
  })
}

window.addEventListener('DOMContentLoaded', (event) => {
  init()
})