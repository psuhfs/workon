<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Collect form data
    $data = [
        'accessCode' => $_POST['access-code'],
        'employeeName' => $_POST['employee-name'],
        'email' => $_POST['employee-email'] ?? '', // Optional field for email
        'shift' => $_POST['manual-shift'] ?? '',
        'pointsReason' => $_POST['reason'],
        'comments' => $_POST['comments'],
        'timestamp' => date('Y-m-d H:i:s') // Add timestamp for tracking
    ];

    $filename = 'data.js'; // Data file location

    // Check if data.js already exists
    if (file_exists($filename)) {
        $currentData = file_get_contents($filename);
        $currentData = rtrim($currentData, '];'); // Remove the closing bracket

        // Add a comma to separate entries if data already exists
        if (strlen(trim($currentData)) > 1) {
            $currentData .= ",\n";
        }
    } else {
        // Initialize the content if the file doesn't exist
        $currentData = "let data = [\n";
    }

    // Add new entry as a JavaScript object
    $newEntry = json_encode($data, JSON_PRETTY_PRINT);
    $currentData .= $newEntry . "\n];"; // Close the array

    // Write updated data back to data.js
    file_put_contents($filename, $currentData);

    // Redirect back to the form with a success message
    header('Location: index.html?status=success');
    exit();
}
?>
