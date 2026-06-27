function getStartupPage() {
  try {
    var params = new URLSearchParams(window.location.search);
    var page = params.get('page') || params.get('start');
    if (page && routeHandlers && routeHandlers[page]) {
      return page;
    }
  } catch (err) {}
  return getDefaultPage();
}

function doLogin() {
  var id = document.getElementById('loginId').value.trim();
  var pass = document.getElementById('loginPass').value.trim();

  var user = DB.users.find(function (candidate) {
    return candidate.id === id && candidate.pass === pass;
  });

  if (!user) {
    var student = DB.students.find(function (candidate) {
      return candidate.id === id && candidate.pass === pass;
    });
    if (student) {
      student.role = 'student';
      user = student;
    }
  }

  if (!user) {
    toast('Invalid credentials', 'red');
    return;
  }

  currentUser = user;
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('app').classList.add('show');
  setupSidebar();
  navigate(getStartupPage());
  document.getElementById('topDate').textContent = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  document.getElementById('topAvatar').textContent = user.name.charAt(0).toUpperCase();
}

function doLogout() {
  currentUser = null;
  document.getElementById('app').classList.remove('show');
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginId').value = '';
  document.getElementById('loginPass').value = '';
}
