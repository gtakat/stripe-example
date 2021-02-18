import {loading, showComplete, showError, clearFormMessage} from './form'

async function init() {
  const form = document.getElementById("subscription-form")
  form.addEventListener("submit", function(event) {
    event.preventDefault()
    changePlan()
  })
}

const changePlan = async function()
{
  clearFormMessage()

  const subscriptionId = document.querySelector("#subscription-id").value
  if (!subscriptionId) {
    showError(`Invalid subscription id: ${subscriptionId}`)
    return
  }

  const priceId = document.querySelector("#plan").value
  if (!priceId) {
    showError(`Invalid plan: ${priceId}`)
    return
  }

  loading(true)

  await fetch("/subscription_change_plan", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      subscription_id: subscriptionId,
      price_id: priceId
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
        showComplete(`result status : ${result.subscription.status}`)
      }
      loading(false)
    })
}

window.addEventListener('DOMContentLoaded', (event) => {
  init()
})