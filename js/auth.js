// Global BASE_URL
const BASE_URL = 'https://hfs.ssdd.dev';
// const BASE_URL = 'http://localhost:3000';

// Function to authenticate user
async function authenticateUser() {
    console.log("Authenticating user...");
    const username = document.getElementById("access-code").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${BASE_URL}/auth/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password}),
        });

        if (response.ok) {
            console.log("Authentication successful");
            console.log("Response:", response);
            let body = await response.json();
            document.cookie = `token=${body.token}; path=/; max-age=3600; SameSite=None; Secure`;
            document.location.href = "/app"; // Redirect to /app after successful authentication
        } else {

            let body = await response.json();
            displayError("Authentication failed: " + body.message);
        }
    } catch (error) {
        console.error("Error during authentication:", error);
        displayError("An error occurred during authentication. Please try again.");
    }
}

// Function to display error message
function displayError(message) {
    console.log(message);
    const errorElement = document.getElementById("error-message");
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
    } else {
        console.error("Error element not found in the DOM");
    }
}

// Function to check if user is authenticated
async function isAuthenticated() {
    try {
        let token = document.cookie.split('=')[1];
        console.log(token);
        const response = await fetch(`${BASE_URL}/auth/authenticated`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            return true;
        } else {
            // Remove the token from cookies
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // Re-initiate auth (redirect to login page or show login form)
            if (document.location.pathname !== "/") {
                document.location.href = "/"; // Assuming "/" is the login page
            }
            return false;
        }
    } catch (error) {
        console.error("Error checking authentication:", error);
        // In case of error, we assume the user is not authenticated
        return false;
    }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", async function () {
    // Run authentication on Enter key press in password field
    document.addEventListener("keypress", async function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            await authenticateUser();
        }
    });

    // Check authentication status on page load
    let authenticated = await isAuthenticated();
    console.log("Authenticated:", authenticated);
    if (authenticated) {
        console.log("User is already authenticated");
        document.location.href = "/app"; // Redirect to /app if already authenticated
    }
});
