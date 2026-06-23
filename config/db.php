<?php
// Database connection setup
$conn = mysqli_connect(
    "localhost",
    "root",
    "",
    "patient_management"
);

if (!$conn) {
    die("Database Connection Failed: " . mysqli_connect_error());
}
?>