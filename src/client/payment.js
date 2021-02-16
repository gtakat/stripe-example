import {loading, showComplete, showError, clearForm} from './form'
import {loadStripe} from '@stripe/stripe-js';

async function init() {
  const stripe_public_key = process.env.STRIPE_PUBLIC_KEY
  const stripe = await loadStripe(stripe_public_key)
  
  document.querySelector("button").disabled = true

  fetch("/payment/setup-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  })
    .then(function(result) {
      return result.json()
    })
    .then(function(data) {
      const elements = stripe.elements();
      const style = {
        base: {
          color: "#32325d",
          fontFamily: 'Arial, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#32325d"
          }
        },
        invalid: {
          fontFamily: 'Arial, sans-serif',
          color: "#fa755a",
          iconColor: "#fa755a"
        }
      }
      const card = elements.create("card", { 
        hidePostalCode: true,
        style: style 
      })
      card.mount("#card-element");
      card.on("change", function (event) {
        document.querySelector("button").disabled = event.empty
        document.querySelector("#error").textContent = event.error ? event.error.message : ""
      })
      const form = document.getElementById("payment-form")
      form.addEventListener("submit", function(event) {
        event.preventDefault()
        registerCard(stripe, card, data.result.client_secret)
      })
    })
}

const registerCard = function(stripe, card, clientSecret) {
  console.log("card")
  console.log(card)
  loading(true)
  stripe
    .confirmCardSetup(clientSecret, {
      payment_method: {
        card: card
      }
    })
    .then(function(result) {
      console.log("card register result")
      console.log(result)
      if (result.error) {
        showError(result.error.message);
      } else {
        attachCard(stripe, result.setupIntent.payment_method)
      }
    })
}

const attachCard = function(stripe, paymentMethodId)
{
  fetch("/payment/attach-payment-to-customer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      // payment_method_id: paymentMethod.id
      payment_method_id: paymentMethodId
    })
  })
    .then(function(result) {
      return result.json()
    })
    .then(function(data) {
      console.log(data)
      if (data.result.status == 'requires_action') {
        handleCardAction(stripe, data.result)
      } else {
        console.log("done")
      }
    })
}

const handleCardAction = function(stripe, intent) {
  console.log("handleCardAction")
  console.log(intent)
  stripe.confirmCardPayment(
    intent.client_secret
  ).then(function(actionResult) {
    console.log(actionResult)
  })
}

window.addEventListener('DOMContentLoaded', (event) => {
  init()
})