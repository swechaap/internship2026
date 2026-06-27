Library Management System 

Project Description

The Library Management System is a database management project developed using MySQL. 
It helps manage books, students, faculty members, book issuance, and reservations efficiently.
The system stores and organizes library records while reducing manual work.

Objectives

- Maintain book records in the library.
- Manage student and faculty information.
- Issue and return books.
- Reserve books for users.
- Track book availability.

Technologies Used

- MySQL Database
- SQL
- GitHub
- Draw.io (Database Schema Design)

Database Tables

Books

- book_id (Primary Key)
- title
- author
- isbn
- category
- quantity
- available

Students

- student_id (Primary Key)
- name
- email
- phone
- department
- year_of_study

Faculty

- faculty_id (Primary Key)
- name
- email
- phone
- department
- designation

Issued_Books

- issue_id (Primary Key)
- book_id (Foreign Key)
- student_id (Foreign Key)
- issue_date
- due_date
- return_date

Reservations

- reservation_id (Primary Key)
- book_id (Foreign Key)
- student_id (Foreign Key)
- reservation_date
- status

Features

- Add and manage books.
- Store student details.
- Store faculty details.
- Issue books to students.
- Reserve books.
- Track available books.
- Manage return dates.

Database Schema

The database contains five main tables:

1. Books
2. Students
3. Faculty
4. Issued_Books
5. Reservations

Relationships are maintained using Primary Keys and Foreign Keys to ensure data integrity.

Sample Records

- Python Programming Book
- Student Information
- Faculty Information
- Book Issue Records
- Reservation Records

Team Members:
1 Divya Chatr -Database + Documentation & Testing + GitHub +report
2 Sai sumith panigrahi & Naseer Mohammad -UI/UX Design(frontend)
3 N. Vaishnavi-Login System
4 Karthik-Book Management
5 Meghana-Issue & Return
6 Bhuvanesh Dhulipalla-Search & Reservation

Conclusion

The Library Management System successfully demonstrates the use of MySQL for managing library operations. The project provides a structured database design for storing and managing books, students, faculty members, issued books, and reservations efficiently.
DEPLOYMENT LINK
https://libraflow-x528.onrender.com
