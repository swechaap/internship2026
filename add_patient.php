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

if(isset($_POST['save']))
{
    $name = $_POST['full_name'];
    $age = $_POST['age'];
    $gender = $_POST['gender'];
    $blood = $_POST['blood_group'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $address = $_POST['address'];

    $photo = "";

    if(isset($_FILES['photo']) && $_FILES['photo']['name'] != "")
    {
        $photo = time() . "_" . $_FILES['photo']['name'];

        move_uploaded_file(
            $_FILES['photo']['tmp_name'],
            "uploads/patients/" . $photo
        );
    }

    $sql = "INSERT INTO patients
    (full_name, age, gender, blood_group, phone, email, address, photo)
    VALUES
    ('$name','$age','$gender','$blood','$phone','$email','$address','$photo')";

    if(mysqli_query($conn, $sql))
    {
        echo "<script>
                alert('Patient Added Successfully');
                window.location='index.php';
              </script>";
    }
    else
    {
        echo "<script>alert('Error Adding Patient');</script>";
    }
}

?>

<!DOCTYPE html>
<html>
<head>
    <title>Add Patient</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body style="background:#f4f6f9;">

<div class="container mt-5">

    <div class="d-flex justify-content-end mb-3">
        <form method="GET" action="" class="d-flex align-items-center bg-white p-2 rounded shadow-sm border">
            <label for="lang-select" class="me-2 mb-0 fw-bold text-secondary" style="font-size: 0.9rem;">Language / భాష:</label>
            <select name="lang" id="lang-select" class="form-select form-select-sm" onchange="this.form.submit()" style="width: auto;">
                <option value="en" <?php echo $current_lang == 'en' ? 'selected' : ''; ?>>English</option>
                <option value="hi" <?php echo $current_lang == 'hi' ? 'selected' : ''; ?>>हिन्दी (Hindi)</option>
                <option value="te" <?php echo $current_lang == 'te' ? 'selected' : ''; ?>>తెలుగు (Telugu)</option>
            </select>
        </form>
    </div>

    <div class="card p-4 shadow">

        <h2 class="text-primary mb-4">
            Add New Patient
        </h2>

        <form method="POST" enctype="multipart/form-data">

            <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input type="text" name="full_name" class="form-control" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Age</label>
                <input type="number" name="age" class="form-control" required>
            </div>

            <div class="mb-3">
                <label class="form-label">Gender</label>
                <select name="gender" class="form-control" required>
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label">Blood Group</label>
                <input type="text" name="blood_group" class="form-control">
            </div>

            <div class="mb-3">
                <label class="form-label">Phone</label>
                <input type="text" name="phone" class="form-control">
            </div>

            <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control">
            </div>

            <div class="mb-3">
                <label class="form-label"><?php echo $lang['address']; ?></label>
                <textarea name="address" class="form-control" rows="3"></textarea>
            </div>

            <div class="mb-3">
                <label class="form-label"><?php echo $lang['patient_photo']; ?></label>
                <input type="file" name="photo" class="form-control" accept="image/*">
            </div>

            <button type="submit" name="save" class="btn btn-primary">
                Save Patient
            </button>

            <a href="index.php" class="btn btn-secondary">
                <?php echo $lang['cancel']; ?>
            </a>

        </form>

    </div>

</div>

</body>
</html>