export function loading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("button").disabled = true
    document.querySelector("#spinner").classList.remove("hidden")
    document.querySelector("#button-text").classList.add("hidden")
  } else {
    document.querySelector("button").disabled = false
    document.querySelector("#spinner").classList.add("hidden")
    document.querySelector("#button-text").classList.remove("hidden")
  }
}

export function showComplete(message) {
  loading(false)

  const resultMessage = document.querySelector(".result-message")
  resultMessage.textContent = message
}

export function showError(message) {
  loading(false)

  var errorMsg = document.querySelector("#error")
  errorMsg.textContent = message
}

export function clearForm() {
  document.querySelector(".result-message").textContent = ""
  document.querySelector("#error").textContent = ""
}