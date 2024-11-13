const ACCESS_CODE = "ACCESS_CODE"

// TODO: move it to a secure location
const validAccessCodes = ["abg6200", "ckt5383"]

function getCookie(name) {
  const cookies = document.cookie.split("; ")
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=")
    if (key === decodeURIComponent(name)) {
      return decodeURIComponent(value)
    }
  }
  return ""
}

// TODO: Switch to secure cookies
function setCookie(name, value) {
  document.cookie = `${name}=${value}`
}
