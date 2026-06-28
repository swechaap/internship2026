🥗 NutriTracker - Nutrition & Diet Tracking Application
A comprehensive, colorful web application for tracking nutrition, managing diet plans, and achieving fitness goals using Python, Flask, and SQLite.

## 🌟 Features

### 🔐 Module 1: Login System

- **User Sign Up** – Create a new account with email validation.
- **User Login** – Secure user authentication.
- **Profile Management** – Update and manage personal information.

### ❤️ Module 2: Health Assessment

- **Enter Health Details** – Enter age, weight, height, gender, and activity level.
- **BMI Calculation** – Automatically calculate Body Mass Index (BMI).
- **Calorie Requirement Analysis** – Calculate personalized daily calorie requirements using the Harris-Benedict Equation.

### 🤖 Module 3: AI Diet Recommendation

- **AI Health Analysis** – Analyze user health profile and fitness goals.
- **Personalized Diet Plans** – Generate customized diet plans.
- **Meal Recommendations** – Suggest healthy and balanced meals.

### 🍽️ Module 4: Meal Tracking

- **Breakfast Tracking** – Log breakfast meals.
- **Lunch Tracking** – Log lunch meals.
- **Dinner Tracking** – Log dinner meals.
- **Snack Tracking** – Log snacks and additional food intake.

### 📊 Module 5: Nutrition Monitoring

- **Calorie Tracking** – Monitor daily calorie intake.
- **Protein Tracking** – Track daily protein consumption.
- **Carbohydrate Tracking** – Monitor carbohydrate intake.
- **Water Intake Tracking** – Track daily water consumption.

### 📈 Module 6: Progress Dashboard

- **Reports & Analytics** – View detailed nutrition reports.
- **Goal Tracking** – Monitor weight loss or muscle gain goals.
- **Weekly Progress Monitoring** – Review 7-day nutrition history and progress.

---

## 🎨 Design

NutriTracker provides a clean, colorful, and responsive user interface designed to make nutrition tracking simple and engaging.

### ✨ Design Highlights

- 🎨 Colorful food-inspired theme
- 📱 Responsive design for mobile, tablet, and desktop
- ⚡ Smooth animations and transitions
- 🖥️ Clean and intuitive user interface
- 🚀 Easy navigation and user-friendly experience

### 🎨 Color Palette

| Color | Hex Code |
| :--- | :---: |
| 🍎 Apple Red | `#E63946` |
| 🥕 Carrot Orange | `#F77F00` |
| 🍌 Banana Yellow | `#FCBF49` |
| 🥦 Broccoli Green | `#06A77D` |
| 🫐 Blueberry Blue | `#4361EE` |
| 🍆 Eggplant Purple | `#7209B7` |


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
## 💾 Database Schema

### Tables

| Table | Description |
|--------|-------------|
| **users** | User accounts and health information |
| **food_items** | Database of foods with nutritional information |
| **meals** | Logged meals (Breakfast, Lunch, Dinner, Snacks) |
| **meal_items** | Individual food items in meals |
| **user_goals** | User fitness goals |
| **goal_progress** | Progress tracking for goals |
| **daily_nutrition** | Daily nutrition summaries |

---

## 🔧 Configuration

The application uses **SQLite** (automatically created on first run).

**Database File**

```text
app/nutrition.db
```

To change the database location or use PostgreSQL, edit:

```python
app/__init__.py
```

Update the configuration:

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///nutrition.db'
```

---

## 👥 End Users

- 👨‍🎓 **Students** – Maintain healthy habits while studying.
- 💼 **Working Professionals** – Balance work and health.
- 🏋️ **Fitness Enthusiasts** – Track detailed nutrition.
- ⬇️ **Weight Loss Seekers** – Monitor progress toward weight loss goals.
- ⬆️ **Muscle Gainers** – Track protein and calorie intake.
- ❤️ **Health-Conscious Individuals** – Maintain a balanced nutrition plan.

---

## 📊 Key Formulas

### BMI Calculation

```text
BMI = Weight (kg) / Height² (m²)
```

### Daily Calorie Requirement (Harris-Benedict Equation)

#### Male

```text
BMR = 88.362 + (13.397 × Weight)
      + (4.799 × Height)
      - (5.677 × Age)
```

#### Female

```text
BMR = 447.593 + (9.247 × Weight)
      + (3.098 × Height)
      - (4.330 × Age)
