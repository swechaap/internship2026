📖 NutriTracker - User Guide & Examples
🎯 Complete User Journey
Scenario 1: Student Trying to Lose Weight
Sarah's Story: Sarah is a 22-year-old college student who wants to lose 5kg in 3 months.

Step 1: Create Account (2 min)

Visit http://localhost:5000
Click "Sign Up"
Enter:
Username: sarah_fitness
Email: sarah@email.com
Password: SecurePass123
Click "Create Account" → Redirected to login
Step 2: Complete Health Profile (3 min)

Login with credentials
Click "Profile" → "Edit Profile"
Enter health information:
Age: 22
Weight: 70 kg
Height: 165 cm
Gender: Female
Activity Level: Light (exercises 2x/week)
Goal: Weight Loss
Click "Save Changes"
System calculates:
BMI: 25.7 (Overweight)
Daily Calorie Goal: 1,850 calories
Step 3: First Day Tracking (5 min)

Go to "Meals" page
Click "Add a New Meal" → Select "Breakfast"
Search for "Oatmeal" → Click to add
Enter quantity: 1 serving
Repeat for Lunch, Dinner, Snacks
Go to Dashboard to see daily totals
Step 4: Weekly Progress Review (2 min)

Go to "Progress" page
Set Goal:
Goal Type: Weight Loss
Target: 65 kg
Date: 3 months from now
View 7-day nutrition history table
Scenario 2: Fitness Professional Gaining Muscle
Mike's Story: Mike is a 28-year-old fitness enthusiast focused on muscle gain.

Profile Setup:

Age: 28, Weight: 80kg, Height: 180cm
Gender: Male, Activity: Active (5x/week gym)
Goal: Muscle Gain
System calculates: BMI 24.7, Daily Calories: 2,850
Daily Routine:

Breakfast (7 AM):

2 Eggs (155 cal)
1 Banana (105 cal)
1 Cup Milk (149 cal)
Total: 409 cal, 22g protein
Lunch (12 PM):

100g Chicken Breast (165 cal)
1 Cup Brown Rice (215 cal)
1 Cup Broccoli (55 cal)
Total: 435 cal, 34g protein
Dinner (6 PM):

100g Salmon (208 cal)
1 Cup Pasta (220 cal)
Spinach Salad (14 cal)
Total: 442 cal, 24g protein
Snacks:

1oz Almonds (164 cal)
Peanut Butter (188 cal)
Total: 352 cal, 18g protein
Daily Totals:

Calories: 1,638 (under goal - needs more)
Protein: 98g (excellent for muscle gain)
Carbs: 145g
Fat: 68g
Scenario 3: Working Professional with Balanced Health
Emma's Story: Emma is a 35-year-old professional who wants to maintain her weight and stay healthy.

Profile:

Age: 35, Weight: 65kg, Height: 170cm
Gender: Female, Activity: Moderate (3x/week gym)
Goal: Maintain Weight
System calculates: BMI 22.5 (Healthy), Daily Calories: 2,007
Weekly Meal Plan:

Monday:

Breakfast: Oatmeal + Banana = 255 cal
Lunch: Chicken + Rice = 380 cal
Dinner: Salmon + Salad = 230 cal
Snacks: Yogurt + Apple = 195 cal
Total: 1,060 cal (under goal - add water, coffee)
Tuesday:

Similar meals from database
Focus on variety
Track water intake (8 glasses = 2 liters)
Progress View (Week 1):

Day 1: 1,850 cal
Day 2: 1,920 cal
Day 3: 2,050 cal
Day 4: 1,980 cal
Day 5: 2,100 cal
Day 6: 1,850 cal
Day 7: 2,000 cal
Average: 1,964 cal (matches goal of 2,007)
🍽️ Detailed Feature Walkthrough
Feature 1: Meal Tracking
How to Log a Meal:

Navigate to Meals Page

Click "🍽️ Meals" in navigation
Add a New Meal

Click "Add a New Meal"
Select meal type:
🌅 Breakfast
🌞 Lunch
🌙 Dinner
🍪 Snack
Select date (default: today)
Click "Add Meal"
Add Food Items

Search for food (e.g., "chicken")
Click food item
Modal appears asking for quantity
Enter quantity (default: 1 serving)
Click "Add to Meal ✅"
View Meal Summary

See meal totals:
🔥 Calories
🥩 Protein (g)
🌾 Carbs (g)
🧈 Fat (g)
Edit or Delete

Delete individual items
Delete entire meal
Changes reflected immediately
Feature 2: Health Assessment
BMI Understanding:

< 18.5: Underweight
18.5 - 25: Healthy Weight ✅
25 - 30: Overweight
> 30: Obese
Calorie Requirement Example:

For 30-year-old Male, 70kg, 175cm:

Step 1: Calculate BMR (Base Metabolic Rate)
BMR = 88.362 + (13.397 × 70) + (4.799 × 175) - (5.677 × 30)
    = 88.362 + 937.79 + 839.825 - 170.31
    = 1,695.7 calories

Step 2: Apply Activity Multiplier
Activity Level: Moderate (1.55x)
TDEE = 1,695.7 × 1.55 = 2,628 calories/day
Feature 3: Progress Tracking
Setting a Goal:

Go to "📈 Progress" page
Find "Set a New Goal" section
Enter:
Goal Type: Weight Loss / Weight Gain / Fitness
Target Value: 65 kg
Target Date: 90 days from today
Click "Set Goal 🎯"
View goal in list below
Viewing Progress:

