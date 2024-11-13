const BASE_URL = "https://www7.whentowork.com"

// HTML IDs
const employeeSearchId = "employee-search"
const selectedPointsId = "selected-points"

function handleSearchEmployee(employeeResponseData) {
  let employeeSearchElement = document.getElementById(employeeSearchId)

  let employeeList = employeeResponseData["EmployeeList"]

  function toggleEmployeeIdField(show) {
    const employeeIdContainer = document.getElementById("employee-id-container")
    employeeIdContainer.style.display = show ? "block" : "none"
  }

  document.getElementById(employeeSearchId).addEventListener("input", function () {
    const searchValue = this.value.toLowerCase()
    const resultsContainer = document.getElementById("employee-results")
    resultsContainer.innerHTML = ""

    if (searchValue === "") {
      return
    }
    for (const employee of employeeList) {
      let fullName = `${employee.FIRST_NAME} ${employee.LAST_NAME}`

      if (fullName.toLowerCase().includes(searchValue)) {
        const resultItem = document.createElement("div")
        resultItem.classList.add("result-item")
        resultItem.textContent = fullName
        resultItem.dataset.employeeId = employee.EMPLOYEE_NUMBER

        resultItem.addEventListener("click", function () {
          employeeSearchElement.value = fullName
          employeeSearchElement.dataset.employeeId = employee.EMPLOYEE_NUMBER
          employeeSearchElement.dataset.emails = employee.EMAILS
          if (!employee.EMPLOYEE_NUMBER) {
            toggleEmployeeIdField(true)
          } else {
            toggleEmployeeIdField(false)
          }

          resultsContainer.innerHTML = ""
        })

        resultsContainer.appendChild(resultItem)
      }
    }
  })

  const searchInput = document.getElementById(employeeSearchId)
  const resultsContainer = document.getElementById("employee-results")
  let selectedIndex = -1

  function updateSelection(items, selectedIndex) {
    Array.from(items).forEach((item, index) => {
      item.classList.toggle("selected", index === selectedIndex)
    })
  }

  searchInput.addEventListener("keydown", function (event) {
    const items = resultsContainer.getElementsByClassName("result-item")

    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (selectedIndex < items.length - 1) {
        selectedIndex++
        updateSelection(items, selectedIndex)
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      if (selectedIndex > 0) {
        selectedIndex--
        updateSelection(items, selectedIndex)
      }
    } else if (event.key === "Enter") {
      event.preventDefault()
      if (selectedIndex > -1 && items[selectedIndex]) {
        items[selectedIndex].click() // Simulate click on selected item
      }
    }
  })
}

async function searchEmployee() {
  function formatDate(dateString) {
    const [year, month, day] = dateString.split("-")
    return `${month}/${day}/${year}`
  }

  try {
    const responseEmployees = await fetch(
      `${BASE_URL}/cgi-bin/w2wG3.dll/api/EmployeeList?key=G042D1B58-7BA2233F1F3248279DCB30F1C5AE221D`,
    )
    const employeeResponseData = await responseEmployees.json()
    handleSearchEmployee(employeeResponseData)

    // TODO: drop listener
    document.getElementById("shift-date").addEventListener("change", async function () {
      const selectedDate = this.value
      console.log("Date changed to:", selectedDate)
      const formattedDate = formatDate(selectedDate)

      const responseShifts = await fetch(
        `${BASE_URL}/cgi-bin/w2wG3.dll/api/AssignedShiftList?start_date=${formattedDate}&end_date=${formattedDate}&key=G042D1B58-7BA2233F1F3248279DCB30F1C5AE221D`,
      )
      const shiftResponseData = await responseShifts.json()

      let employeeSearch = document.getElementById(employeeSearchId).dataset
      let employeeId = employeeSearch.employeeId
      if (!employeeId) {
        let employeeIdInput = document.getElementById("employee-id-container")
        if (!employeeIdInput.value) {
          alert("Please enter an employee ID")
          return
        }
        employeeId = employeeIdInput.value
      }

      displayShifts(shiftResponseData || [], employeeId, formattedDate)
    })
  } catch (error) {
    alert("Failed to fetch employee data")
  }
}

function displayShifts(data, employeeId, date) {
  let shifts = data["AssignedShiftList"]

  const shiftContainer = document.getElementById("shift-options")
  shiftContainer.innerHTML = ""
  const filteredShifts = shifts.filter((shift) => shift.EMPLOYEE_NUMBER === employeeId && shift.START_DATE === date)

  if (filteredShifts.length > 0) {
    filteredShifts.forEach((shift) => {
      const shiftItem = document.createElement("div") // Container for each radio and label
      shiftItem.classList.add("shift-item")

      const radio = document.createElement("input")
      radio.type = "button"
      radio.id = shift.SHIFT_ID
      radio.name = "shift"
      let textValue = `${shift.START_TIME} - ${shift.END_TIME} (${shift.POSITION_NAME})`
      radio.value = textValue

      shiftItem.appendChild(radio)
      shiftContainer.appendChild(shiftItem)
      document.getElementById(shift.SHIFT_ID).addEventListener("click", function () {
        let employeeSearchElement = document.getElementById(employeeSearchId)
        employeeSearchElement.dataset.shiftTime = textValue
        radio.style.backgroundColor = "#007BFF"
        radio.style.color = "#fff"
      })
    })
  } else {
    shiftContainer.textContent = "No shifts found. Enter shift details below:"
  }
}

function selectReason(button) {
  const reasonButtons = document.querySelectorAll(".reason-button")

  reasonButtons.forEach((btn) => btn.classList.remove("selected"))

  button.classList.add("selected")

  document.getElementById("reason").value = button.innerText

  const points = button.getAttribute("points")
  if (points) {
    document.getElementById("selected-points").value = points
  }
}

async function handleSubmit() {
  let points = document.getElementById("selected-points").value
  const employee = document.getElementById(employeeSearchId)

  let employeeId = employee.dataset.employeeId
  if (!employeeId) {
    let employeeIdInput = document.getElementById("employee-id-container")
    if (!employeeIdInput.value) {
      alert("Please enter an employee ID")
      return
    }
    employeeId = employeeIdInput.value
  }

  const formData = {
    accessCode: getCookie(ACCESS_CODE),
    employeeName: employee.value,
    employeeId: employeeId,
    shiftDate: document.getElementById("shift-date").value,
    selectedShift: employee.dataset.shiftTime,
    manualShift: document.getElementById("manual-shift").value,
    reason: document.getElementById("reason").value,
    comments: document.getElementById("comments").value,
    email: employee.dataset.emails,
    points: points,
  }

  try {
    const response = await fetch("/submit.php", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      alert("Submission successful!")
    } else {
      console.error("Submission failed:", response.statusText)
    }
  } catch (error) {
    console.error("Error submitting form:", error)
  }
}

// TODO: drop this
document.addEventListener("DOMContentLoaded", async function () {
  document.getElementById("points-form").reset()
  let access_code = getCookie(ACCESS_CODE)

  if (access_code && validAccessCodes.includes(access_code)) {
    await searchEmployee()
    document.getElementById("form-content").style.display = "block"
  } else {
    alert("Invalid access code, redirecting to auth page")
    document.location.href = "/"
  }
})