```

#### Total Daily Energy Expenditure (TDEE)

```text
TDEE = BMR × Activity Factor
```

---

## 📋 Food Database

The application comes preloaded with **20+ common food items**, including:

### 🥣 Breakfast Items
- Oatmeal
- Eggs
- Toast
- Milk

### 🍎 Fruits
- Banana
- Apple
- Orange

### 🍗 Proteins
- Chicken
- Salmon
- Beef

### 🥦 Vegetables
- Broccoli
- Spinach
- Sweet Potato

### 🌾 Grains
- Brown Rice
- Pasta

### 🥜 Snacks
- Almonds
- Peanut Butter
- Yogurt

### 🥤 Beverages
- Water
- Coffee
- Tea
- Juice

---

## 🔐 Security Features

- 🔒 Password hashing using **Werkzeug**
- 🛡️ SQL injection prevention with **SQLAlchemy ORM**
- 👤 User authentication using **Flask-Login**
- ✅ CSRF protection using **Flask-WTF**

---

## 🎯 Usage Examples

### Example 1: Creating an Account

1. Open the **Sign Up** page.
2. Enter your username, email, and password.
3. Click **Create Account**.
4. Start tracking your nutrition!

### Example 2: Logging Your First Meal

1. Open the **Dashboard**.
2. Click **Log Meals**.
3. Select the meal type (Breakfast, Lunch, Dinner, Snack).
4. Search for food items.
5. Enter the quantity.
6. Save your meal.

### Example 3: Tracking Progress

1. Open the **Progress** page.
2. Set your fitness goal.
3. View your nutrition history.
4. Monitor daily intake against your goals.

---

## 📈 Advanced Features

- 🎯 Personalized calorie targets
- 🥩 Macronutrient tracking (Protein, Carbs, Fat)
- 📊 Weekly nutrition reports with charts
- 📈 Goal progress visualization
- 🔍 Food search and suggestions
- 📜 Meal history with detailed breakdowns

---

## 🌐 Browser Support

- ✅ Google Chrome (Latest)
- ✅ Mozilla Firefox (Latest)
- ✅ Microsoft Edge (Latest)
- ✅ Safari (Latest)
- ✅ Chrome Mobile
- ✅ iOS Safari

---

## 🐛 Troubleshooting

### Port Already in Use

Run the application on a different port:

```python
app.run(debug=True, port=5001)
```

or

```bash
python run.py
```

### Database Errors

Delete the database file:

```text
app/nutrition.db
```

Restart the application. A new database will be created automatically.

### Import Errors

Ensure you are inside the project directory and the virtual environment is activated.

Install dependencies:

```bash
pip install -r requirements.txt
```
---

## 🚀 Future Enhancements

The following features are planned for future releases:

- 🤖 Machine Learning-based meal recommendations
- ⌚ Integration with wearable devices
- 👥 Social features and community challenges
- 🍽️ Restaurant menu nutritional information
- 📷 Barcode scanning for quick food logging
- 🌙 Dark mode support
- 🌍 Multiple language support
- 📄 Export reports in PDF and Excel formats
- 🏃 Integration with fitness trackers

---

## 📝 Sample Credentials

There are **no pre-configured user accounts**.

To get started:

1. Launch the application.
2. Open the **Sign Up** page.
3. Create a new account using your email and password.
4. Log in and start tracking your nutrition.

---

## 🏆 Best Practices

To get the most accurate results from **NutriTracker**, follow these recommendations:

- 👤 **Complete Your Profile** – Provide accurate health information for personalized recommendations.
- 🍽️ **Log Meals Regularly** – Consistent meal tracking improves nutrition analysis.
- 🎯 **Set Realistic Goals** – Aim for healthy weight changes of **0.5–1 kg per week**.
- 💧 **Track Water Intake** – Drink **8–10 glasses of water** daily to stay hydrated.
- 📊 **Review Your Progress** – Check your dashboard and nutrition reports every week.
- 🥗 **Maintain a Balanced Diet** – Focus on a healthy mix of proteins, carbohydrates, and healthy fats.
- 🏃 **Stay Active** – Combine healthy eating with regular physical activity for better results.

---

## 📞 Support

If you encounter any issues:

- 📖 Review the **README** documentation.
- 💬 Check the code comments.
- 🧪 Test the application with sample data.
- 📦 Verify that all required dependencies are installed.

---

## 📄 License

This project is developed for **educational purposes**.

---
# 🎉 Happy Tracking!

Thank you for using **NutriTracker**!

Start your journey toward a healthier lifestyle with smart nutrition tracking.

🥗🍎🥕💪

---

## 📌 Project Information

| Property | Value |
|----------|-------|
| **Version** | **1.0.0** |
| **Last Updated** | **2024** |
| **Status** | 🚧 Active Development |

Depolyment Link: https://food-project-3-qe8t.onrender.com/ai-chat
