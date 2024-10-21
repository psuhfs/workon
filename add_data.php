<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect form data
    $data = [
        'accessCode' => $_POST['access-code'],
        'employeeName' => $_POST['employee-name'],
        'employeeId' => $_POST['employee-name'], // Employee ID
        'email' => $_POST['employee-email'] ?? '', // Employee email
        'shift' => $_POST['manual-shift'] ?? '',
        'pointsReason' => $_POST['reason'],
        'comments' => $_POST['comments'],
        'timestamp' => date('Y-m-d H:i:s') // Add timestamp for tracking
    ];

    $filename = 'data.js'; // Data file location

    // Check if data.js exists and prepare content
    if (file_exists($filename)) {
        $currentData = file_get_contents($filename);
        $currentData = rtrim($currentData, '];'); // Remove the closing bracket

        if (strlen(trim($currentData)) > 1) {
            $currentData .= ",\n"; // Add comma if data exists
        }
    } else {
        $currentData = "let data = [\n"; // Initialize new array
    }

    // Append new entry to the data array
    $newEntry = json_encode($data, JSON_PRETTY_PRINT);
    $currentData .= $newEntry . "\n];"; // Close the array

    // Write back to data.js
    if (file_put_contents($filename, $currentData) === false) {
        die('Failed to write to data.js'); // Error handling
    }

    // Prepare and send the email
    $to = $data['email']; // Employee email
    $subject = "Points Assigned Notification";
    $message = "
        <html>
        <head><title>Points Notification</title></head>
        <body>
            <p>Dear {$data['employeeName']},</p>
            <p>You have been assigned points for the following reason: <strong>{$data['pointsReason']}</strong>.</p>
            <p>Shift: {$data['shift']}<br>
            Comments: {$data['comments']}<br>
            Timestamp: {$data['timestamp']}</p>
            <p>Regards,<br>Points Tracker System</p>
        </body>
        </html>
    ";

    // Set headers for HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: scheduler@psu.edu" . "\r\n";
    $headers .= "Cc: scheduler@psu.edu, ckt5383@psu.edu" . "\r\n";

    // Send the email
    if (!mail($to, $subject, $message, $headers)) {
        die('Failed to send email'); // Error handling for email
    }

    // Redirect back to the form with success message
    header('Location: index.html?status=success');
    exit();
} else {
    die('Invalid request method'); // Ensure request is POST
}
?>