import {loading, showComplete, showError, clearFormMessage} from './form'

async function init() {
  const submitButton = document.querySelector("#submit")
  submitButton.addEventListener('click', createCustomer)
}

window.addEventListener('DOMContentLoaded', (event) => {
  init()
})

async function createCustomer(event) {
  event.preventDefault()

  clearFormMessage()

  const paymentMethodId = document.querySelector("#payment-method-id").value
  if (!paymentMethodId) {
    showError(`Invalid payment id: ${paymentMethodId}`)
    return
  }

  loading(true)

  await fetch("/card_detach", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      payment_method_id: paymentMethodId
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
        showComplete('success')
      }
      loading(false)
    })
}
