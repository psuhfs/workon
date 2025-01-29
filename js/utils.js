const ACCESS_CODE = "ACCESS_CODE"

// TODO: move it to a secure location
const validAccessCodes = [
  "abg6200",
  "ckt5383",
  "mby5247",
  "ijr5083",
  "jva5829",
  "rnb5344",
  "smb8616",
  "pgu5002",
  "jnh5311",
  "axk6243",
  "rjk6127",
  "szm6402",
  "adm6017",
  "man5890",
  "hvp5321",
  "vqp5208",
  "abr6174",
  "rps6236",
  "hww5203",
  "scs6041",
]

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
