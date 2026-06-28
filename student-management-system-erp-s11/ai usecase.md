# UniERP AI Use Cases

This document describes how AI is used in the UniERP college management system.

## 1. Purpose

The AI layer helps students, faculty, and administrators make faster decisions, reduce manual work, and generate useful academic insights from the data already inside the ERP.

## 2. User Flow

### 2.1 Admin Flow

1. The admin creates the account and assigns the role.
2. The admin shares the assigned ID and password with the user.
3. The user signs in with the assigned credentials.
4. The system loads the correct dashboard and AI tools for that role.

### 2.2 Faculty Flow

1. The faculty member signs in with the account assigned by the admin.
2. The system opens the faculty dashboard and faculty AI tools.
3. The faculty member selects a subject or uploads material where needed.
4. The faculty member uses AI to generate analysis, question papers, or evaluation support.
5. The result is shown in the page, report panel, or export view.
6. The faculty member can save, export, or refine the output.

### 2.3 Student Flow

1. The student signs in with the account assigned by the admin.
2. The system opens the student dashboard and student AI tools.
3. The student navigates to AI Studio or a specific AI feature.
4. The student enters a question, selects a tool, or uploads supported content.
5. The system shows the result in the page, report panel, or chat window.
6. The student can save, export, or continue refining the result.

## 3. Project Flow

1. The browser loads the static front-end files from the project root.
2. The AI screen reads the current user record, including the admin-assigned role, and local browser storage.
3. Browser-based AI tools generate local insights when possible.
4. Chat and attendance requests are sent to the local Node server.
5. The Node server validates the request, applies rate limiting, and checks the cache.
6. If needed, the server forwards the request to NVIDIA Nemotron.
7. The server returns the response as JSON.
8. The UI renders the result and stores reports or chat history in browser storage.

## 4. Primary AI Users

- Students
- Faculty members
- Administrators
- Academic office staff

## 5. AI Capabilities

- Student performance analysis
- Attendance prediction
- Assignment summarization and assistance
- Study plan generation
- CGPA prediction
- Class performance analysis
- Question paper generation
- Assignment evaluation support
- Student risk detection
- Resource utilization analytics
- Feedback sentiment analysis
- Academic calendar search
- Conversational AI concierge

## 6. Use Cases

### 6.1 Student Performance Tracker

Actor: Student  
Goal: Understand current academic standing and weak areas.

Inputs
- Student marks
- Attendance summary
- Subject-wise performance history

AI Output
- Overall score estimate
- Weakest subject
- Confidence level
- Suggested study focus topics

Value
- Helps students identify what to revise first.
- Reduces guesswork before exams.

### 6.2 Attendance Predictor

Actor: Student  
Goal: Check attendance risk and safe-skip limits.

Inputs
- Total classes
- Classes attended
- Remaining classes

AI Output
- Current attendance percentage
- Classes needed to reach 75%
- Maximum safe skips
- Risk level

Value
- Helps students avoid falling below attendance thresholds.

### 6.3 Assignment Assistant

Actor: Student  
Goal: Get help understanding uploaded assignment material.

Inputs
- Uploaded text-based files
- Prompt hints from the student

AI Output
- Summary of the uploaded content
- Key concepts and keywords
- Flashcard-style study points
- Suggested questions for revision

Value
- Makes assignments easier to understand.
- Supports faster revision and preparation.

### 6.4 Study Plan Generator

Actor: Student  
Goal: Build a study plan for a target exam date.

Inputs
- Exam date
- Study hours per day
- Available days
- Weak subjects
- Timetable constraints

AI Output
- Day-wise study schedule
- Revision focus areas
- Break recommendations
- Practical pacing advice

Value
- Turns vague preparation into a concrete plan.

### 6.5 CGPA Predictor

Actor: Student  
Goal: Estimate future CGPA based on current performance.

Inputs
- Current SGPA
- Previous CGPA
- Completed credits
- Remaining credits
- Target CGPA