Goals table shows:

Goal type (⬇️ Weight Loss, ⬆️ Weight Gain)
Target weight
Current weight
Target date
Progress bar
Last 7 Days table shows:

Date | Calories | Protein | Carbs | Fat | Water
Feature 4: Profile Management
Updating Profile:

Click "👤 Profile" in navigation
View current information
Click "✏️ Edit Profile"
Update any field:
Age
Weight
Height
Gender
Activity Level
Fitness Goal
Click "💾 Save Changes"
Auto-calculated Fields:

BMI (recalculated automatically)
Daily Calorie Goal (recalculated automatically)
📊 Understanding Your Numbers
Daily Nutrition Report Example
Target for Day:

Calories: 2,000
Protein: 150g
Carbs: 250g
Fat: 65g
Water: 2L
Actual Intake:

Calories: 1,950 (97.5% of goal) ✅
Protein: 145g (96.7% of goal) ✅
Carbs: 240g (96% of goal) ✅
Fat: 68g (104% of goal) ⚠️
Water: 1.8L (90% of goal) ⚠️
Interpretation:

Protein: Good! Excellent for muscle maintenance
Carbs: Good! Sustains energy levels
Fat: Slightly high, reduce by 1tbsp oil tomorrow
Water: Drink 1 more glass
🎯 Common Use Cases
Use Case 1: Weight Loss (1kg/week target)
Daily Routine:

Morning: Check dashboard
Meal Times: Log each meal immediately
Evening: Review daily totals
Weekly: Check progress page
Key Metrics to Monitor:

Total calories < daily goal by 500
High protein (maintains muscle)
Consistent water intake
Expected Results:

Week 1: 1 kg loss
Month 1: 4 kg loss
Month 3: 12 kg loss
Use Case 2: Muscle Building (0.5kg/week gain)
Daily Routine:

High protein intake (1.6g per kg body weight)
Calorie surplus (500 above TDEE)
Track progress weight gain
Key Metrics:

Total calories > daily goal by 500
Protein: 100g+ daily
Consistent workout tracking (external app)
Use Case 3: Maintenance (Healthy Lifestyle)
Daily Routine:

Eat at calorie maintenance level
Balanced macros (45% carbs, 30% protein, 25% fat)
Consistent daily habits
Key Metrics:

Calories within ±100 of goal
Balanced macro distribution
Regular exercise 3-5x/week
⚙️ Advanced Tips
Tip 1: Batch Meal Planning
Plan meals on Sunday for the week
Use similar meals (less variation)
Prep common items in bulk
Tip 2: Food Combinations
Protein + Vegetables: Broccoli + Chicken
Carbs + Protein: Rice + Salmon
Balanced Meal: Chicken + Rice + Broccoli
Tip 3: Weekly Review
Every Sunday: Review 7-day average
Adjust portions for next week
Set new mini-goals
Tip 4: Water Intake
8-10 glasses/day (2-2.5L)
More if exercise
Track in snacks section
🔍 Sample Data Reference
Food Items in Database
High Protein:

Chicken Breast (100g): 165 cal, 31g protein
Salmon (100g): 208 cal, 20g protein
Lean Beef (100g): 250 cal, 26g protein
High Carbs:

Banana (1 medium): 105 cal, 27g carbs
Brown Rice (1 cup): 215 cal, 45g carbs
Sweet Potato (1 medium): 103 cal, 24g carbs
Healthy Fats:

Almonds (1 oz): 164 cal, 14g fat
Peanut Butter (2 tbsp): 188 cal, 16g fat
Olive Oil (1 tbsp): 120 cal, 14g fat
Vegetables (Low Cal):

Broccoli (1 cup): 55 cal, 3.7g protein
Spinach (2 cups): 14 cal, 1.9g protein
Sweet Potato: 103 cal, great for carbs
📱 Mobile Usage
NutriTracker is fully responsive:

Works on phones, tablets, desktops
Touch-friendly buttons
Readable on small screens
Fast loading
Recommended Mobile Workflow:

Morning: Open app, set meals for day
After Meals: Log immediately
Evening: Review totals
🐛 Common Issues & Solutions
Issue: Wrong calorie calculation
Solution: Check that you entered weight/height correctly in profile

Issue: Can't find food item
Solution: Try searching with different keywords or add from similar items

Issue: Forgot daily goals
Solution: Go to Profile page to see calculated daily calorie target

Issue: Want to change date
Solution: When adding meal, select different date in the form

✅ Daily Checklist
Use this to maximize results:

 Log breakfast
 Log lunch
 Log dinner
 Log snacks
 Track water intake
 Check daily totals
 Review goal progress (weekly)
🎓 Learning the System
Day 1: Create account, set up profile, log 1 meal
Day 2-7: Log all meals daily, observe patterns
Week 2: Set first goal, review weekly totals
Month 1: Analyze nutrition patterns, adjust habits
Month 2+: Achieve goals, celebrate progress

🎉 Success Stories
What You Can Achieve:

✅ Lose 5-10kg in 3 months
✅ Build muscle consistently
✅ Understand eating patterns
✅ Develop healthy habits
✅ Reach fitness goals
✅ Maintain healthy weight
Happy Tracking! 🥗🍎💪

For technical support, see SETUP_GUIDE.md
For full features, see README.md
For project overview, see PROJECT_COMPLETE.md