function adminDashboard(container) {
  container.innerHTML = `
  <div class="stat-grid">
    <div class="stat-card"><div class="sc-icon">Students</div><div class="sc-val">${DB.students.length}</div><div class="sc-lbl">Total Students</div><div class="sc-tag tag-blue">Enrolled</div></div>
    <div class="stat-card"><div class="sc-icon">Faculty</div><div class="sc-val">${DB.users.filter(function (user) { return user.role === 'faculty'; }).length}</div><div class="sc-lbl">Faculty Members</div><div class="sc-tag tag-green">Active</div></div>
    <div class="stat-card"><div class="sc-icon">Courses</div><div class="sc-val">${DB.courses.length}</div><div class="sc-lbl">Courses</div><div class="sc-tag tag-amber">Running</div></div>
    <div class="stat-card"><div class="sc-icon">Notices</div><div class="sc-val">${DB.notices.length}</div><div class="sc-lbl">Notices</div><div class="sc-tag tag-blue">Posted</div></div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
    <div class="card">
      <div class="card-header"><h3>Recent Students</h3><button class="btn-sm btn-primary" onclick="navigate('adminStudents')">View all</button></div>
      <div class="card-body" style="padding:0">
        <table class="tbl"><thead><tr><th>Name</th><th>Dept</th><th>Status</th></tr></thead><tbody>
        ${DB.students.slice(0, 5).map(function (student) {
          return `<tr><td><span class="avatar-sm av-blue">${student.name[0]}</span>${student.name}</td><td>${student.dept}</td><td><span class="badge b-green">Active</span></td></tr>`;
        }).join('')}
        </tbody></table></div></div>
    <div class="card">
      <div class="card-header"><h3>Faculty Overview</h3></div>
      <div class="card-body" style="padding:0">
        <table class="tbl"><thead><tr><th>Name</th><th>Dept</th><th>Subjects</th></tr></thead><tbody>
        ${DB.users.filter(function (user) { return user.role === 'faculty'; }).map(function (faculty) {
          return `<tr><td><span class="avatar-sm av-teal">${faculty.name[0]}</span>${faculty.name}</td><td>${faculty.dept}</td><td>${(faculty.subjects || []).length}</td></tr>`;
        }).join('')}
        </tbody></table></div></div>
  </div>`;
}

