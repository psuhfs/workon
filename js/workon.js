// HTML IDs
const employeeSearchId = "employee-search"
const selectedPointsId = "selected-points"

function handleSearchEmployee(employeeResponseData) {
    console.log("Employee data:", employeeResponseData)
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
    try {
        const responseEmployees = await fetch(`${BASE_URL}/workon/employees`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getToken()}`
            }
        })
        const employeeResponseData = await responseEmployees.text()
        console.log("Employee data:", employeeResponseData)
        handleSearchEmployee(JSON.parse(employeeResponseData))
    } catch (e) {
        alert("Failed to fetch employee data: " + e)
    }

    document.getElementById("shift-date").addEventListener("change", async function () {
        const selectedDate = this.value
        console.log("Date changed to:", selectedDate)

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

        try {
            const response = await fetch(`${BASE_URL}/workon/employee/${employeeId}/shifts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${getToken()}`
                },
                credentials: "include",
                body: JSON.stringify({date: selectedDate}),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const shiftData = await response.json()
            console.log("Shift data received:", shiftData)
            displayShifts(shiftData, employeeId, selectedDate)
        } catch (error) {
            console.error("Error fetching shifts:", error)
            alert("Failed to fetch shift data")
        }
    })
}

function displayShifts(filteredShifts, employeeId, date) {
    const shiftContainer = document.getElementById("shift-options")
    shiftContainer.innerHTML = ""
    // const filteredShifts = shifts.filter((shift) => shift.EMPLOYEE_NUMBER === employeeId && shift.START_DATE === date)

    if (filteredShifts.length > 0) {
        filteredShifts.forEach((shift) => {
            const shiftItem = document.createElement("div") // Container for each radio and label
            shiftItem.classList.add("shift-item")

            const radio = document.createElement("input")
            radio.type = "button"
            radio.id = shift["SHIFT_ID"]
            radio.name = "shift"
            let textValue = `${shift["START_TIME"]} - ${shift["END_TIME"]} (${shift["POSITION_NAME"]})`
            radio.value = textValue
            console.log(textValue)

            shiftItem.appendChild(radio)
            shiftContainer.appendChild(shiftItem)
            document.getElementById(shift["SHIFT_ID"]).addEventListener("click", function () {
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
        reason: document.getElementById("reason").value,
        comments: document.getElementById("comments").value,
        email: employee.dataset.emails,
        points: parseInt(points),
    }

    try {
        const response = await fetch(`${BASE_URL}/workon/incr`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getToken()}`
            },
            credentials: "include",
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
    document.getElementById("form-content").style.display = "block"
    await searchEmployee()
})
