<?php
// 1. Start the session to track language state
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 2. Track language choice if supplied via GET query parameter
if (isset($_GET['lang'])) {
    $allowed_langs = ['en', 'hi', 'te'];
    if (in_array($_GET['lang'], $allowed_langs)) {
        $_SESSION['lang'] = $_GET['lang'];
    }
}

// 3. Fallback to English if no option is stored in the session yet
$current_lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'en';

// 4. Load the language translations dictionary
require_once "languages/" . $current_lang . ".php";

include 'config/db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// --- HANDLE SAVING EMERGENCY CONTACT ---
if (isset($_POST['save_contact'])) {
    $name = mysqli_real_escape_string($conn, $_POST['contact_name']);
    $relationship = mysqli_real_escape_string($conn, $_POST['relationship']);
    $phone = mysqli_real_escape_string($conn, $_POST['phone']);
    
    // Check if a contact already exists to avoid duplicates
    $check = mysqli_query($conn, "SELECT * FROM emergency_contacts WHERE patient_id = $id");
    if (mysqli_num_rows($check) > 0) {
        mysqli_query($conn, "UPDATE emergency_contacts SET contact_name='$name', relationship='$relationship', phone='$phone' WHERE patient_id = $id");
    } else {
        mysqli_query($conn, "INSERT INTO emergency_contacts (patient_id, contact_name, relationship, phone) VALUES ($id, '$name', '$relationship', '$phone')");
    }
    header("Location: view_patient.php?id=$id");
    exit;
}

// --- HANDLE DELETING EMERGENCY CONTACT ---
if (isset($_GET['delete_contact'])) {
    mysqli_query($conn, "DELETE FROM emergency_contacts WHERE patient_id = $id");
    header("Location: view_patient.php?id=$id");
    exit;
}

// --- HANDLE DELETE MEDICAL HISTORY ---
if (isset($_GET['delete_history_id'])) {
    $delete_id = intval($_GET['delete_history_id']);
    mysqli_query($conn, "DELETE FROM medical_history WHERE history_id = $delete_id");
    header("Location: view_patient.php?id=$id");
    exit;
}

// --- FETCH PATIENT DATA ---
$result = mysqli_query($conn, "SELECT * FROM patients WHERE patient_id = $id");
$patient = mysqli_fetch_assoc($result);

if (!$patient) {
    echo "<h3 style='text-align:center;margin-top:50px;color:red;'>Patient Not Found</h3>";
    echo "<div style='text-align:center;'><a href='index.php'>Go Back</a></div>";
    exit;
}

// --- FETCH EMERGENCY CONTACT ---
$contact_res = mysqli_query($conn, "SELECT * FROM emergency_contacts WHERE patient_id = $id");
$emergency = mysqli_fetch_assoc($contact_res);