function adminStudents(container) {
  container.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h3>All Students (${DB.students.length})</h3>
      <button class="btn-sm btn-primary" onclick="openCreateStudent()">+ Add Student</button>
    </div>
    <div class="card-body" style="padding:0">
      <table class="tbl" id="stuTable">
        <thead><tr><th>#</th><th>Name</th><th>ID</th><th>Dept</th><th>Year</th><th>Sec</th><th>Email</th><th>Actions</th></tr></thead>
        <tbody id="stuTbody"></tbody>
      </table>
    </div>
  </div>`;
  renderStudentTable();
}

function renderStudentTable() {
  var tbody = document.getElementById('stuTbody');
  if (!tbody) return;
  tbody.innerHTML = DB.students.map(function (student, index) {
    return `
    <tr>
      <td>${index + 1}</td>
      <td><span class="avatar-sm av-blue">${student.name[0]}</span>${student.name}</td>
      <td><span class="badge b-blue">${student.id}</span></td>
      <td>${student.dept}</td><td>Year ${student.year}</td><td>${student.section}</td>
      <td>${student.email}</td>
      <td><div class="btn-row">
        <button class="btn-sm btn-outline" onclick="editStudent('${student.id}')">Edit</button>
        <button class="btn-sm btn-danger" onclick="deleteStudent('${student.id}')">Delete</button>
      </div></td>
    </tr>`;
  }).join('');
}

function openCreateStudent() {
  var newId = nextId('STU');
  openModal('Create New Student Account', `
    <div class="form-row"><div class="fg"><label>Full Name</label><input id="ns_name" placeholder="Student full name"/></div>
    <div class="fg"><label>Student ID (auto)</label><input id="ns_id" value="${newId}" readonly/></div></div>
    <div class="form-row"><div class="fg"><label>Department</label><select id="ns_dept"><option>CSE</option><option>ECE</option><option>MECH</option><option>CIVIL</option></select></div>
    <div class="fg"><label>Year</label><select id="ns_year"><option>1</option><option>2</option><option>3</option><option>4</option></select></div></div>
    <div class="form-row"><div class="fg"><label>Section</label><select id="ns_sec"><option>A</option><option>B</option><option>C</option></select></div>
    <div class="fg"><label>Date of Birth</label><input type="date" id="ns_dob"/></div></div>
    <div class="form-row"><div class="fg"><label>Email</label><input type="email" id="ns_email" placeholder="student@email.com"/></div>
    <div class="fg"><label>Phone</label><input id="ns_phone" placeholder="10-digit number"/></div></div>
    <div class="form-row"><div class="fg"><label>Guardian Name</label><input id="ns_guardian" placeholder="Parent / Guardian name"/></div>
    <div class="fg"><label>Password</label><input id="ns_pass" value="student123" /></div></div>
  `, [
    { label: 'Cancel', cls: 'btn-sm btn-outline', action: closeModal },
    { label: 'Create Account', cls: 'btn-sm btn-primary', action: function () {
      var name = document.getElementById('ns_name').value.trim();
      if (!name) {
        toast('Enter student name', 'red');
        return;
      }
      DB.students.push({
        id: newId,
        pass: document.getElementById('ns_pass').value || 'student123',
        name: name,
        dept: document.getElementById('ns_dept').value,
        year: +document.getElementById('ns_year').value,
        section: document.getElementById('ns_sec').value,
        email: document.getElementById('ns_email').value,
        phone: document.getElementById('ns_phone').value,
        dob: document.getElementById('ns_dob').value,
        guardian: document.getElementById('ns_guardian').value,
        join: new Date().toISOString().split('T')[0],
      });
      closeModal();
      renderStudentTable();
      toast('Student account created: ' + newId);
    } },
  ]);
}

function editStudent(id) {
  var student = DB.students.find(function (candidate) {
    return candidate.id === id;
  });
  if (!student) return;
  openModal('Edit Student - ' + student.name, `
    <div class="form-row"><div class="fg"><label>Full Name</label><input id="es_name" value="${student.name}"/></div>
    <div class="fg"><label>Email</label><input id="es_email" value="${student.email}"/></div></div>
    <div class="form-row"><div class="fg"><label>Phone</label><input id="es_phone" value="${student.phone}"/></div>
    <div class="fg"><label>Guardian</label><input id="es_guardian" value="${student.guardian || ''}"/></div></div>
    <div class="form-row"><div class="fg"><label>Year</label><select id="es_year">${[1,2,3,4].map(function (year) { return `<option ${student.year == year ? 'selected' : ''}>${year}</option>`; }).join('')}</select></div>
    <div class="fg"><label>Section</label><select id="es_sec">${['A','B','C'].map(function (section) { return `<option ${student.section === section ? 'selected' : ''}>${section}</option>`; }).join('')}</select></div></div>
    <div class="form-row"><div class="fg"><label>Reset Password</label><input id="es_pass" value="${student.pass}"/></div></div>
  `, [
    { label: 'Cancel', cls: 'btn-sm btn-outline', action: closeModal },
    { label: 'Save Changes', cls: 'btn-sm btn-primary', action: function () {
      student.name = document.getElementById('es_name').value;
      student.email = document.getElementById('es_email').value;
      student.phone = document.getElementById('es_phone').value;
      student.guardian = document.getElementById('es_guardian').value;
      student.year = +document.getElementById('es_year').value;
      student.section = document.getElementById('es_sec').value;
      student.pass = document.getElementById('es_pass').value;
      closeModal();
      renderStudentTable();
      toast('Student updated');
    } },
  ]);
}

function deleteStudent(id) {
  if (!confirm('Delete this student account?')) return;
  DB.students = DB.students.filter(function (student) {
    return student.id !== id;
  });
  renderStudentTable();
  toast('Student removed');
}

function adminFaculty(container) {
  var faculty = DB.users.filter(function (user) {
    return user.role === 'faculty';
  });
  container.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h3>Faculty Members (${faculty.length})</h3>
      <button class="btn-sm btn-primary" onclick="openCreateFaculty()">+ Add Faculty</button>
    </div>
    <div class="card-body" style="padding:0">
      <table class="tbl" id="facTable">
        <thead><tr><th>#</th><th>Name</th><th>ID</th><th>Department</th><th>Subjects</th><th>Email</th><th>Actions</th></tr></thead>
        <tbody id="facTbody"></tbody>
      </table>
    </div>
  </div>`;
  renderFacultyTable();
}

