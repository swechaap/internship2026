<?php
// 1. Start session to track language state
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

// 5. Connect to the database
include 'config/db.php';

if(isset($_GET['search']) && !empty($_GET['search']))
{
    $search = mysqli_real_escape_string($conn, $_GET['search']);

    $result = mysqli_query(
        $conn,
        "SELECT * FROM patients
         WHERE full_name LIKE '%$search%'
         ORDER BY patient_id DESC"
    );
}
else
{
    $result = mysqli_query(
        $conn,
        "SELECT * FROM patients
         ORDER BY patient_id DESC"
    );
}

$totalPatientsQuery = mysqli_query(
    $conn,
    "SELECT * FROM patients"
);

$totalPatients = mysqli_num_rows($totalPatientsQuery);

?>

<!DOCTYPE html>
<html>
<head>
    <title>Patient Management Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        body{
            background:#f4f6f9;
        }

        .dashboard-card{
            border:none;
            border-radius:15px;
            box-shadow:0 2px 10px rgba(0,0,0,.1);
        }

        .table-card{
            border:none;
            border-radius:15px;
            box-shadow:0 2px 10px rgba(0,0,0,.1);
        }

        .patient-photo{
            width:60px;
            height:60px;
            object-fit:cover;
            border-radius:50%;
            border:2px solid #dee2e6;
        }
    </style>
</head>
<body>

<div class="container mt-5">

    <div class="d-flex justify-content-end mb-3">
        <form method="GET" action="" class="d-flex align-items-center bg-white p-2 rounded shadow-sm border">
            <?php if (isset($_GET['search'])): ?>
                <input type="hidden" name="search" value="<?php echo htmlspecialchars($_GET['search']); ?>">
            <?php endif; ?>
            <label for="lang-select" class="me-2 mb-0 fw-bold text-secondary" style="font-size: 0.9rem;">Language / భాష:</label>
            <select name="lang" id="lang-select" class="form-select form-select-sm" onchange="this.form.submit()" style="width: auto;">
                <option value="en" <?php echo $current_lang == 'en' ? 'selected' : ''; ?>>English</option>
                <option value="hi" <?php echo $current_lang == 'hi' ? 'selected' : ''; ?>>हिन्दी (Hindi)</option>
                <option value="te" <?php echo $current_lang == 'te' ? 'selected' : ''; ?>>తెలుగు (Telugu)</option>
            </select>
        </form>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="text-primary">
            Patient Management Dashboard
        </h1>

        <a href="add_patient.php" class="btn btn-primary">
            Add Patient
        </a>
    </div>

    <div class="row mb-4">
        <div class="col-md-4">
            <div class="card dashboard-card p-4">
                <h5>Total Patients</h5>
                <h2><?php echo $totalPatients; ?></h2>
            </div>
        </div>
    </div>

    <div class="card table-card p-4">

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3>Patient Records</h3>
        </div>

        <form method="GET" class="mb-3">
            <div class="input-group">
                <input
                    type="text"
                    name="search"
                    class="form-control"
                    placeholder="Search Patient by Name"
                    value="<?php echo isset($_GET['search']) ? htmlspecialchars($_GET['search']) : ''; ?>">

                <button type="submit" class="btn btn-primary">
                    Search
                </button>

                <a href="index.php" class="btn btn-secondary">
                    Clear
                </a>
            </div>
        </form>

        <div class="table-responsive">
            <table class="table table-striped mt-3 align-middle">
                <thead class="table-primary">
                    <tr>
                        <th>ID</th>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Phone</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                <?php while($row = mysqli_fetch_assoc($result)) { ?>
                    <tr>
                        <td><?php echo $row['patient_id']; ?></td>

                        <td>
                            <?php if(!empty($row['photo'])) { ?>
                                <img
                                    src="uploads/patients/<?php echo htmlspecialchars($row['photo']); ?>"
                                    class="patient-photo"
                                    alt="Patient Photo">
                            <?php } else { ?>
                                <span class="text-muted">
                                    No Photo
                                </span>
                            <?php } ?>
                        </td>

                        <td><?php echo htmlspecialchars($row['full_name']); ?></td>
                        <td><?php echo $row['age']; ?></td>
                        <td><?php echo htmlspecialchars($row['gender']); ?></td>
                        <td><?php echo htmlspecialchars($row['phone']); ?></td>

                        <td>
                            <a href="view_patient.php?id=<?php echo $row['patient_id']; ?>"
                               class="btn btn-info btn-sm">
                               View
                            </a>

                            <a href="edit_patient.php?id=<?php echo $row['patient_id']; ?>"
                               class="btn btn-warning btn-sm">
                               Edit
                            </a>

                            <a href="delete_patient.php?id=<?php echo $row['patient_id']; ?>"
                               class="btn btn-danger btn-sm"
                               onclick="return confirm('Are you sure you want to delete this patient?')">
                                Delete
                            </a>
                        </td>
                    </tr>
                <?php } ?>
                </tbody>
            </table>
        </div>

    </div>

</div>

</body>
</html>