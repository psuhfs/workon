// Function to validate access code and redirect if valid
function validateAccessCode() {
    console.log("Validating access code...");
    const accessCode = document.getElementById("access-code").value;
    if (validAccessCodes.includes(accessCode)) {
        console.log("Access code is valid");
        setCookie(ACCESS_CODE, accessCode);
        document.location.href = "/app"; // Redirect to /app
    } else {
        console.log("Invalid access code"); // Optional: show an error message
    }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", function () {
    const accessCodeInput = document.getElementById("access-code");

    // Run validation on Enter key press
    accessCodeInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission
            validateAccessCode(); // Manually validate the access code
        }
    });
});
