# AI-Powered Financial Management System - Complete Project Generation Prompt

## Objective

Build a production-ready, fully responsive, AI-powered Financial Management System (FMS) using modern web technologies. The application must be deployable, scalable, secure, and follow industry-standard software engineering practices.

The AI coding agent should generate the entire project from scratch, including frontend, backend, database schema, authentication, authorization, AI integrations, testing data, deployment configuration, documentation, and API design.

---

# Project Name

FinanceFlow AI

---

# Tech Stack

## Frontend

* React.js +(Vite)
* Tailwind CSS
* Shadcn UI
* React Router DOM
* Axios
* React Hook Form
* Zod Validation
* Chart.js

## Backend

* Spring Boot 3
* Spring Security
* Spring Data JPA
* JWT Authentication
* Maven

## Database

* MySQL 8

## AI Integrations

### OCR

* Tesseract OCR

### AI Assistant

* Gemini API Integration

Features:

* Financial Question Answering
* Monthly Summary Generation
* Budget Insights
* Spending Analysis

## Deployment

### Frontend

Vercel

### Backend

Render

### Database

Railway MySQL

---

# User Roles

## Accountant

Permissions:

* Create expenses
* Edit expenses
* View expenses
* Upload receipts
* View reports

Restrictions:

* Cannot approve expenses
* Cannot manage users
* Cannot change system settings

---

## Manager

Permissions:

* View expenses
* Approve expenses
* Reject expenses
* View department reports
* View budgets

Restrictions:

* Cannot manage users
* Cannot change system settings
* Cannot view payroll data

---

## Admin

Permissions:

* Full access
* Manage users
* Manage roles
* View audit logs
* Manage departments

---

# Authentication

Implement:

* JWT Authentication
* Login
* Logout
* Role-Based Access Control
* Refresh Token
* Password Encryption using BCrypt

---

# Demo Credentials

Generate seeded demo users:

Admin

Email:
[admin@financeflow.com](mailto:admin@financeflow.com)

Password:
Admin@123

Role:
ADMIN

---

Manager

Email:
[manager@financeflow.com](mailto:manager@financeflow.com)

Password:
Manager@123

Role:
MANAGER

---

Accountant

Email:
[accountant@financeflow.com](mailto:accountant@financeflow.com)

Password:
Accountant@123

Role:
ACCOUNTANT

---

# Core Modules

## 1. Dashboard

Create separate dashboards for each role.

### Admin Dashboard

Show:

* Total Users
* Total Expenses
* Pending Approvals
* Monthly Expense Trend
* Audit Activities

---

### Manager Dashboard

Show:

* Pending Approvals
* Approved Expenses
* Rejected Expenses
* Budget Utilization
* Department Analytics

---

### Accountant Dashboard

Show:

* Total Submitted Expenses
* Pending Expenses
* Approved Expenses
* Recent Activity

---

# 2. Expense Management

Features:

* Create Expense
* Edit Expense
* Delete Expense
* View Expense Details

Fields:

* Expense ID
* Title
* Description
* Amount
* Category
* Department
* Vendor
* Date
* Receipt
* Status

Status Values:

* Pending
* Approved
* Rejected

---

# 3. Receipt OCR AI

Implement receipt upload.

Supported Files:

* JPG
* PNG
* PDF

Workflow:

Upload Receipt

↓

OCR Processing

↓

Extract:

* Vendor Name
* Amount
* Invoice Number
* Date

↓

Auto-fill Expense Form

The user should be able to edit extracted values before submission.

---

# 4. Approval Workflow

Workflow:

Accountant Creates Expense

↓

Status = Pending

↓

Manager Receives Notification

↓

Approve or Reject

↓

Status Updated

↓

Audit Log Generated

---

# 5. Audit Logs

Create immutable audit logs.

Track:

* Login
* Logout
* Expense Creation
* Expense Update
* Expense Approval
* Expense Rejection
* User Creation
* User Deletion

Fields:

* Log ID
* User
* Role
* Action
* Timestamp
* Entity

Audit logs must be read-only.

---

# 6. Department Management

Departments:

