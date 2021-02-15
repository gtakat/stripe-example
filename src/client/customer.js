import {loadStripe} from '@stripe/stripe-js';

async function init() {
  const stripe_public_key = process.env.STRIPE_PUBLIC_KEY
  const stripe = await loadStripe(stripe_public_key)
  console.log(stripe)

  const submitButton = document.querySelector("#submit")
  submitButton.addEventListener('click', createCustomer)
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

async function createCustomer(event) {
  event.preventDefault();

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
    .then(function(data) {
      console.log(data)
    })
}