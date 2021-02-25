import {loading, showComplete, showError, clearFormMessage} from './form'

async function init() {
  const form = document.getElementById("subscription-form")
  form.addEventListener("submit", function(event) {
    event.preventDefault()
    cancel()
  })
}

const cancel = async function()
{
  clearFormMessage()

  const subscriptionId = document.querySelector("#subscription-id").value
  if (!subscriptionId) {
    showError(`Invalid subscription id: ${subscriptionId}`)
    return
  }

  const promotionCode = document.querySelector("#promotion-code").value
  if (!promotionCode) {
    showError(`Invalid promotion code: ${promotionCode}`)
    return
  }

  loading(true)

  await fetch("/subscription_promotion_code/attach-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      subscription_id: subscriptionId,
      promotion_code: promotionCode
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