// --- FETCH MEDICAL HISTORY FOR TIMELINE ---
$history_result = mysqli_query($conn, "SELECT * FROM medical_history WHERE patient_id = $id ORDER BY visit_date DESC");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Patient Profile</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">
    <style>
        body { background: #f4f6f9; }
        .profile-card { border: none; border-radius: 20px; box-shadow: 0 3px 15px rgba(0,0,0,0.1); }
        .profile-photo { width: 180px; height: 180px; object-fit: cover; border-radius: 50%; border: 4px solid #0d6efd; }
    </style>
</head>
<body>

<div class="container mt-5 mb-5">

    <div class="d-flex justify-content-end mb-3">
        <form method="GET" action="" class="d-flex align-items-center bg-white p-2 rounded shadow-sm border">
            <input type="hidden" name="id" value="<?php echo $id; ?>">
            <label for="lang-select" class="me-2 mb-0 fw-bold text-secondary" style="font-size: 0.9rem;">Language / భాష:</label>
            <select name="lang" id="lang-select" class="form-select form-select-sm" onchange="this.form.submit()" style="width: auto;">
                <option value="en" <?php echo $current_lang == 'en' ? 'selected' : ''; ?>>English</option>
                <option value="hi" <?php echo $current_lang == 'hi' ? 'selected' : ''; ?>>हिन्दी (Hindi)</option>
                <option value="te" <?php echo $current_lang == 'te' ? 'selected' : ''; ?>>తెలుగు (Telugu)</option>
            </select>
        </form>
    </div>

    <div class="card profile-card p-4">
        
        <div class="text-center mb-4">
            <?php if (!empty($patient['photo'])) { ?>
                <img src="uploads/patients/<?php echo htmlspecialchars($patient['photo']); ?>" class="profile-photo" alt="<?php echo $lang['patient_photo']; ?>">
            <?php } else { ?>
                <img src="https://via.placeholder.com/180" class="profile-photo" alt="No Photo">
            <?php } ?>
            <h2 class="mt-3 text-primary"><?php echo htmlspecialchars($patient['full_name']); ?></h2>
        </div>

        <div class="row">
            <div class="col-md-8">
                <table class="table table-bordered bg-white">
                    <tr><th width="30%">Patient ID</th><td><?php echo $patient['patient_id']; ?></td></tr>
                    <tr><th>Full Name</th><td><?php echo htmlspecialchars($patient['full_name']); ?></td></tr>
                    <tr><th>Age</th><td><?php echo $patient['age']; ?></td></tr>
                    <tr><th>Gender</th><td><?php echo htmlspecialchars($patient['gender']); ?></td></tr>
                    <tr><th>Blood Group</th><td><?php echo htmlspecialchars($patient['blood_group']); ?></td></tr>
                    <tr><th>Phone</th><td><?php echo htmlspecialchars($patient['phone']); ?></td></tr>
                    <tr><th>Email</th><td><?php echo htmlspecialchars($patient['email']); ?></td></tr>
                    <tr><th><?php echo $lang['address']; ?></th><td><?php echo htmlspecialchars($patient['address']); ?></td></tr>
                    <tr><th>Created At</th><td><?php echo $patient['created_at']; ?></td></tr>
                </table>
            </div>

            <div class="col-md-4">
                <div class="card p-3 border-0 bg-light rounded shadow-sm h-100">
                    <h5 class="text-danger fw-bold mb-3"><i class="bi bi-exclamation-triangle-fill"></i> Emergency Contact</h5>
                    <?php if ($emergency) { ?>
                        <p class="mb-1"><strong>Name:</strong> <?php echo htmlspecialchars($emergency['contact_name']); ?></p>
                        <p class="mb-1"><strong>Relationship:</strong> <?php echo htmlspecialchars($emergency['relationship']); ?></p>
                        <p class="mb-3"><strong>Phone:</strong> <?php echo htmlspecialchars($emergency['phone']); ?></p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#contactModal">Edit</button>
                            <a href="view_patient.php?id=<?php echo $id; ?>&delete_contact=1" class="btn btn-outline-danger btn-sm" onclick="return confirm('Remove contact?');">Remove</a>
                        </div>
                    <?php } else { ?>
                        <p class="text-muted small">No emergency contact saved yet.</p>
                        <button class="btn btn-danger btn-sm w-100 mt-2" data-bs-toggle="modal" data-bs-target="#contactModal">
                            <i class="bi bi-plus-lg"></i> Add Contact
                        </button>
                    <?php } ?>
                </div>
            </div>
        </div>

        <div class="mt-3">
            <a href="index.php" class="btn btn-primary">Back to Dashboard</a>
            <a href="edit_patient.php?id=<?php echo $patient['patient_id']; ?>" class="btn btn-warning">Edit Patient</a>
            <a href="add_history.php?patient_id=<?php echo $patient['patient_id']; ?>" class="btn btn-success">Add Medical History</a>
        </div>

        <hr class="my-4">
        <h4 class="text-dark mb-3 fw-bold"><i class="bi bi-clock-history text-primary"></i> Medical History Timeline</h4>

        <?php if (mysqli_num_rows($history_result) > 0) { ?>
            <div class="list-group">
                <?php while ($row = mysqli_fetch_assoc($history_result)) { ?>
                    <div class="list-group-item py-3 mb-3 border-start border-primary border-4 bg-light rounded shadow-sm">
                        <div class="d-flex w-100 justify-content-between align-items-center mb-2">
                            <h5 class="mb-1 text-primary fw-bold"><?php echo htmlspecialchars($row['problem']); ?></h5>
                            <div>
                                <span class="badge bg-secondary me-2"><i class="bi bi-calendar3"></i> <?php echo date('d M Y', strtotime($row['visit_date'])); ?></span>
                                <a href="view_patient.php?id=<?php echo $id; ?>&delete_history_id=<?php echo $row['history_id']; ?>" class="btn btn-outline-danger btn-sm py-0 px-2" onclick="return confirm('Delete record?');"><i class="bi bi-trash"></i></a>
                            </div>
                        </div>
                        <p class="mb-1 text-dark"><strong>Diagnosis:</strong> <?php echo htmlspecialchars($row['diagnosis']); ?></p>
                        <p class="mb-2 text-muted"><strong>Treatment Notes:</strong> <?php echo htmlspecialchars($row['treatment_notes']); ?></p>
                        <div class="text-secondary small border-top pt-2"><i class="bi bi-person-badge text-primary"></i> <strong>Doctor:</strong> Dr. <?php echo htmlspecialchars($row['doctor_name'] ?: 'Not Assigned'); ?></div>
                    </div>
                <?php } ?>
            </div>
        <?php } else { ?>
            <div class="alert alert-light text-center border py-4 text-muted"><i class="bi bi-folder2-open fs-2 d-block mb-2"></i>No records found.</div>
        <?php } ?>
    </div>
</div>

<div class="modal fade" id="contactModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <form action="" method="POST" class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Manage Emergency Contact</h5>
        <button type="button" class="btn-close" data-bs-shadow="none" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
            <label class="form-label">Contact Name</label>
            <input type="text" name="contact_name" class="form-control" value="<?php echo $emergency ? htmlspecialchars($emergency['contact_name']) : ''; ?>" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Relationship</label>
            <input type="text" name="relationship" class="form-control" placeholder="e.g., Mother, Spouse" value="<?php echo $emergency ? htmlspecialchars($emergency['relationship']) : ''; ?>" required>
        </div>
        <div class="mb-3">
            <label class="form-label">Phone Number</label>
            <input type="text" name="phone" class="form-control" value="<?php echo $emergency ? htmlspecialchars($emergency['phone']) : ''; ?>" required>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php echo $lang['cancel']; ?></button>
        <button type="submit" name="save_contact" class="btn btn-danger">Save Contact</button>
      </div>
    </form>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>