function renderFacultyTable() {
  var tbody = document.getElementById('facTbody');
  if (!tbody) return;
  var faculty = DB.users.filter(function (user) {
    return user.role === 'faculty';
  });
  tbody.innerHTML = faculty.map(function (facultyMember, index) {
    return `
    <tr>
      <td>${index + 1}</td>
      <td><span class="avatar-sm av-teal">${facultyMember.name[0]}</span>${facultyMember.name}</td>
      <td><span class="badge b-blue">${facultyMember.id}</span></td>
      <td>${facultyMember.dept}</td>
      <td>${(facultyMember.subjects || []).join(', ')}</td>
      <td>${facultyMember.email}</td>
      <td><div class="btn-row">
        <button class="btn-sm btn-outline" onclick="editFaculty('${facultyMember.id}')">Edit</button>
        <button class="btn-sm btn-danger" onclick="deleteFaculty('${facultyMember.id}')">Delete</button>
      </div></td>
    </tr>`;
  }).join('');
}

function openCreateFaculty() {
  var newId = nextId('FAC');
  openModal('Create Faculty Account', `
    <div class="form-row"><div class="fg"><label>Full Name</label><input id="nf_name" placeholder="Dr. / Prof. Full Name"/></div>
    <div class="fg"><label>Faculty ID (auto)</label><input id="nf_id" value="${newId}" readonly/></div></div>
    <div class="form-row"><div class="fg"><label>Department</label><select id="nf_dept"><option>Computer Science</option><option>Electronics</option><option>Mechanical</option><option>Civil</option><option>Mathematics</option></select></div>
    <div class="fg"><label>Email</label><input type="email" id="nf_email" placeholder="faculty@unierp.edu"/></div></div>
    <div class="form-row"><div class="fg"><label>Phone</label><input id="nf_phone" placeholder="10-digit"/></div>
    <div class="fg"><label>Password</label><input id="nf_pass" value="faculty123"/></div></div>
    <div class="form-row full"><div class="fg"><label>Subjects (comma separated)</label><input id="nf_subjects" placeholder="e.g. Data Structures, DBMS"/></div></div>
  `, [
    { label: 'Cancel', cls: 'btn-sm btn-outline', action: closeModal },
    { label: 'Create Account', cls: 'btn-sm btn-primary', action: function () {
      var name = document.getElementById('nf_name').value.trim();
      if (!name) {
        toast('Enter faculty name', 'red');
        return;
      }
      DB.users.push({
        id: newId,
        pass: document.getElementById('nf_pass').value || 'faculty123',
        role: 'faculty',
        name: name,
        dept: document.getElementById('nf_dept').value,
        email: document.getElementById('nf_email').value,
        phone: document.getElementById('nf_phone').value,
        subjects: document.getElementById('nf_subjects').value.split(',').map(function (subject) { return subject.trim(); }).filter(Boolean),
        join: new Date().toISOString().split('T')[0],
      });
      closeModal();
      renderFacultyTable();
      toast('Faculty account created: ' + newId);
    } },
  ]);
}

