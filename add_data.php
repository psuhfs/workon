<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = [
        'accessCode' => $_POST['access-code'],
        'employeeName' => $_POST['employee-name'],
        'employeeId' => $_POST['employee-name'],
        'email' => $_POST['employee-email'],
        'shift' => $_POST['manual-shift'] ?? '',
        'pointsReason' => $_POST['reason'],
        'comments' => $_POST['comments'],
        'timestamp' => date('Y-m-d H:i:s')
    ];

    $to = "scheduler@psu.edu";
    $employeeEmail = $data['email'];
    $subject = "Points Assigned Notification for {$data['employeeName']}";
    $message = "
        <html>
        <head><title>Points Notification</title></head>
        <body>
            <p>Employee Name: {$data['employeeName']}</p>
            <p>Shift: {$data['shift']}<br>
            Reason: {$data['pointsReason']}<br>
            Comments: {$data['comments']}<br>
            Timestamp: {$data['timestamp']}</p>
            <p>Regards,<br>Student Scheduler</p>
        </body>
        </html>
    ";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: info@medilance.in" . "\r\n";
    $headers .= "Cc: $employeeEmail" . "\r\n";

    if (!mail($to, $subject, $message, $headers)) {
        die('Failed to send email');
    }

    echo "Submission successful!";
    exit();
} else {
    die('Invalid request method');
}