function facDashboard(container) {
  var myStudents = studentsForFacultySubjects(currentUser.subjects || []);
  container.innerHTML = `
  <div class="stat-grid">
    <div class="stat-card"><div class="sc-icon">Students</div><div class="sc-val">${myStudents.length}</div><div class="sc-lbl">My Students</div><div class="sc-tag tag-blue">Active</div></div>
    <div class="stat-card"><div class="sc-icon">Subjects</div><div class="sc-val">${(currentUser.subjects || []).length}</div><div class="sc-lbl">Subjects</div><div class="sc-tag tag-green">Assigned</div></div>
    <div class="stat-card"><div class="sc-icon">Assignments</div><div class="sc-val">${DB.assignments.filter(function (assignment) { return assignment.faculty === currentUser.id; }).length}</div><div class="sc-lbl">Assignments</div><div class="sc-tag tag-amber">Posted</div></div>
    <div class="stat-card"><div class="sc-icon">Quizzes</div><div class="sc-val">${DB.quizzes.filter(function (quiz) { return quiz.faculty === currentUser.id; }).length}</div><div class="sc-lbl">Quizzes</div><div class="sc-tag tag-blue">Created</div></div>
  </div>
  <div class="card">
    <div class="card-header"><h3>My Subjects</h3></div>
    <div class="card-body">
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        ${(currentUser.subjects || []).map(function (subject) {
          return '<span class="badge b-blue" style="padding:6px 14px;font-size:13px;">' + subject + '</span>';
        }).join('')}
      </div>
    </div>
  </div>
  <div class="card">
    <div class="card-header"><h3>Quick Actions</h3></div>
    <div class="card-body"><div class="btn-row">
      <button class="btn-sm btn-primary" onclick="navigate('facAttendance')">Mark Attendance</button>
      <button class="btn-sm btn-teal" onclick="navigate('facMarks')">Enter Marks</button>
      <button class="btn-sm btn-outline" onclick="navigate('facAssignments')">Assignments</button>
      <button class="btn-sm btn-outline" onclick="navigate('facStudents')">View Students</button>
    </div></div>
  </div>`;
}

function facStudents(container) {
  var subjects = currentUser.subjects || [];
  var myStudents = studentsForFacultySubjects(subjects);
  container.innerHTML = `
  <div class="card">
    <div class="card-header"><h3>My Students (${myStudents.length})</h3></div>
    <div class="card-body" style="padding:0">
      <table class="tbl"><thead><tr><th>#</th><th>Name</th><th>ID</th><th>Dept</th><th>Sec</th><th>Attendance %</th><th>Avg Marks</th></tr></thead>
      <tbody>${myStudents.map(function (student, index) {
        var att = DB.attendance[student.id];
        var attPct = '—';
        if (att) {
          var attValues = Object.values(att).flat();
          attPct = attValues.length ? Math.round(attValues.reduce(function (a, b) { return a + b; }, 0) / attValues.length * 100) + '%' : '—';
        }
        var marks = DB.marks[student.id];
        var avg = '—';
        if (marks) {
          var scores = Object.values(marks).map(function (mark) { return mark.final || 0; });
          avg = scores.length ? Math.round(scores.reduce(function (a, b) { return a + b; }, 0) / scores.length) : '—';
        }
        var attNum = parseInt(attPct, 10) || 0;
        return `<tr>
          <td>${index + 1}</td>
          <td><span class="avatar-sm av-blue">${student.name[0]}</span>${student.name}</td>
          <td><span class="badge b-blue">${student.id}</span></td>
          <td>${student.dept}</td><td>${student.section}</td>
          <td><span class="badge ${attNum < 75 ? 'b-red' : 'b-green'}">${attPct}</span></td>
          <td>${avg !== '—' ? `<span class="badge ${avg >= 60 ? 'b-green' : 'b-amber'}">${avg}/100</span>` : '—'}</td>
        </tr>`;
      }).join('')}</tbody></table>
    </div>
  </div>`;
}

