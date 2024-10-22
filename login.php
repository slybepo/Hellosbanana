<?php

$host = '3306';
$db = 'sql8.freemysqlhosting.net';
$user = 'sql8739967';
$pass = 'jZlNhTjS7E';
$conn = new mysqli($host, $user, $pass, $db);



// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$login_error = ''; // Initialize error message

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Prepare and execute the statement to retrieve user
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    // Verify password
    if ($user && password_verify($password, $user['password'])) {
        session_start();
        $_SESSION['user_id'] = $user['id']; // Store user id in session
        header("Location: welcome.php"); // Redirect to a welcome page
        exit;
    } else {
        $login_error = "Invalid credentials!"; // Set error message for invalid login
    }
}

$conn->close(); // Close the database connection
?>
