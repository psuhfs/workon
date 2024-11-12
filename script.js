// Array for valid access codes
const validAccessCodes = ["abg6200", "ckt5383"];

// Function to show form if access code is valid
function validateAccessCode() {
  console.log("Validating access code...");
  const accessCode = document.getElementById("access-code").value;
  const formContent = document.getElementById("form-content");
  formContent.style.display = validAccessCodes.includes(accessCode)
    ? "block"
    : "none";
}

// Fetch employees and populate dropdown
async function fetchEmployees() {
  try {
    const response = await fetch(
      "https://www7.whentowork.com/cgi-bin/w2wG3.dll/api/EmployeeList?key=G042D1B58-7BA2233F1F3248279DCB30F1C5AE221D"
    );
    const data = await response.json();
    populateDropdown(data.EmployeeList || []);
  } catch (error) {
    console.error("Error fetching employee data:", error);
  }
}

function populateDropdown(employees) {
  const dropdown = document.getElementById("employee-name");
  dropdown.innerHTML = '<option value="">Select an employee</option>';
  employees.forEach((employee) => {
    const option = document.createElement("option");
    option.textContent = `${employee.FIRST_NAME} ${employee.LAST_NAME}`;
    option.value = employee.EMPLOYEE_NUMBER;
    option.dataset.email = employee.EMAIL;
    dropdown.appendChild(option);
  });
}

async function fetchShifts() {
  const employeeId = document.getElementById("employee-name").value;
  const dateValue = document.getElementById("shift-date").value;

  if (!employeeId || !dateValue) return;

  const formattedDate = formatDate(dateValue);
  const url = `https://www7.whentowork.com/cgi-bin/w2wG3.dll/api/AssignedShiftList?start_date=${formattedDate}&end_date=${formattedDate}&key=G042D1B58-7BA2233F1F3248279DCB30F1C5AE221D`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    displayShifts(data.AssignedShiftList || [], employeeId, formattedDate);
  } catch (error) {
    console.error("Error fetching shifts:", error);
  }
} // Function to select a reason for points and update the hidden input
function selectReason(reason) {
  document.getElementById("reason").value = reason;
  // Highlight the selected button
  document
    .querySelectorAll(".reason-button")
    .forEach((button) => button.classList.remove("selected"));
  const selectedButton = Array.from(
    document.querySelectorAll(".reason-button")
  ).find((button) => button.textContent === reason);
  if (selectedButton) selectedButton.classList.add("selected");
}

// Other JavaScript code for form handling and validation goes here...

function displayShifts(shifts, employeeId, date) {
  const shiftContainer = document.getElementById("shift-options");
  shiftContainer.innerHTML = "";
  const filteredShifts = shifts.filter(
    (shift) => shift.EMPLOYEE_NUMBER === employeeId && shift.START_DATE === date
  );

  if (filteredShifts.length > 0) {
    filteredShifts.forEach((shift) => {
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.id = shift.SHIFT_ID;
      radio.name = "shift";
      radio.value = `${shift.START_TIME} - ${shift.END_TIME}`;

      const label = document.createElement("label");
      label.htmlFor = shift.SHIFT_ID;
      label.textContent = `${shift.START_TIME} - ${shift.END_TIME} (${shift.POSITION_NAME})`;

      shiftContainer.appendChild(radio);
      shiftContainer.appendChild(label);
      shiftContainer.appendChild(document.createElement("br"));
    });
  } else {
    shiftContainer.textContent = "No shifts found. Enter shift details below:";
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const formData = {
    accessCode: document.getElementById("access-code").value,
    employeeName:
      document.getElementById("employee-name").selectedOptions[0]?.text || "",
    employeeId: document.getElementById("employee-name").value,
    shiftDate: document.getElementById("shift-date").value,
    selectedShift:
      document.querySelector('input[name="shift"]:checked')?.value || "",
    manualShift: document.getElementById("manual-shift").value,
    reason: document.getElementById("reason").value,
    comments: document.getElementById("comments").value,
    email:
      document.getElementById("employee-name").selectedOptions[0]?.dataset
        .email || "",
  };

  try {
    const response = await fetch("submit.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Submission successful!");
    } else {
      console.error("Submission failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("employee-name")
    .addEventListener("change", fetchShifts);
  document
    .getElementById("access-code")
    .addEventListener("blur", validateAccessCode);
  document
    .getElementById("form-submit")
    .addEventListener("click", handleSubmit);
  fetchEmployees();
});