* Finance
* HR
* Marketing
* Operations
* IT

Admin can:

* Create Department
* Edit Department
* Delete Department

---

# 7. Budget Management

Managers can create budgets.

Fields:

* Budget Name
* Department
* Allocated Amount
* Used Amount
* Remaining Amount

Generate alerts when:

* 80% utilized
* Budget exceeded

---

# 8. Reports Module

Generate:

## Expense Reports

* Daily
* Weekly
* Monthly
* Yearly

## Department Reports

* Department Spending
* Category Spending

## Budget Reports

* Budget vs Actual

Charts:

* Pie Charts
* Bar Charts
* Line Charts

Export:

* PDF
* Excel

---

# AI Features

## AI Feature 1

Receipt OCR

Use Tesseract OCR.

---

## AI Feature 2

Expense Categorization

Automatically suggest category based on receipt text.

Example:

Hotel

→ Travel

Laptop

→ Equipment

Internet Bill

→ Utilities

---

## AI Feature 3

Financial AI Assistant

Create a chatbot page.

Users can ask:

"What are total expenses this month?"

"Which department spent the most?"

"Show pending approvals."

"Generate financial summary."

The chatbot should use Gemini API and retrieve actual application data from the database.

The AI assistant must never expose database credentials or sensitive information.

---

## AI Feature 4

Monthly Financial Summary

Generate AI summary:

Example:

This month total expenses were ₹2,50,000. The highest spending department was Marketing with ₹90,000. Budget utilization reached 76%. There are currently 8 pending approvals.

---

# UI Requirements

Design Requirements:

* Modern SaaS-style design
* Professional finance dashboard appearance
* Clean typography
* Mobile responsive
* Tablet responsive
* Desktop responsive
* Light and Dark Theme
* Loading skeletons
* Toast notifications
* Error boundaries

Color Palette:

Primary:
#2563EB

Secondary:
#0F172A

Success:
#16A34A

Warning:
#F59E0B

Danger:
#DC2626

Background:
#F8FAFC

Cards:
#FFFFFF

---

# Database Design

Create complete schema.

Required Tables:

users

roles

departments

expenses

expense_approvals

budgets

audit_logs

notifications

receipts

chat_history

Create proper:

* Primary Keys
* Foreign Keys
* Indexes
* Constraints

---

# Backend Requirements

Follow layered architecture.

Structure:

controller

service

repository

dto

entity

security

config

exception

audit

ocr

ai

Use:

* DTO Pattern
* Global Exception Handling
* Validation
* Logging
* API Documentation using Swagger

---

# API Requirements

Generate complete REST APIs.

Examples:

POST /api/auth/login

POST /api/auth/register

GET /api/expenses

POST /api/expenses

PUT /api/expenses/{id}

DELETE /api/expenses/{id}

POST /api/approvals/{id}

GET /api/reports

POST /api/chat

Generate complete API documentation.

---

# Security Requirements

Implement:

* JWT
* BCrypt Password Hashing
* RBAC
* CORS Configuration
* Input Validation
* SQL Injection Protection
* XSS Protection

---

# Deployment Requirements

Frontend:

Deploy to Vercel.

Backend:

Deploy to Render.

Database:

Deploy to Railway MySQL.

Provide:

* Environment Variables
* Production Configuration
* Build Commands
* Deployment Instructions

Generate Docker support as optional.

---

# Testing

Generate:

* Seed Data
* Demo Accounts
* Sample Expenses
* Sample Reports
* Sample Audit Logs

Create test data automatically on first startup.

---

# Documentation

Generate:

* README.md
* Installation Guide
* API Documentation
* Database Schema Documentation
* Deployment Guide
* Architecture Diagram

---

# Expected Output

Generate a complete production-ready full-stack application.

The project should compile successfully, run locally without modification, and be deployable to Vercel, Render, and Railway.

Generate all source code, folder structure, database schema, environment variables, API integrations, frontend pages, backend services, security configuration, OCR integration, AI assistant integration, sample data, testing configuration, and deployment files.

Follow enterprise-grade coding standards and clean architecture principles.
