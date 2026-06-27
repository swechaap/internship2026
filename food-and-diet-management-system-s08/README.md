# 🥗 NutriTracker — Smart Nutrition & Diet Tracking System

A full-stack nutrition and diet tracking web application that helps users monitor daily meals, calculate BMI, receive personalized diet recommendations, and track their fitness progress through an interactive dashboard.
**Live Demo:** *Add your deployed application link here*
Example: https://nutritracker.onrender.com
---
# Project Overview
NutriTracker is a nutrition management web application built using **Python (Flask)**, **HTML**, **CSS**, **JavaScript**, and **SQLite**. It enables users to maintain healthy eating habits by tracking meals, monitoring nutritional intake, calculating BMI, and setting personalized fitness goals.

The application provides an intuitive interface for managing daily nutrition while offering AI-inspired diet recommendations based on user health information.

---
# Purpose
* Help users maintain healthy eating habits.
* Track daily calorie and nutrition intake.
* Calculate BMI and daily calorie requirements.
* Recommend personalized diet plans.
* Monitor progress toward fitness goals.
* Provide a simple and user-friendly nutrition management platform.

---
# Features
* Secure User Registration & Login
* User Profile Management
* Automatic BMI Calculator
* Daily Calorie Requirement Calculator
* Personalized Diet Recommendations
* Breakfast, Lunch, Dinner & Snack Tracking
* Nutrition Monitoring (Calories, Protein, Carbs, Fat, Fiber)
* Water Intake Tracking
* Weekly Nutrition Reports
* Goal Setting & Progress Tracking
* Responsive Dashboard
* Secure Password Hashing & Authentication
---
# Technologies Used
| Technology       | Purpose                    |
| ---------------- | -------------------------- |
| Python           | Backend Development        |
| Flask            | Web Framework              |
| Flask-SQLAlchemy | Database ORM               |
| Flask-Login      | User Authentication        |
| SQLite           | Database                   |
| HTML5            | Page Structure             |
| CSS3             | Styling & Responsive UI    |
| JavaScript       | Client-side Interactivity  |
| Werkzeug         | Password Hashing           |
| Flask-WTF        | Form Handling & Validation |

---
# Folder Structure

```text
NutriTracker/
│
├── run.py                     ← Application Entry Point
├── requirements.txt           ← Python Dependencies
├── README.md                  ← Project Documentation
│
├── app/
│   ├── __init__.py            ← Flask App Initialization
│   ├── models.py              ← Database Models
│   ├── routes.py              ← Application Routes
│   ├── nutrition.db           ← SQLite Database
│   │
│   ├── templates/
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── login.html
│   │   ├── signup.html
│   │   ├── dashboard.html
│   │   ├── meals.html
│   │   ├── profile.html
│   │   ├── edit_profile.html
│   │   └── progress.html
│   │
│   └── static/
│       ├── css/
│       │   └── style.css
│       │
│       └── js/
│           └── main.js
│
└── requirements.txt
```
---
# How to Run

### Clone the Repository

```bash
git clone <repository-url>
cd NutriTracker
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run the Application

```bash
python run.py
```

### Open Browser

```
http://localhost:5000
```

---

# Application Workflow

### Home

Landing page introducing NutriTracker and its features.

### Authentication

Create a new account or securely log in.

### Profile

Enter personal information including:

* Age
* Height
* Weight
* Gender
* Activity Level

The system automatically calculates:

* BMI
* Daily Calorie Requirement

### Meal Tracking

Track:

* 🍳 Breakfast
* 🍛 Lunch
* 🍽 Dinner
* 🍎 Snacks

Each meal records:

* Calories
* Protein
* Carbohydrates
* Fat
* Fiber

### Dashboard

Monitor:

* Daily Nutrition Summary
* Weekly Progress
* Goal Achievement
* Calorie Consumption
* Nutrition Breakdown

---

# Technical Highlights

* Secure Authentication System
* Password Hashing using Werkzeug
* SQLite Database Integration
* SQLAlchemy ORM
* Responsive User Interface
* Automatic BMI Calculation
* Harris-Benedict Calorie Formula
* Session Management
* RESTful Flask Routing
* Mobile-Friendly Design

---

# Database Tables

* User
* FoodItem
* Meal
* MealItem
* UserGoal
* GoalProgress
* DailyNutrition

---

# Target Users

* Students
* Working Professionals
* Fitness Enthusiasts
* Weight Loss Seekers
* Muscle Gain Users
* Health-Conscious Individuals
---
# Browser Support
* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari
---
# Testing Checklist
* User Registration
* Login & Logout
* Profile Update
* BMI Calculation
* Calorie Calculation
* Meal Tracking
* Nutrition Dashboard
* Goal Tracking
* Weekly Progress Reports
* Responsive Design
* Database Connectivity
---
# Future Improvements
* AI-powered Diet Recommendation using LLMs
* Barcode Scanner for Food Items
* Mobile Application
* Food Image Recognition
* Email Notifications
* Health Report PDF Export
* Doctor Consultation Module
* Workout Recommendation System
* Cloud Database Integration
* Multi-language Support
---
# Deployment
Deploy using:
* Render
* Railway
* PythonAnywhere
* Heroku
* Azure App Service
**Live Demo:** *(Add your deployment link here)*

---
# Learning Outcomes

This project demonstrates practical knowledge of:

* Full Stack Web Development
* Flask Framework
* Database Design
* Authentication & Authorization
* CRUD Operations
* Responsive Web Design
* Nutrition Tracking Systems
* Software Architecture
* RESTful Development
* Python Backend Programming
---
# Conclusion

NutriTracker is a complete nutrition and diet tracking platform designed to help users develop healthier lifestyles through smart meal logging, personalized calorie analysis, and nutrition monitoring. The project combines modern web technologies with health-focused features to deliver an efficient, secure, and user-friendly solution suitable for students, fitness enthusiasts, and health-conscious individuals.
