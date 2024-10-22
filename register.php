<?php
// Database connection
$host = 'sql8.freemysqlhosting.net';
$db = 'users';
$user = 'sql8739967';
$pass = 'jZlNhTjS7E';
$conn = new mysqli($host, $user, $pass, $db);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$registration_error = ''; // Initialize error message

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Validation
    if (empty($username) || empty($email) || empty($_POST['password'])) {
        $registration_error = "All fields are required.";
    } else {
        // Prepare and execute the statement to insert user
        $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $username, $email, $password);

        if ($stmt->execute()) {
            // Redirect to login page after successful registration
            header('Location: login.html');
            exit;
        } else {
            $registration_error = "Registration failed: " . $stmt->error; // Capture error message
        }
    }
}

$conn->close(); // Close the database connection
?>