function facAttendance(container) {
  var subjects = currentUser.subjects || [];
  attendanceState = {};
  container.innerHTML = `
  <div class="card">
    <div class="card-header">
      <h3>Mark Attendance</h3>
      <select id="attSubSelect" onchange="refreshAttView()" style="padding:6px 10px;border:1.5px solid var(--border);border-radius:7px;font-size:13px;">
        ${subjects.map(function (subject) { return `<option value="${subject}">${subject}</option>`; }).join('')}
      </select>
    </div>
    <div class="card-body">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <label style="font-size:13px;font-weight:600;">Date:</label>
        <input type="date" id="attDate" value="${new Date().toISOString().split('T')[0]}" style="padding:6px 10px;border:1.5px solid var(--border);border-radius:7px;font-size:13px;"/>
        <button class="btn-sm btn-primary" onclick="markAllPresent()">Mark All Present</button>
        <button class="btn-sm btn-outline" onclick="markAllAbsent()">Mark All Absent</button>
      </div>
      <table class="tbl"><thead><tr><th>#</th><th>Student Name</th><th>ID</th><th>Status</th><th>Toggle</th></tr></thead>
      <tbody id="attTableBody"></tbody></table>
      <div style="margin-top:16px;"><button class="btn-sm btn-success" onclick="saveAttendance()">Save Attendance</button></div>
    </div>
  </div>`;
  refreshAttView();
}

function refreshAttView() {
  var subject = document.getElementById('attSubSelect') ? document.getElementById('attSubSelect').value : '';
  var dept = subjectDept(subject);
  var students = DB.students.filter(function (student) {
    return student.dept === dept;
  });
  students.forEach(function (student) {
    if (attendanceState[student.id] === undefined) attendanceState[student.id] = 1;
  });
  var tbody = document.getElementById('attTableBody');
  if (!tbody) return;
  tbody.innerHTML = students.map(function (student, index) {
    return `
    <tr>
      <td>${index + 1}</td>
      <td><span class="avatar-sm av-blue">${student.name[0]}</span>${student.name}</td>
      <td>${student.id}</td>
      <td><span class="badge ${attendanceState[student.id] ? 'b-green' : 'b-red'}" id="attBadge_${student.id}">${attendanceState[student.id] ? 'Present' : 'Absent'}</span></td>
      <td><button class="btn-sm ${attendanceState[student.id] ? 'btn-danger' : 'btn-success'}" id="attBtn_${student.id}" onclick="toggleAtt('${student.id}')">${attendanceState[student.id] ? 'Mark Absent' : 'Mark Present'}</button></td>
    </tr>`;
  }).join('');
}

function toggleAtt(id) {
  attendanceState[id] = attendanceState[id] ? 0 : 1;
  var badge = document.getElementById('attBadge_' + id);
  var button = document.getElementById('attBtn_' + id);
  if (badge) {
    badge.textContent = attendanceState[id] ? 'Present' : 'Absent';
    badge.className = 'badge ' + (attendanceState[id] ? 'b-green' : 'b-red');
  }
  if (button) {
    button.textContent = attendanceState[id] ? 'Mark Absent' : 'Mark Present';
    button.className = 'btn-sm ' + (attendanceState[id] ? 'btn-danger' : 'btn-success');
  }
}

function markAllPresent() {
  Object.keys(attendanceState).forEach(function (key) {
    attendanceState[key] = 1;
  });
  refreshAttView();
}

function markAllAbsent() {
  Object.keys(attendanceState).forEach(function (key) {
    attendanceState[key] = 0;
  });
  refreshAttView();
}

function saveAttendance() {
  var subject = document.getElementById('attSubSelect') ? document.getElementById('attSubSelect').value : '';
  Object.entries(attendanceState).forEach(function (_ref) {
    var sid = _ref[0];
    var value = _ref[1];
    if (!DB.attendance[sid]) DB.attendance[sid] = {};
    if (!DB.attendance[sid][subject]) DB.attendance[sid][subject] = [];
    DB.attendance[sid][subject].push(value);
  });
  toast('Attendance saved successfully');
}

function facMarks(container) {
  var subjects = currentUser.subjects || [];
  container.innerHTML = `
  <div class="card">
    <div class="card-header"><h3>Enter Marks</h3>
      <select id="marksSubSelect" onchange="refreshMarksView()" style="padding:6px 10px;border:1.5px solid var(--border);border-radius:7px;font-size:13px;">
        ${subjects.map(function (subject) { return `<option value="${subject}">${subject}</option>`; }).join('')}
      </select>
    </div>
    <div class="card-body" style="padding:0">
      <table class="tbl"><thead><tr><th>#</th><th>Student</th><th>Mid-1 (/50)</th><th>Mid-2 (/50)</th><th>Assignment (/20)</th><th>Final (/100)</th><th>Grade</th></tr></thead>
      <tbody id="marksTableBody"></tbody></table>
      <div style="padding:16px;"><button class="btn-sm btn-success" onclick="saveMarks()">Save Marks</button></div>
    </div>
  </div>`;
  refreshMarksView();
}

