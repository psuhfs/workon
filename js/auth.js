// Global BASE_URL
// const BASE_URL = 'https://hfs.ssdd.dev';
const BASE_URL = "http://localhost:3000"

// Function to display error message
function displayError(message) {
  console.log(message)
  const errorElement = document.getElementById("error-message")
  if (errorElement) {
    errorElement.textContent = message
    errorElement.style.display = "block"
  } else {
    console.error("Error element not found in the DOM")
  }
}

// Function to check if user is authenticated
async function isAuthenticated() {
  try {
    let token = document.cookie.split("=")[1]
    console.log(token)
    const response = await fetch(`${BASE_URL}/auth/authenticated`, {
      method: "POST",
      credentials: "include",
    })

    if (response.ok) {
      return true
    } else {
      // Remove the token from cookies
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      // Re-initiate auth (redirect to login page or show login form)
      redirect("/")
      return false
    }
  } catch (error) {
    console.error("Error checking authentication:", error)
    // In case of error, we assume the user is not authenticated
    return false
  }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", async function () {
  // Check authentication status on page load
  let authenticated = await isAuthenticated()
  console.log("Authenticated:", authenticated)
  if (authenticated) {
    console.log("User is already authenticated")
    redirect("/app")
  }
})

function redirect(route) {
  if (`${route}/` !== document.location.pathname && `${route}` !== document.location.pathname) {
    document.location.href = route
  }
}
