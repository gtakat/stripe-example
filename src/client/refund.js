import {loadStripe} from '@stripe/stripe-js';

async function init() {
  const stripe_public_key = process.env.STRIPE_PUBLIC_KEY
  const stripe = await loadStripe(stripe_public_key)
  console.log(stripe)

  const submitButton = document.querySelector("#submit")
  submitButton.addEventListener('click', refund)
}

const showError = function(errorMsgText) {
  loading(false);
  var errorMsg = document.querySelector("#error");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};

const loading = function(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};

window.addEventListener('DOMContentLoaded', (event) => {
  init()
});

async function refund(event) {
  event.preventDefault();

  const paymentIntentId = document.querySelector("#payment-intent-id").value
  if (!paymentIntentId) {
    showError(`Invalid payment intent id : ${paymentIntentId}`)
    return
  }

  loading(true)
  
  fetch("/refund", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      payment_intent_id: paymentIntentId
    })
  })
    .then(function(result) {
      return result.json()
    })
    .then(function(data) {
      console.log(data)
    })
}