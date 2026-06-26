# UniERP - College Management System

Live demo: https://college-student-management-system-erp.onrender.com/

UniERP is a browser-based college management system for admins, faculty, and students. It ships as a static front-end app with no build step required.

## Features

- Role-based login for admin, faculty, and student users
- Admin dashboard for managing students, faculty, and courses
- Faculty tools for attendance, marks, assignments, and quizzes
- Student dashboard for attendance, marks, assignments, quizzes, and notices
- Shared notices and profile pages
- Modal dialogs and toast notifications for in-app actions
- Seed data included for quick demo access

## Demo Credentials

- Admin: `admin` / `admin123`
- Faculty: `FAC001` / `faculty123`
- Faculty: `FAC002` / `faculty123`
- Student: `STU001` / `student123`
- Student: `STU002` / `student123`
- Student: `STU003` / `student123`

## Project Structure

- `index.html` - App shell and script loading order
- `css/app.css` - Shared styles and layout
- `js/data.js` - Seed data and shared helpers
- `js/ui.js` - Modal and toast helpers
- `js/sidebar.js` - Sidebar navigation
- `js/auth.js` - Login and logout flow
- `js/router.js` - Page routing and title handling
- `js/shared.js` - Shared notices and profile pages
- `js/admin.js` - Admin management screens
- `js/faculty.js` - Faculty dashboards and tools
- `js/student.js` - Student dashboards and tools
- `js/app.js` - App bootstrap and route registration

## Run Locally

1. Clone or download the project.
2. Open `index.html` in a browser, or serve the folder with any static server.
3. Sign in with one of the demo accounts above.

## Notes

- The app uses in-memory sample data, so changes reset when the page reloads.
- `MODULES.md` contains a module ownership map for parallel development.
