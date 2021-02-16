import {loading, showComplete, showError, clearFormMessage} from './form'

async function init() {
  const submitButton = document.querySelector("#submit")
  submitButton.addEventListener('click', refund)
}

window.addEventListener('DOMContentLoaded', (event) => {
  init()
});

async function refund(event) {
  event.preventDefault()

  clearFormMessage()

  const paymentIntentId = document.querySelector("#payment-intent-id").value
  if (!paymentIntentId) {
    showError(`Invalid payment intent id : ${paymentIntentId}`)
    return
  }

  loading(true)
  
  await fetch("/refund", {
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
    .then(function(result) {
      console.log(result)
      if (result.error) {
        showError(`${result.error.type} : ${result.error.raw.message}`)
      } else {
        showComplete(`refund_id : ${result.refund.id}`)
      }
    })
}