function refreshMarksView() {
  var subject = document.getElementById('marksSubSelect') ? document.getElementById('marksSubSelect').value : '';
  var dept = subjectDept(subject);
  var students = DB.students.filter(function (student) {
    return student.dept === dept;
  });
  var tbody = document.getElementById('marksTableBody');
  if (!tbody) return;
  tbody.innerHTML = students.map(function (student, index) {
    var mark = (DB.marks[student.id] || {})[subject] || { mid1: 0, mid2: 0, assign: 0, final: 0 };
    var grade = mark.final >= 90 ? 'O' : mark.final >= 80 ? 'A+' : mark.final >= 70 ? 'A' : mark.final >= 60 ? 'B+' : mark.final >= 50 ? 'B' : 'F';
    var gradeClass = mark.final >= 60 ? 'b-green' : mark.final >= 50 ? 'b-amber' : 'b-red';
    return `<tr>
      <td>${index + 1}</td>
      <td><span class="avatar-sm av-blue">${student.name[0]}</span>${student.name}</td>
      <td><input class="marks-input" id="m_mid1_${student.id}" value="${mark.mid1}" type="number" min="0" max="50"/></td>
      <td><input class="marks-input" id="m_mid2_${student.id}" value="${mark.mid2}" type="number" min="0" max="50"/></td>
      <td><input class="marks-input" id="m_assign_${student.id}" value="${mark.assign}" type="number" min="0" max="20"/></td>
      <td><input class="marks-input" id="m_final_${student.id}" value="${mark.final}" type="number" min="0" max="100"/></td>
      <td><span class="badge ${gradeClass}">${grade}</span></td>
    </tr>`;
  }).join('');
}

function saveMarks() {
  var subject = document.getElementById('marksSubSelect') ? document.getElementById('marksSubSelect').value : '';
  var dept = subjectDept(subject);
  DB.students.filter(function (student) {
    return student.dept === dept;
  }).forEach(function (student) {
    if (!DB.marks[student.id]) DB.marks[student.id] = {};
    DB.marks[student.id][subject] = {
      mid1: +document.getElementById('m_mid1_' + student.id).value || 0,
      mid2: +document.getElementById('m_mid2_' + student.id).value || 0,
      assign: +document.getElementById('m_assign_' + student.id).value || 0,
      final: +document.getElementById('m_final_' + student.id).value || 0,
    };
  });
  toast('Marks saved successfully');
}

function facAssignments(container) {
  var mine = DB.assignments.filter(function (assignment) {
    return assignment.faculty === currentUser.id;
  });
  container.innerHTML = `
  <div class="card">
    <div class="card-header"><h3>Assignments (${mine.length})</h3>
      <button class="btn-sm btn-primary" onclick="createAssignment()">+ New Assignment</button>
    </div>
    <div class="card-body" style="padding:0">
      <table class="tbl"><thead><tr><th>Title</th><th>Subject</th><th>Due Date</th><th>Max Marks</th><th>Submissions</th><th>Actions</th></tr></thead>
      <tbody>${mine.map(function (assignment) {
        return `<tr>
        <td><strong>${assignment.title}</strong></td><td>${assignment.subject}</td><td>${assignment.due}</td>
        <td>${assignment.maxMarks}</td><td><span class="badge b-blue">${assignment.submissions.length}</span></td>
        <td><button class="btn-sm btn-outline" onclick="viewSubmissions('${assignment.id}')">View Submissions</button></td>
      </tr>`;
      }).join('')}</tbody>
    </table></div></div>`;
}

function createAssignment() {
  var subjects = currentUser.subjects || [];
  openModal('Create New Assignment', `
    <div class="form-row full"><div class="fg"><label>Title</label><input id="na_title" placeholder="Assignment title"/></div></div>
    <div class="form-row"><div class="fg"><label>Subject</label><select id="na_sub">${subjects.map(function (subject) { return `<option>${subject}</option>`; }).join('')}</select></div>
    <div class="fg"><label>Due Date</label><input type="date" id="na_due"/></div></div>
    <div class="form-row"><div class="fg"><label>Max Marks</label><input type="number" id="na_marks" value="20" min="1"/></div></div>
    <div class="form-row full"><div class="fg"><label>Description</label><textarea id="na_desc" placeholder="Assignment instructions..."></textarea></div></div>
  `, [
    { label: 'Cancel', cls: 'btn-sm btn-outline', action: closeModal },
    { label: 'Post Assignment', cls: 'btn-sm btn-primary', action: function () {
      var title = document.getElementById('na_title').value.trim();
      if (!title) {
        toast('Enter title', 'red');
        return;
      }
      DB.assignments.push({
        id: 'A' + Date.now(),
        subject: document.getElementById('na_sub').value,
        title: title,
        due: document.getElementById('na_due').value,
        maxMarks: +document.getElementById('na_marks').value || 20,
        faculty: currentUser.id,
        submissions: [],
      });
      closeModal();
      navigate('facAssignments');
      toast('Assignment posted');
    } },
  ]);
}

