import {loading, showComplete, showError, clearForm} from './form'

async function init() {
  const submitButton = document.querySelector("#submit")
  submitButton.addEventListener('click', createCustomer)
}

window.addEventListener('DOMContentLoaded', (event) => {
  init()
})

async function createCustomer(event) {
  event.preventDefault();

  clearForm()

  const userName = document.querySelector("#user-name").value
  if (!userName) {
    showError(`Invalid user name: ${userName}`)
    return
  }

  loading(true)

  fetch("/customer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: userName
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
        showComplete(`customer_id : ${result.customer.id}`)
      }
    })
}
