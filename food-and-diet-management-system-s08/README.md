🥗 NutriTracker - Nutrition & Diet Tracking Application
A comprehensive, colorful web application for tracking nutrition, managing diet plans, and achieving fitness goals using Python, Flask, and SQLite.

###🌟 Features

###Module 1: Login System
User Sign Up - Create new account with email validation
User Login - Secure authentication
Profile Management - Update personal information

###Module 2: Health Assessment
Enter Health Details - Age, weight, height, gender, activity level
BMI Calculation - Automatic BMI computation
Calorie Requirement Analysis - Harris-Benedict equation for personalized calorie goals

###Module 3: AI Diet Recommendation
AI Analyzes User Data - Based on health profile and goals
Personalized Diet Plans - Customized recommendations
Meal Recommendations - Healthy food suggestions

###Module 4: Meal Tracking
Breakfast Tracking - Log morning meals
Lunch Tracking - Log midday meals
Dinner Tracking - Log evening meals
Snack Tracking - Log snacks and extras

###Module 5: Nutrition Monitoring
Calorie Tracking - Daily calorie consumption
Protein Tracking - Protein intake monitoring
Carbohydrate Tracking - Carbs monitoring
Water Intake Tracking - Daily water consumption

###Module 6: Progress Dashboard
Reports & Analytics - Detailed nutrition analysis
Goal Tracking - Weight loss/gain goals
Weekly Progress Monitoring - 7-day nutrition history

###🎨 Design
Colorful Food Theme with vibrant colors for different food categories
Responsive design for mobile, tablet, and desktop
Smooth animations and transitions
Intuitive user interface
Color Palette
🍎 Apple Red (#E63946)
🥕 Carrot Orange (#F77F00)
🍌 Banana Yellow (#FCBF49)
🥦 Broccoli Green (#06A77D)
🫐 Blueberry Blue (#4361EE)
🍆 Eggplant Purple (#7209B7)

###🚀 Installation
Prerequisites
Python 3.8+
pip (Python package installer)
Setup Steps
Clone or download the project

cd food
Create a virtual environment (optional but recommended)

python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
Install dependencies

pip install -r requirements.txt
Run the application

python run.py
Access the application

Open your browser and go to: http://localhost:5000
Default credentials can be created by signing up
```text
📁 Project Structure
food/
├── app/
│   ├── __init__.py              # Flask app initialization
│   ├── models.py                # Database models
│   ├── routes.py                # API routes and views
│   ├── static/
│   │   ├── css/
│   │   │   └── style.css        # Colorful styling
│   │   └── js/
│   │       └── main.js          # Frontend JavaScript
│   └── templates/
│       ├── base.html            # Base template with navigation
│       ├── index.html           # Home page
│       ├── login.html           # Login page
│       ├── signup.html          # Sign up page
│       ├── dashboard.html       # Main dashboard
│       ├── meals.html           # Meal tracking
│       ├── profile.html         # User profile
│       ├── edit_profile.html    # Profile editing
│       └── progress.html        # Progress tracking
├── run.py                        # Application entry point
├── requirements.txt              # Python dependencies
└── README.md                     # This file
```
💾 Database Schema
Tables
users - User accounts and health information
food_items - Database of foods with nutritional info
meals - Logged meals (breakfast, lunch, dinner, snacks)
meal_items - Individual items in meals
user_goals - User fitness goals
goal_progress - Progress tracking for goals
daily_nutrition - Daily nutrition summaries
🔧 Configuration
The application uses SQLite database (automatically created on first run). Database file: app/nutrition.db

To change database location or use PostgreSQL, edit app/__init__.py:

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nutrition.db'
👥 End Users
👨‍🎓 Students - Maintain healthy habits while studying
💼 Working Professionals - Balance work and health
🏋️ Fitness Enthusiasts - Track detailed nutrition
⬇️ Weight Loss Seekers - Monitor progress toward goals
⬆️ Muscle Gainers - Track protein and calorie intake
❤️ Health-Conscious Individuals - Maintain balanced nutrition
📊 Key Formulas
BMI Calculation
BMI = weight (kg) / (height (m))²
Daily Calorie Requirement (Harris-Benedict)
Male: BMR = 88.362 + (13.397 × weight) + (4.799 × height) - (5.677 × age)
Female: BMR = 447.593 + (9.247 × weight) + (3.098 × height) - (4.330 × age)
TDEE = BMR × Activity Factor
📋 Food Database
Pre-loaded with 20+ common foods including:

Breakfast items (oatmeal, eggs, toast, milk)
Fruits (banana, apple, orange)
Proteins (chicken, salmon, beef)
Vegetables (broccoli, spinach, sweet potato)
Grains (brown rice, pasta)
Snacks (almonds, peanut butter, yogurt)
Beverages (water, coffee, tea, juice)
🔐 Security Features
Password hashing with Werkzeug
SQL injection prevention with SQLAlchemy ORM
User authentication with Flask-Login
CSRF protection with Flask-WTF
🎯 Usage Examples
Example 1: Creating an Account
Go to "Sign Up" page
Enter username, email, and password
Click "Create Account"
You're ready to start tracking!
Example 2: Logging Your First Meal
Go to Dashboard
Click "Log Meals"
Select meal type (breakfast, lunch, dinner, snack)
Search for food items
Add quantity and save
Example 3: Tracking Progress
Go to Progress page
Set a fitness goal (weight loss, gain, muscle)
View your nutrition history
Monitor daily intake vs. goals
📈 Advanced Features
Personalized calorie targets based on your profile
Macro nutrient tracking (protein, carbs, fat ratios)
Weekly nutrition reports with charts
Goal progress visualization
Food search and suggestions
Meal history with detailed breakdowns
🌐 Browser Support
Chrome (latest)
Firefox (latest)
Safari (latest)
Edge (latest)
Mobile browsers (iOS Safari, Chrome Mobile)
🐛 Troubleshooting
Port Already in Use
python run.py  # Use different port
# Or modify in run.py
app.run(debug=True, port=5001)
Database Errors
# Delete the database and restart
# The app will create a new one automatically
rm app/nutrition.db
python run.py
Import Errors
# Make sure you're in the project directory
# and virtual environment is activated
pip install -r requirements.txt
🚀 Future Enhancements
Machine learning-based meal recommendations
Integration with wearable devices
Social features and community challenges
Restaurant menu nutritional data
Barcode scanning for quick food logging
Dark mode theme
Multiple language support
Export reports (PDF, Excel)
Integration with fitness trackers
📝 Sample Credentials
After first run, you can create your own account via sign up. Initially, there are no pre-configured users.

🏆 Best Practices
Update Profile - Complete your health information for accurate recommendations
Log Meals Regularly - Better data = better insights
Set Realistic Goals - Healthy weight loss is 0.5-1kg per week
Track Water Intake - Stay hydrated (8-10 glasses per day)
Review Progress - Check your dashboard weekly
📞 Support
For issues or questions:

Check the README
Review the code comments
Test with sample data
Verify all dependencies are installed
📄 License
This project is created for educational purposes.

🎉 Enjoy NutriTracker!
Start your journey to better health today! 🥗🍎🥕💪

Version: 1.0.0
Last Updated: 2024
Status: Active Development