AI Output
- Predicted CGPA
- Required remaining performance
- Gap to target
- Improvement guidance

Value
- Helps students understand what is needed to reach a target CGPA.

### 6.6 Class Performance Analysis

Actor: Faculty  
Goal: Review class-level academic trends for a subject.

Inputs
- Subject selected by faculty
- Attendance data
- Marks data

AI Output
- Performance summary
- Strength and weakness trends
- At-risk student groups
- Suggested intervention areas

Value
- Helps faculty adjust teaching pace and remediation.

### 6.7 Question Paper Generator

Actor: Faculty  
Goal: Generate a draft question paper for a subject.

Inputs
- Subject
- Unit
- Topics
- Difficulty
- Total marks

AI Output
- Structured question paper draft
- Topic coverage guidance
- Marks distribution

Value
- Saves preparation time.
- Gives a quick first draft for review.

### 6.8 Assignment Evaluation Assistant

Actor: Faculty  
Goal: Review submissions and produce feedback support.

Inputs
- Uploaded submissions
- Assignment context

AI Output
- Summary of submissions
- Likely review points
- Feedback suggestions
- Similarity or overlap indicators when available through the workflow

Value
- Speeds up evaluation.
- Helps faculty give more consistent feedback.

### 6.9 Student Risk Detection

Actor: Administrator  
Goal: Find students who may need intervention.

Inputs
- Attendance
- Marks
- Academic patterns

AI Output
- Risk categories
- Reasons for risk
- Recommended follow-up action

Value
- Supports early intervention and student support.

### 6.10 Resource Utilization Analytics

Actor: Administrator  
Goal: Understand how campus spaces are being used.

Inputs
- Room, lab, and seminar usage data
- Capacity values
- Peak usage timings

AI Output
- Utilization summaries
- Overused and underused resources
- Scheduling insights

Value
- Helps optimize timetable and room allocation.

### 6.11 Feedback Sentiment Analysis

Actor: Administrator  
Goal: Review qualitative feedback from students or departments.

Inputs
- Free-text feedback forms

AI Output
- Positive, neutral, or negative patterns
- Common complaint themes
- Improvement suggestions

Value
- Turns raw comments into actionable insight.

### 6.12 Academic Calendar Search

Actor: Student, faculty, admin  
Goal: Ask questions about dates and events.

Inputs
- Natural language question
- Academic calendar dataset

AI Output
- Relevant event matches
- Dates and descriptions
- Search-oriented response

Value
- Makes calendar lookup faster than manual browsing.

### 6.13 AI Concierge Chat

Actor: All users  
Goal: Ask general ERP-related questions in a conversational format.

Inputs
- Chat messages
- Context about the role and current academic data

AI Output
- Conversational replies
- Attendance guidance
- Marks or risk guidance
- Calendar guidance

Value
- Provides a single help surface for many small tasks.

## 7. Data Sources Used by AI

- Student records
- Faculty records
- Attendance logs
- Marks records
- Assignments
- Quizzes and quiz results
- Notices
- Academic calendar
- Resource usage data
- Feedback forms

## 8. Storage Behavior

- AI reports are saved in browser storage.
- AI chat history is saved in browser storage.
- AI theme preference is saved in browser storage.
- Core academic data remains in application memory and resets on reload.

## 9. Backend Behavior

- AI requests are sent through the local Node server.
- The server forwards requests to NVIDIA Nemotron.
- Requests are rate limited per IP.
- Recent responses are cached for short-term reuse.
- Errors are returned in JSON format.

## 10. Limitations

- The current ERP uses seed data, not a live database.
- File upload support is best for text-based content.
- AI output depends on the upstream NVIDIA service and the API key.
- Data changes are not persisted across reloads except for browser-stored AI history and preferences.

## 11. Expected Outcomes

- Faster student self-assessment
- Better attendance compliance
- Easier content preparation for faculty
- Earlier administrative intervention for at-risk students
- More informed planning for campus resources
