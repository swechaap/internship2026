<?php
// 1. Start the session to remember language choice across pages
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 2. Check if a language selection was made via URL query parameter
if (isset($_GET['lang'])) {
    $allowed_langs = ['en', 'hi', 'te'];
    if (in_array($_GET['lang'], $allowed_langs)) {
        $_SESSION['lang'] = $_GET['lang'];
    }
}

// 3. Set fallback to English if no session preference exists yet
$current_lang = isset($_SESSION['lang']) ? $_SESSION['lang'] : 'en';

// 4. Load the translation dictionary
require_once "languages/" . $current_lang . ".php";

include 'config/db.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$result = mysqli_query(
    $conn,
    "SELECT * FROM patients WHERE patient_id = $id"
);

$patient = mysqli_fetch_assoc($result);

if(isset($_POST['update']))
{
    $name = $_POST['full_name'];
    $age = $_POST['age'];
    $gender = $_POST['gender'];
    $blood = $_POST['blood_group'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    
    // Default గా పాత ఫోటో పేరును ఉంచుతాము
    $photo_name = $patient['photo']; 

    // కొత్త ఫోటో అప్‌లోడ్ చేసినట్లయితే
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] == 0) {
        $target_dir = "uploads/patients/";
        
        // ఫోల్డర్ లేకపోతే క్రియేట్ చేస్తుంది
        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0777, true);
        }

        // ఫైల్ నేమ్ డూప్లికేట్ అవ్వకుండా యూనిక్ నేమ్ జనరేట్ చేస్తుంది
        $file_ext = pathinfo($_FILES["photo"]["name"], PATHINFO_EXTENSION);
        $new_filename = "PT_" . time() . "." . $file_ext;
        $target_file = $target_dir . $new_filename;

        if (move_uploaded_file($_FILES["photo"]["tmp_name"], $target_file)) {
            $photo_name = $new_filename; // కొత్త ఫైల్ నేమ్ వేరియబుల్‌కి అసైన్ అవుతుంది
        }
    }

    mysqli_query(
        $conn,
        "UPDATE patients SET
        full_name='$name',
        age='$age',
        gender='$gender',
        blood_group='$blood',
        phone='$phone',
        email='$email',
        address='$address',
        photo='$photo_name'
        WHERE patient_id=$id"
    );

    // అప్‌డేట్ అయ్యాక నేరుగా వ్యూ పేజీకి వెళ్తుంది
    header("Location: view_patient.php?id=$id");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Edit Patient</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="background:#f4f6f9;">

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

    <div class="card shadow p-4">

        <h2 class="text-warning mb-4">
            Edit Patient
        </h2>

        <form method="POST" enctype="multipart/form-data">

            <div class="mb-3">
                <label class="form-label fw-bold">Full Name</label>
                <input type="text"
                name="full_name"
                value="<?php echo htmlspecialchars($patient['full_name']); ?>"
                class="form-control">
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Age</label>
                <input type="number"
                name="age"
                value="<?php echo $patient['age']; ?>"
                class="form-control">
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Gender</label>
                <select name="gender" class="form-control">
                    <option <?php if($patient['gender']=="Male") echo "selected"; ?>>Male</option>
                    <option <?php if($patient['gender']=="Female") echo "selected"; ?>>Female</option>
                    <option <?php if($patient['gender']=="Other") echo "selected"; ?>>Other</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Blood Group</label>
                <input type="text"
                name="blood_group"
                value="<?php echo htmlspecialchars($patient['blood_group']); ?>"
                class="form-control">
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Phone</label>
                <input type="text"
                name="phone"
                value="<?php echo htmlspecialchars($patient['phone']); ?>"
                class="form-control">
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Email</label>
                <input type="email"
                name="email"
                value="<?php echo htmlspecialchars($patient['email']); ?>"
                class="form-control">
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold"><?php echo $lang['address']; ?></label>
                <textarea
                name="address"
                class="form-control"><?php echo htmlspecialchars($patient['address']); ?></textarea>
            </div>

            <div class="mb-4">
                <label class="form-label fw-bold"><?php echo $lang['patient_photo']; ?></label>
                <input type="file" name="photo" class="form-control" accept="image/*">
                <?php if (!empty($patient['photo'])): ?>
                    <div class="mt-2">
                        <small class="text-muted d-block mb-1"><?php echo $lang['current_photo']; ?></small>
                        <img src="uploads/patients/<?php echo htmlspecialchars($patient['photo']); ?>" width="80" class="img-thumbnail rounded">
                    </div>
                <?php endif; ?>
            </div>

            <div class="d-flex gap-2">
                <button type="submit" name="update" class="btn btn-warning fw-bold"><?php echo $lang['update_patient']; ?></button>
                <a href="view_patient.php?id=<?php echo $id; ?>" class="btn btn-secondary"><?php echo $lang['cancel']; ?></a>
            </div>

        </form>

    </div>

</div>

</body>
</html>