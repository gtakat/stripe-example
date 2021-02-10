import {loadStripe} from '@stripe/stripe-js';

async function init() {
  const stripe_public_key = process.env.STRIPE_PUBLIC_KEY
  const stripe = await loadStripe(stripe_public_key)
  console.log(stripe)

  const purchase = {
    items: [{ id: "xl-tshirt" }]
  };
  
  document.querySelector("button").disabled = true

  // fetch("/create-customer", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({
  //     name: "鈴木 二郎"
  //   })
  // })
  //   .then(function(result) {
  //     return result.json()
  //   })
  //   .then(function(data) {
  //     console.log(data)
  //   })

  fetch("/setup-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({})
  })
    .then(function(result) {
      return result.json()
    })
  //   .then(function(data) {
  //     console.log(data)
  //   })

  // fetch("/create-payment-intent", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(purchase)
  // })
  //   .then(function(result) {
  //     return result.json();
  //   })
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
      };
      const card = elements.create("card", { style: style });
      card.mount("#card-element");
      card.on("change", function (event) {
        document.querySelector("button").disabled = event.empty;
        document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
      });
      const form = document.getElementById("payment-form");
      form.addEventListener("submit", function(event) {
        event.preventDefault();
        // payWithCard(stripe, card, data.clientSecret);
        console.log(888)
        console.log(data)
        registerCard(stripe, card, data.result.client_secret)
      });
    });
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
    });

  // stripe
  //   .createPaymentMethod({
  //     type: 'card',
  //     card: card,
  //   })
  //   .then(function(result) {
  //     console.log("card register result")
  //     console.log(result)
  //     if (result.error) {
  //       showError(result.error.message);
  //     } else {
  //       // orderComplete(result.setupIntent.id);
  //       attachCard(stripe, result.paymentMethod)
  //     }
  //   });
}

const attachCard = function(stripe, paymentMethodId)
{
  fetch("/attach-paymento-to-customer", {
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
    })
}

const payWithCard = function(stripe, card, clientSecret) {
  loading(true);
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card
      }
    })
    .then(function(result) {
      if (result.error) {
        // Show error to your customer
        showError(result.error.message);
      } else {
        // The payment succeeded!
        orderComplete(result.paymentIntent.id);
      }
    });
};

const orderComplete = function(paymentIntentId) {
  loading(false);
  document
    .querySelector(".result-message a")
    .setAttribute(
      "href",
      "https://dashboard.stripe.com/test/payments/" + paymentIntentId
    );
  document.querySelector(".result-message").classList.remove("hidden");
  document.querySelector("button").disabled = true;
};

const showError = function(errorMsgText) {
  loading(false);
  var errorMsg = document.querySelector("#card-error");
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