<?php
// Connect to the database
$pdo = new PDO('mysql:host=localhost;dbname=your_db', 'username', 'password');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Get the JSON input
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Insert into Points_Submissions table
    $stmt = $pdo->prepare("
        INSERT INTO Points_Submissions (employee_id, points, reason, time_received, shift_name, shift_time)
        VALUES (:employee_id, :points, :reason, NOW(), :shift_name, :shift_time)
    ");
    $stmt->execute([
        ':employee_id' => $data['employeeId'],
        ':points' => $data['points'],
        ':reason' => $data['reason'],
        ':shift_name' => $data['selectedShift'],
        ':shift_time' => $data['shiftDate']
    ]);

    echo json_encode(['status' => 'success']);
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
