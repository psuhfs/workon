<?php
// Database connection details
$servername = "srv917.hstgr.io";
$username = "u426693394_hfs";
$password = "Hfs@905870698";
$dbname = "u426693394_hfs";

// Email recipients
$recipients = ["anmol@psu.edu", "scheduler@psu.edu", "ckt5383@psu.edu"];

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Query to get entries from Test_Points table for the past 7 days
$pastSevenDaysQuery = "SELECT * FROM Test_Points WHERE shiftDate >= DATE(NOW()) - INTERVAL 7 DAY";
$pastSevenDaysResult = $conn->query($pastSevenDaysQuery);

// Query to get employees with more than 5 points
$highPointsQuery = "SELECT * FROM employee_total_points WHERE totalPoints > 5";
$highPointsResult = $conn->query($highPointsQuery);

// Prepare the HTML email content
$emailBody = "<html><body>";
$emailBody .= "<h2>HFS Student Employee Points Report</h2>";

// Entries from Test_Points table
$emailBody .= "<h3>Entries from Past 7 Days</h3>";
if ($pastSevenDaysResult->num_rows > 0) {
    $emailBody .= "<table border='1' cellpadding='5' cellspacing='0'>";
    $emailBody .= "<tr><th>Given By</th><th>Employee Name</th><th>Points</th><th>Shift Date</th><th>Reason</th><th>Comments</th></tr>";
    while ($row = $pastSevenDaysResult->fetch_assoc()) {
        $emailBody .= "<tr>
            <td>{$row['accessCode']}</td>
            <td>{$row['employeeName']}</td>
            <td>{$row['points']}</td>
            <td>{$row['shiftDate']}</td>
            <td>{$row['reason']}</td>
            <td>{$row['comments']}</td>
        </tr>";
    }
    $emailBody .= "</table>";
} else {
    $emailBody .= "<p>No entries found for the past 7 days.</p>";
}

$emailBody .= "<br>";

// Employees with more than 5 points
$emailBody .= "<h3>Employees with More Than 5 Points</h3>";
if ($highPointsResult->num_rows > 0) {
    $emailBody .= "<table border='1' cellpadding='5' cellspacing='0'>";
    $emailBody .= "<tr><th>Employee ID</th><th>Employee Name</th><th>Total Points</th></tr>";
    while ($row = $highPointsResult->fetch_assoc()) {
        $emailBody .= "<tr>
            <td>{$row['employeeId']}</td>
            <td>{$row['employeeName']}</td>
            <td>{$row['totalPoints']}</td>
        </tr>";
    }
    $emailBody .= "</table>";
} else {
    $emailBody .= "<p>No employees have more than 5 points.</p>";
}

$emailBody .= "</body></html>";

// Output the report to browser
echo $emailBody;

// Email subject and headers
$subject = "Weekly Points Report";
$headers = "From: info@medilance.in\r\n";
$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

// Send the email to all recipients and print success/failure messages
foreach ($recipients as $recipient) {
    if (mail($recipient, $subject, $emailBody, $headers)) {
        echo "Email sent successfully to $recipient.<br>";
    } else {
        echo "Failed to send email to $recipient. Error: " . error_get_last()['message'] . "<br>";
    }
}

// Close the connection
$conn->close();
?>