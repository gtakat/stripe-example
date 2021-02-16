import {loading, showComplete, showError, clearFormMessage} from './form'
import {loadStripe} from '@stripe/stripe-js';

async function init() {
  const stripe_public_key = process.env.STRIPE_PUBLIC_KEY
  const stripe = await loadStripe(stripe_public_key)
  
  document.querySelector("button").disabled = true

  fetch("/card/setup-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  })
    .then(function(result) {
      return result.json()
    })
    .then(function(result) {
      console.log(result)
      if (result.error) {
        showError(`${result.error.type} : ${result.error.raw.message}`)
      } else {
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
        const form = document.getElementById("card-form")
        form.addEventListener("submit", function(event) {
          event.preventDefault()
          registerCard(stripe, card, result.intent.client_secret)
        })
      }
    })
}

const registerCard = async function(stripe, card, clientSecret) {

  clearFormMessage()

  const customerId = document.querySelector("#customer-id").value
  if (!customerId) {
    showError(`Invalid customer id: ${customerId}`)
    return
  }

  loading(true)

  try {    
    await stripe
      .confirmCardSetup(clientSecret, {
        payment_method: {
          card: card
        }
      })
      .then(function(result) {
        if (result.error) {
          showError(result.error.message);
        } else {
          attachCard(stripe, {
            customer_id: customerId,
            payment_method_id: result.setupIntent.payment_method
          })
        }
      })
  } catch (e) {
    showError(e)
  }
}

const attachCard = async function(stripe, payload)
{
  console.log(payload)
  
  await fetch("/card/attach-payment-to-customer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customer_id: payload.customer_id,
      payment_method_id: payload.payment_method_id
    })
  })
    .then(function(result) {
      return result.json()
    })
    .then(function(result) {
      console.log(result)
      if (result.error) {
        showError(`${result.error.type} : ${result.error.raw.message}`)
      } else {
        showComplete(`payment_method_id : ${result.payment_method.id}`)
      }
    })
}

window.addEventListener('DOMContentLoaded', (event) => {
  init()
})