function viewSubmissions(id) {
  var assignment = DB.assignments.find(function (candidate) {
    return candidate.id === id;
  });
  if (!assignment) return;
  var submissions = assignment.submissions;
  openModal('Submissions - ' + assignment.title, `
    ${submissions.length === 0 ? '<p style="color:var(--muted);text-align:center;padding:20px;">No submissions yet</p>' :
    `<table class="tbl"><thead><tr><th>Student</th><th>File</th><th>Submitted</th><th>Marks</th></tr></thead>
    <tbody>${submissions.map(function (submission) {
      return `<tr>
      <td>${submission.name}</td><td>${submission.file}</td><td>${submission.date}</td>
      <td><input class="marks-input" value="${submission.marks || ''}" placeholder="-" onchange="updateSubMarks('${id}','${submission.sid}',this.value)"/></td>
    </tr>`;
    }).join('')}</tbody></table>`}
  `, [{ label: 'Close', cls: 'btn-sm btn-outline', action: closeModal }]);
}

function updateSubMarks(aid, sid, value) {
  var assignment = DB.assignments.find(function (candidate) {
    return candidate.id === aid;
  });
  if (!assignment) return;
  var submission = assignment.submissions.find(function (candidate) {
    return candidate.sid === sid;
  });
  if (submission) submission.marks = value;
}

function facQuizzes(container) {
  var mine = DB.quizzes.filter(function (quiz) {
    return quiz.faculty === currentUser.id;
  });
  container.innerHTML = `
  <div class="card">
    <div class="card-header"><h3>Quizzes</h3>
      <button class="btn-sm btn-primary" onclick="createQuiz()">+ Create Quiz</button>
    </div>
    <div class="card-body">
      ${mine.map(function (quiz) {
        return `
        <div style="border:1px solid var(--border);border-radius:10px;padding:16px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-weight:700;font-size:15px;">${quiz.title}</div>
              <div style="font-size:12px;color:var(--muted);margin-top:3px;">${quiz.subject} · ${quiz.questions.length} questions · ${quiz.timeLimit} mins</div>
            </div>
            <div class="btn-row">
              <button class="btn-sm btn-outline" onclick="viewQuizResults('${quiz.id}')">Results</button>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function createQuiz() {
  toast('Quiz builder is not implemented yet. Add it as a separate module when ready.', 'amber');
}

function viewQuizResults(qid) {
  var results = Object.entries(DB.quizResults).filter(function (entry) {
    return entry[0].startsWith(qid + '_');
  });
  openModal('Quiz Results', `
    ${results.length === 0 ? '<p style="color:var(--muted);text-align:center;padding:20px;">No attempts yet</p>' :
    `<table class="tbl"><thead><tr><th>Student</th><th>Score</th><th>Status</th></tr></thead>
    <tbody>${results.map(function (entry) {
      var key = entry[0];
      var result = entry[1];
      var sid = key.split('_')[1];
      var student = DB.students.find(function (candidate) {
        return candidate.id === sid;
      });
      var quiz = DB.quizzes.find(function (candidate) {
        return candidate.id === qid;
      });
      var total = quiz ? quiz.questions.length : 0;
      var pct = total ? Math.round(result.score / total * 100) : 0;
      return `<tr><td>${student ? student.name : sid}</td><td>${result.score}/${total} (${pct}%)</td><td><span class="badge ${pct >= 60 ? 'b-green' : 'b-red'}">${pct >= 60 ? 'Pass' : 'Fail'}</span></td></tr>`;
    }).join('')}</tbody></table>`}
  `, [{ label: 'Close', cls: 'btn-sm btn-outline', action: closeModal }]);
}

function facNotices(container) {
  renderNoticesPage(container, true);
}

function facProfile(container) {
  renderProfilePage(container, currentUser);
}
