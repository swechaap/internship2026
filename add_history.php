<?php

include 'config/db.php';

$patient_id = isset($_GET['patient_id']) ? intval($_GET['patient_id']) : 0;

if ($patient_id == 0) {
    die("Invalid Patient ID");
}

// Get patient (optional but good for validation)
$patient_check = mysqli_query($conn, "SELECT * FROM patients WHERE patient_id = $patient_id");
if (mysqli_num_rows($patient_check) == 0) {
    die("Patient not found");
}

if (isset($_POST['save'])) {

    $problem = mysqli_real_escape_string($conn, $_POST['problem']);
    $diagnosis = mysqli_real_escape_string($conn, $_POST['diagnosis']);
    $treatment_notes = mysqli_real_escape_string($conn, $_POST['treatment_notes']);
    $visit_date = mysqli_real_escape_string($conn, $_POST['visit_date']);

    // OPTIONAL DOCTOR FIELD (safe even if empty)
    $doctor_name = isset($_POST['doctor_name'])
        ? mysqli_real_escape_string($conn, $_POST['doctor_name'])
        : '';

    $sql = "INSERT INTO medical_history
    (patient_id, problem, diagnosis, treatment_notes, visit_date, doctor_name)
    VALUES
    ('$patient_id', '$problem', '$diagnosis', '$treatment_notes', '$visit_date', '$doctor_name')";

    if (mysqli_query($conn, $sql)) {
        header("Location: view_patient.php?id=$patient_id");
        exit;
    } else {
        echo "<script>alert('Error Adding Medical History');</script>";
    }
}

?>

<!DOCTYPE html>
<html>
<head>
    <title>Add Medical History</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body style="background:#f4f6f9;">

<div class="container mt-5">

    <div class="card shadow p-4">

        <h2 class="text-primary mb-4">
            Add Medical History
        </h2>

        <form method="POST">

            <div class="mb-3">
                <label class="form-label">Problem / Complaint</label>
                <input type="text" name="problem" class="form-control" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Diagnosis</label>
                <textarea name="diagnosis" class="form-control" rows="3" required></textarea>
            </div>

            <div class="mb-3">
                <label class="form-label">Treatment Notes</label>
                <textarea name="treatment_notes" class="form-control" rows="4" required></textarea>
            </div>

            <div class="mb-3">
                <label class="form-label">Visit Date</label>
                <input type="date" name="visit_date" class="form-control" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Doctor Name (Optional)</label>
                <input type="text" name="doctor_name" class="form-control">
            </div>

            <button type="submit" name="save" class="btn btn-success">
                Save Medical History
            </button>

            <a href="view_patient.php?id=<?php echo $patient_id; ?>" class="btn btn-secondary">
                Back
            </a>

        </form>

    </div>

</div>

</body>
</html>