import {loading, showComplete, showError, clearFormMessage} from './form'
import {loadStripe} from '@stripe/stripe-js';

async function init() {
  const stripe_public_key = process.env.STRIPE_PUBLIC_KEY
  const stripe = await loadStripe(stripe_public_key)

  const form = document.getElementById("subscription-form")
  form.addEventListener("submit", function(event) {
    event.preventDefault()
    cancel(stripe)
  })
}

const cancel = async function(stripe)
{
  clearFormMessage()

  const subscriptionId = document.querySelector("#subscription-id").value
  if (!subscriptionId) {
    showError(`Invalid customer id: ${subscriptionId}`)
    return
  }

  loading(true)

  await fetch("/subscription_cancel", {
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
      if (result.error) {
        showError(`${result.error.type} : ${result.error.raw.message}`)
      } else {
        showComplete(`result status : ${result.subscription.status}`)
      }
      loading(false)
    })
}

window.addEventListener('DOMContentLoaded', (event) => {
  init()
})