<?php
// TODO: take this from env
$tableName = "Test_Points";
$servername = "srv917.hstgr.io";
$username = "u426693394_hfs";
$password = "Hfs@905870698";
$dbname = "u426693394_hfs";

// Create a connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get the JSON data sent from the frontend
$data = json_decode(file_get_contents("php://input"), true);

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO $tableName (accessCode, employeeName, employeeId, shiftDate, selectedShift, manualShift, reason, comments, email, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

// Bind the parameters
$stmt->bind_param("ssisssssss",
    $data['accessCode'],
    $data['employeeName'],
    $data['employeeId'],
    $data['shiftDate'],
    $data['selectedShift'],
    $data['manualShift'],
    $data['reason'],
    $data['comments'],
    $data['email'],
    $data['points']
);

// Execute the statement
if ($stmt->execute()) {
    $to = $data['email'];
    $subject = "Shift Update Notification";
    $message = "Hello, " . $data['employeeName'] . ",\n\nyou have received points. Find attached details:\n";
    $message .= "Shift Date: " . $data['shiftDate'] . "\n";
    $message .= "Selected Shift: " . $data['selectedShift'] . "\n";
    $message .= "Reason: " . $data['reason'] . "\n";
    $message .= "Comments: " . $data['comments'] . "\n\n";
    $message .= "Points: " . $data['points'] . "\n\n";
    $message .= "Thank you, \nStudent Scheduler\n";

    $headers = "From: info@medilance.in";

    // Send the email
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["status" => "success", "message" => "Data inserted and email sent successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Data inserted but failed to send email"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Error inserting data: " . $stmt->error]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
