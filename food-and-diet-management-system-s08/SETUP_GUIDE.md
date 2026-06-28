🚀 NutriTracker Setup & Deployment Guide
✅ Application Status: READY TO USE
Your NutriTracker application is fully built and running! The Flask server is currently active on http://localhost:5000

📊 Quick Start
Access the Application
Open your browser and navigate to: http://localhost:5000
You'll see the colorful home page with all features listed
Click "Get Started Now" to sign up
Create Your First Account
Click Sign Up button
Enter username, email, and password
Click Create Account
You're ready to start tracking!
Complete Your Health Profile
After login, go to Profile → Edit Profile
Fill in your:
Age
Weight (kg)
Height (cm)
Gender
Activity Level (how often you exercise)
Fitness Goal (weight loss, maintain, gain)
Save changes
The app will automatically calculate your BMI and daily calorie requirements
Start Logging Meals
Go to Meals page
Click "Add a New Meal"
Select meal type (breakfast, lunch, dinner, snack)
Search for food items from our database (20+ items pre-loaded)
Select quantity and save
Track Your Progress
Go to Progress page
Set fitness goals with target dates
View your last 7 days of nutrition data
Monitor daily calories, protein, carbs, fat, and water intake
🎨 Application Architecture
NutriTracker/
├── Backend (Python Flask)
│   ├── Authentication & User Management
│   ├── Database (SQLite)
│   ├── REST API Endpoints
│   └── Business Logic
│
├── Frontend (HTML/CSS/JavaScript)
│   ├── Colorful food-themed design
│   ├── Responsive layout (mobile, tablet, desktop)
│   ├── Interactive meal tracking
│   └── Progress visualization
│
└── Database
    ├── Users table
    ├── Food items (20+ pre-loaded)
    ├── Meals & nutrition tracking
    └── Goals & progress monitoring
📁 File Structure
c:\Users\HP\OneDrive\Desktop\food/
│
├── run.py                      # Application entry point
├── requirements.txt            # Python dependencies
├── README.md                   # Full documentation
├── SETUP_GUIDE.md             # This file
│
└── app/
    ├── __init__.py            # Flask app factory
    ├── models.py              # Database models
    ├── routes.py              # API routes and views
    │
    ├── nutrition.db           # SQLite database (auto-created)
    │
    ├── templates/             # HTML pages
    │   ├── base.html          # Base template with navigation
    │   ├── index.html         # Home page
    │   ├── login.html         # Login page
    │   ├── signup.html        # Registration page
    │   ├── dashboard.html     # Main dashboard
    │   ├── meals.html         # Meal tracking
    │   ├── profile.html       # User profile view
    │   ├── edit_profile.html  # Profile editor
    │   └── progress.html      # Progress dashboard
    │
    └── static/                # Static files
        ├── css/
        │   └── style.css      # Colorful food-themed styles
        └── js/
            └── main.js        # JavaScript functionality
🔧 System Requirements
Python 3.8 or higher
50 MB disk space
Any modern web browser (Chrome, Firefox, Safari, Edge)
Windows, macOS, or Linux
⚙️ Installation (Already Complete)
The application has been fully installed and tested:

✅ Python dependencies installed
✅ Database created with sample data
✅ All files in place
✅ Server running and tested

🌐 Accessing the Application
Local Access
URL: http://localhost:5000
Server: Running on Python Flask development server
Port: 5000
Stopping the Server
Press CTRL+C in the terminal running the server
Restarting the Server
cd c:\Users\HP\OneDrive\Desktop\food
python run.py
📚 Database Information
Pre-loaded Food Items (20+)
Breakfast Items:

Oatmeal, Eggs, Toast, Banana, Milk
Proteins:

Chicken Breast, Salmon, Lean Beef
Vegetables:

Broccoli, Spinach, Sweet Potato
Grains:

Brown Rice, Pasta
Snacks:

Almonds, Yogurt, Apple, Peanut Butter
Beverages:

Water, Coffee, Tea, Juice
Database Features
Auto-calculated nutrition values
Quantity-based tracking
Daily summaries
7-day history
Goal progress tracking
🎯 Feature Walkthrough
1. Health Assessment Module
Input: Age, weight, height, gender, activity level
Processing: Automatic BMI and calorie calculation
Output: Personalized daily calorie goals
2. Meal Tracking Module
Log meals: Breakfast, Lunch, Dinner, Snacks
Search 20+ food items
Track quantity consumed
View nutrition breakdown
3. Nutrition Monitoring
Daily calorie consumption
Macro nutrients (Protein, Carbs, Fat)
Fiber tracking
Water intake monitoring
4. Progress Dashboard
Set fitness goals
View 7-day nutrition history
Track weight goals
Monitor progress over time
💻 Sample User Workflow
Day 1: Setup
Visit http://localhost:5000
Sign up with username/email/password
Edit profile with health data
View calculated BMI and calorie goals
Day 1-7: Daily Usage
Go to Meals page
Add breakfast items
Add lunch items
Add dinner items
Add snacks as needed
View daily totals on dashboard
Week 1: Review Progress
Go to Progress page
View 7-day nutrition history
Compare to daily goals
Set new fitness goals
🔐 Security Notes
Passwords are hashed using Werkzeug
User data is stored locally in SQLite
Each user can only see their own data
Login required for all features
📊 Sample Calculations
BMI Example
User: 70kg, 175cm
BMI = 70 / (1.75²) = 22.86 (Healthy Weight)
Daily Calorie Example
Male, 30 years, 70kg, 175cm, Moderate activity
BMR = 88.362 + (13.397 × 70) + (4.799 × 175) - (5.677 × 30)
    = 1,710 calories
TDEE = 1,710 × 1.55 = 2,650 calories/day
🐛 Troubleshooting
Issue: Port 5000 already in use
Solution: Change port in run.py

app.run(debug=True, port=5001)  # Use different port
Issue: Database errors
Solution: Delete database and restart

cd c:\Users\HP\OneDrive\Desktop\food
del app\nutrition.db
python run.py
Issue: Login not working
Solution: Make sure you signed up first, then use same credentials

Issue: Meals not saving
Solution: Complete your profile first for nutrition calculations

🚀 Performance Tips
First Load: May take 2-3 seconds (Flask startup)
Add Food: Use search to find items quickly
Track Consistently: Log meals same time each day
Review Weekly: Check progress every Sunday
📈 What's Next?
For Users
Add more food items to database
Set weekly fitness challenges
Share progress with friends
Track consistency over months
For Developers
Add charts/graphs for visualization
Integrate with fitness trackers
Add recipe suggestions
Mobile app development
📞 Common Questions
Q: Can I change my password?
A: Currently not available. Create a new account if needed.

Q: How many meals can I log?
A: Unlimited. The app stores complete history.

Q: Can I export my data?
A: The progress page shows all historical data.

Q: How accurate are the calculations?
A: Uses Harris-Benedict equation for calorie needs. Accuracy depends on data accuracy.

✨ Application Highlights
Colorful Design
Food-themed color palette
Vibrant gradients
Easy-on-eyes styling
Mobile-responsive
Complete Features
Full user authentication
Comprehensive nutrition tracking
Goal setting and monitoring
Weekly progress reports
Pre-loaded Data
20+ common foods
Accurate nutritional values
Macro and micro nutrients
Serving size information
User-Friendly Interface
Intuitive navigation
Clear food search
Visual nutrition summaries
Progress indicators
🎉 You're All Set!
Your NutriTracker application is ready to use. Visit http://localhost:5000 and start your journey to better health!

Features Ready:

✅ User Authentication
✅ Health Assessment
✅ Meal Tracking
✅ Nutrition Monitoring
✅ Progress Dashboard
✅ Food Database
✅ Goal Tracking
Happy Tracking! 🥗🍎💪

For more information, see README.md