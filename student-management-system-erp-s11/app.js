registerRoutes({
  adminDashboard: adminDashboard,
  aiHub: aiHub,
  adminAttendance: adminAttendance,
  adminStudents: adminStudents,
  adminFaculty: adminFaculty,
  adminCourses: adminCourses,
  adminNotices: adminNotices,
  adminProfile: adminProfile,
  facDashboard: facDashboard,
  facStudents: facStudents,
  facAttendance: facAttendance,
  facMarks: facMarks,
  facAssignments: facAssignments,
  facQuizzes: facQuizzes,
  facNotices: facNotices,
  facProfile: facProfile,
  stuDashboard: stuDashboard,
  stuAttendance: stuAttendance,
  stuMarks: stuMarks,
  stuAssignments: stuAssignments,
  stuQuizzes: stuQuizzes,
  stuNotices: stuNotices,
  stuProfile: stuProfile,
});

document.addEventListener('DOMContentLoaded', function () {
  var pass = document.getElementById('loginPass');
  var id = document.getElementById('loginId');

  pass.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') doLogin();
  });

  id.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') pass.focus();
  });
});
