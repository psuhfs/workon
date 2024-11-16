<?php
// Database connection details
$servername = "srv917.hstgr.io";
$username = "u426693394_hfs";
$password = "Hfs@905870698";
$dbname = "u426693394_hfs";

// Email recipients
$recipients = ["anmol@psu.edu", "scheduler@psu.edu"];
// $recipients = ["anmol@psu.edu", "ckt5383@psu.edu"];

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

// Prepare the email content
$emailBody = "Points Report:\n\n";

// Entries from Test_Points table
$emailBody .= "Entries from Test_Points (Past 7 Days):\n";
if ($pastSevenDaysResult->num_rows > 0) {
    while ($row = $pastSevenDaysResult->fetch_assoc()) {
        $emailBody .= "Access Code: {$row['accessCode']}, Employee Name: {$row['employeeName']}, Points: {$row['points']}, Shift Date: {$row['shiftDate']}, Reason: {$row['reason']}, Comments: {$row['comments']}\n";
    }
} else {
    $emailBody .= "No entries found for the past 7 days.\n";
}

$emailBody .= "\n";

// Employees with more than 5 points
$emailBody .= "Employees with More Than 5 Points:\n";
if ($highPointsResult->num_rows > 0) {
    while ($row = $highPointsResult->fetch_assoc()) {
        $emailBody .= "Employee ID: {$row['employeeId']}, Employee Name: {$row['employeeName']}, Total Points: {$row['totalPoints']}\n";
    }
} else {
    $emailBody .= "No employees have more than 5 points.\n";
}

// Email subject and headers
$subject = "Weekly Points Report";
$headers = "From: info@medilance.in";

// Send the email to all recipients
foreach ($recipients as $recipient) {
    if (mail($recipient, $subject, $emailBody, $headers)) {
        echo "Email sent successfully to $recipient.\n";
    } else {
        echo "Failed to send email to $recipient.\n";
    }
}

// Close the connection
$conn->close();
?>