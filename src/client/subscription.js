import {loading, showComplete, showError, clearFormMessage} from './form'
import {loadStripe} from '@stripe/stripe-js'

async function init() {
  const stripe_public_key = process.env.STRIPE_PUBLIC_KEY
  const stripe = await loadStripe(stripe_public_key)

  const form = document.getElementById("subscription-form")
  form.addEventListener("submit", function(event) {
    event.preventDefault()
    subscribeProduct(stripe)
  })
}

const subscribeProduct = async function(stripe)
{
  clearFormMessage()

  const customerId = document.querySelector("#customer-id").value
  if (!customerId) {
    showError(`Invalid customer id: ${customerId}`)
    return
  }

  const priceId = document.querySelector("#plan").value
  if (!priceId) {
    showError(`Invalid plan: ${priceId}`)
    return
  }

  const trialPeriodDays = document.querySelector("#trial-period-days").value
  
  loading(true)

  await fetch("/subscription/create-subscription", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customer_id: customerId,
      price_id: priceId,
      trial_period_days: trialPeriodDays
    })
  })
    .then(function(result) {
      return result.json()
    })
    .then(function(result) {
      console.log(result)
      if (result.error) {
        showError(`${result.error.type} : ${result.error.raw.message}`)
      } else if (result.subscription.status == 'active') {
        showComplete(`subscription_id: ${result.subscription.id}`)
      } else if (result.subscription.status == 'incomplete') {
        if (result.subscription.latest_invoice.payment_intent.status == "requires_action") {
          showComplete(`subscription_id: ${result.subscription.id}`)
          showError('23時間以内にユーザのアクションが必要です')
        } else {
          showError('unknown payment_intent status')
        }
      } else if (result.subscription.status == 'trialing') {
        showComplete(`subscription_id: ${result.subscription.id}`)
      } else {
        showError('unknown subscription status')
      }
      loading(false)
    })
}

window.addEventListener('DOMContentLoaded', (event) => {
  init()
})