function editFaculty(id) {
  var facultyMember = DB.users.find(function (candidate) {
    return candidate.id === id;
  });
  if (!facultyMember) return;
  openModal('Edit Faculty - ' + facultyMember.name, `
    <div class="form-row"><div class="fg"><label>Full Name</label><input id="ef_name" value="${facultyMember.name}"/></div>
    <div class="fg"><label>Email</label><input id="ef_email" value="${facultyMember.email}"/></div></div>
    <div class="form-row"><div class="fg"><label>Phone</label><input id="ef_phone" value="${facultyMember.phone}"/></div>
    <div class="fg"><label>Department</label><input id="ef_dept" value="${facultyMember.dept}"/></div></div>
    <div class="form-row full"><div class="fg"><label>Subjects</label><input id="ef_subjects" value="${(facultyMember.subjects || []).join(', ')}"/></div></div>
    <div class="form-row"><div class="fg"><label>Reset Password</label><input id="ef_pass" value="${facultyMember.pass}"/></div></div>
  `, [
    { label: 'Cancel', cls: 'btn-sm btn-outline', action: closeModal },
    { label: 'Save Changes', cls: 'btn-sm btn-primary', action: function () {
      facultyMember.name = document.getElementById('ef_name').value;
      facultyMember.email = document.getElementById('ef_email').value;
      facultyMember.phone = document.getElementById('ef_phone').value;
      facultyMember.dept = document.getElementById('ef_dept').value;
      facultyMember.subjects = document.getElementById('ef_subjects').value.split(',').map(function (subject) { return subject.trim(); }).filter(Boolean);
      facultyMember.pass = document.getElementById('ef_pass').value;
      closeModal();
      renderFacultyTable();
      toast('Faculty updated');
    } },
  ]);
}

function deleteFaculty(id) {
  if (!confirm('Delete this faculty account?')) return;
  DB.users = DB.users.filter(function (user) {
    return user.id !== id;
  });
  renderFacultyTable();
  toast('Faculty removed');
}

function adminCourses(container) {
  container.innerHTML = `
  <div class="card">
    <div class="card-header"><h3>Courses (${DB.courses.length})</h3>
      <button class="btn-sm btn-primary" onclick="addCourse()">+ Add Course</button>
    </div>
    <div class="card-body" style="padding:0">
      <table class="tbl"><thead><tr><th>#</th><th>Course Name</th><th>Actions</th></tr></thead>
      <tbody id="courseTbody"></tbody></table>
    </div>
  </div>`;
  renderCourses();
}

function renderCourses() {
  var tbody = document.getElementById('courseTbody');
  if (!tbody) return;
  tbody.innerHTML = DB.courses.map(function (course, index) {
    return `
    <tr><td>${index + 1}</td><td>${course}</td><td>
      <button class="btn-sm btn-danger" onclick="deleteCourse(${index})">Remove</button>
    </td></tr>`;
  }).join('');
}

function addCourse() {
  openModal('Add New Course', `
    <div class="fg"><label>Course Name</label><input id="nc_name" placeholder="e.g. Machine Learning"/></div>
  `, [
    { label: 'Cancel', cls: 'btn-sm btn-outline', action: closeModal },
    { label: 'Add Course', cls: 'btn-sm btn-primary', action: function () {
      var courseName = document.getElementById('nc_name').value.trim();
      if (!courseName) {
        toast('Enter course name', 'red');
        return;
      }
      DB.courses.push(courseName);
      closeModal();
      renderCourses();
      toast('Course added');
    } },
  ]);
}

function deleteCourse(index) {
  DB.courses.splice(index, 1);
  renderCourses();
  toast('Course removed');
}

function adminNotices(container) {
  renderNoticesPage(container, true);
}

function adminProfile(container) {
  renderProfilePage(container, currentUser);
}
