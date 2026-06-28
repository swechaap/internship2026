from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    jsonify,
    session
)

from flask_login import (
    login_user,
    logout_user,
    login_required,
    current_user
)

from .groq_client import ask_groq

from .models import (
    db,
    User,
    Meal,
    MealItem,
    FoodItem,
    UserGoal,
    GoalProgress,
    DailyNutrition
)

from datetime import datetime, timedelta
import json

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')
main_bp = Blueprint('main', __name__)
api_bp = Blueprint('api', __name__, url_prefix='/api')


# ==================== AUTH ROUTES ====================
@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        
        if password != confirm_password:
            return render_template('signup.html', error='Passwords do not match'), 400
        
        if User.query.filter_by(username=username).first():
            return render_template('signup.html', error='Username already exists'), 400
        
        if User.query.filter_by(email=email).first():
            return render_template('signup.html', error='Email already exists'), 400
        
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        return redirect(url_for('auth.login', success='Account created successfully'))
    
    return render_template('signup.html')


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            login_user(user)
            return redirect(url_for('main.dashboard'))
        else:
            return render_template('login.html', error='Invalid username or password'), 401
    
    return render_template('login.html')


@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))


# ==================== MAIN ROUTES ====================
@main_bp.route('/')
def index():
    return render_template('index.html')


@main_bp.route("/dashboard")
@login_required
def dashboard():

    today = datetime.utcnow().date()

    meals = Meal.query.filter_by(
        user_id=current_user.id,
        date=today
    ).all()

    daily_nutrition = DailyNutrition.query.filter_by(
        user_id=current_user.id,
        date=today
    ).first()

    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fat = 0

    for meal in meals:
        totals = meal.get_totals()

        total_calories += totals.get("calories", 0)
        total_protein += totals.get("protein", 0)
        total_carbs += totals.get("carbs", 0)
        total_fat += totals.get("fat", 0)

    try:
        calorie_requirement = current_user.calculate_calorie_requirement()
    except Exception:
        calorie_requirement = 0

    try:
        bmi = current_user.calculate_bmi()
    except Exception:
        bmi = None

    water_intake = 0

    if daily_nutrition:
        water_intake = daily_nutrition.water_intake or 0

    ai_summary = None

    if meals:

        prompt = f"""
        You are a certified nutritionist.

        User BMI: {bmi}

        Calories: {total_calories}

        Protein: {total_protein}

        Carbs: {total_carbs}

        Fat: {total_fat}

        Goal: {current_user.goal}

        Give 4 short health suggestions.
        """

        try:
            ai_summary = ask_groq(prompt)
        except Exception as e:
            print(e)
            ai_summary = "AI summary unavailable."

    return render_template(
        "dashboard.html",
        meals=meals,
        bmi=bmi,
        calorie_requirement=calorie_requirement,
        water_intake=water_intake,
        total_calories=total_calories,
        total_protein=total_protein,
        total_carbs=total_carbs,
        total_fat=total_fat,
        ai_summary=ai_summary
    )


@main_bp.route('/profile')
@login_required
def profile():
    return render_template('profile.html', user=current_user)


@main_bp.route('/profile/edit', methods=['GET', 'POST'])
@login_required
def edit_profile():
    if request.method == 'POST':
        current_user.age = request.form.get('age', type=int)
        current_user.weight = request.form.get('weight', type=float)
        current_user.height = request.form.get('height', type=float)
        current_user.gender = request.form.get('gender')
        current_user.activity_level = request.form.get('activity_level')
        current_user.goal = request.form.get('goal')
        
        db.session.commit()
        return redirect(url_for('main.profile'))
    
    return render_template('edit_profile.html', user=current_user)


@main_bp.route('/meals')
@login_required
def meals():
    date_str = request.args.get('date')
    if date_str:
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except:
            date = datetime.utcnow().date()
    else:
        date = datetime.utcnow().date()
    meals = Meal.query.filter_by(user_id=current_user.id, date=date).all()
    food_items = FoodItem.query.all()
    
    return render_template('meals.html', meals=meals, food_items=food_items, date=date)


@main_bp.route('/add-meal', methods=['POST'])
@login_required
def add_meal():
    meal_type = request.form.get('meal_type')
    date_str = request.form.get('date')
    
    if date_str:
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except:
            date = datetime.utcnow().date()
    else:
        date = datetime.utcnow().date()
    
    meal = Meal(user_id=current_user.id, meal_type=meal_type, date=date)
    db.session.add(meal)
    db.session.commit()
    
    return redirect(url_for('main.meals'))


@main_bp.route('/add-meal-item/<int:meal_id>', methods=['POST'])
@login_required
def add_meal_item(meal_id):
    meal = Meal.query.get(meal_id)
    if not meal or meal.user_id != current_user.id:
        return {'error': 'Not authorized'}, 403
    
    food_id = request.form.get('food_id', type=int)
    quantity = request.form.get('quantity', type=float)
    
    if not food_id or not quantity:
        return redirect(url_for('main.meals'))
    
    food = FoodItem.query.get(food_id)
    if not food:
        return redirect(url_for('main.meals'))
    
    # Calculate nutrition values
    calories = (food.calories * quantity) if food.calories else 0
    protein = (food.protein * quantity) if food.protein else 0
    carbs = (food.carbs * quantity) if food.carbs else 0
    fat = (food.fat * quantity) if food.fat else 0
    fiber = (food.fiber * quantity) if food.fiber else 0
    
    meal_item = MealItem(
        meal_id=meal_id, 
        food_id=food_id, 
        quantity=quantity,
        calories=calories,
        protein=protein,
        carbs=carbs,
        fat=fat,
        fiber=fiber
    )
    
    db.session.add(meal_item)
    db.session.commit()
    
    return redirect(url_for('main.meals'))


@main_bp.route('/progress')
@login_required
def progress():
    goals = UserGoal.query.filter_by(user_id=current_user.id).all()
    
    # Get last 7 days of nutrition data
    last_7_days = []
    for i in range(7):
        date = (datetime.utcnow().date() - timedelta(days=i))
        daily = DailyNutrition.query.filter_by(user_id=current_user.id, date=date).first()
        if daily:
            last_7_days.append(daily)
    
    return render_template('progress.html', goals=goals, last_7_days=last_7_days)


@main_bp.route('/set-goal', methods=['POST'])
@login_required
def set_goal():
    goal_type = request.form.get('goal_type')
    target_value = request.form.get('target_value', type=float)
    target_date = request.form.get('target_date')
    
    goal = UserGoal(
        user_id=current_user.id,
        goal_type=goal_type,
        target_value=target_value,
        current_value=current_user.weight if goal_type == 'weight' else None,
        target_date=datetime.strptime(target_date, '%Y-%m-%d').date()
    )
    
    db.session.add(goal)
    db.session.commit()
    
    return redirect(url_for('main.progress'))


@main_bp.route('/update-current-weight', methods=['POST'])
@login_required
def update_current_weight():
    goal_id = request.form.get('goal_id', type=int)
    current_weight = request.form.get('current_weight', type=float)
    
    goal = UserGoal.query.get(goal_id)
    if not goal or goal.user_id != current_user.id:
        return {'error': 'Not authorized'}, 403
    
    goal.current_value = current_weight
    # Update user's weight as well
    current_user.weight = current_weight
    
    db.session.commit()
    
    return redirect(url_for('main.progress'))


@main_bp.route('/update-water-intake', methods=['POST'])
@login_required
def update_water_intake():
    amount = request.form.get('amount', type=float, default=0.25)
    
    today = datetime.now().date()
    daily_nutrition = DailyNutrition.query.filter_by(
        user_id=current_user.id,
        date=today
    ).first()
    
    if not daily_nutrition:
        daily_nutrition = DailyNutrition(
            user_id=current_user.id,
            date=today,
            water_intake=amount
        )
    else:
        daily_nutrition.water_intake += amount
    
    db.session.add(daily_nutrition)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'water_intake': daily_nutrition.water_intake,
        'message': f'💧 Added {amount}L water! Total today: {daily_nutrition.water_intake}L'
    })


# ==================== API ROUTES ====================
@api_bp.route('/foods', methods=['GET'])
@login_required
def get_foods():
    search = request.args.get('search', '')
    category = request.args.get('category', '')
    
    query = FoodItem.query
    if search:
        query = query.filter(FoodItem.name.ilike(f'%{search}%'))
    if category:
        query = query.filter_by(category=category)
    
    foods = query.limit(20).all()
    return jsonify([{
        'id': food.id,
        'name': food.name,
        'calories': food.calories,
        'protein': food.protein,
        'carbs': food.carbs,
        'fat': food.fat,
        'category': food.category
    } for food in foods])


@api_bp.route('/food/<int:food_id>')
@login_required
def get_food(food_id):
    food = FoodItem.query.get(food_id)
    if not food:
        return {'error': 'Food not found'}, 404
    
    return jsonify({
        'id': food.id,
        'name': food.name,
        'calories': food.calories,
        'protein': food.protein,
        'carbs': food.carbs,
        'fat': food.fat,
        'fiber': food.fiber,
        'category': food.category,
        'serving_size': food.serving_size
    })


@api_bp.route('/daily-nutrition/<date>')
@login_required
def get_daily_nutrition(date):
    daily = DailyNutrition.query.filter_by(user_id=current_user.id, date=date).first()
    if not daily:
        return {'error': 'No data for this date'}, 404
    
    return jsonify({
        'date': str(daily.date),
        'total_calories': daily.total_calories,
        'total_protein': daily.total_protein,
        'total_carbs': daily.total_carbs,
        'total_fat': daily.total_fat,
        'total_fiber': daily.total_fiber,
        'water_intake': daily.water_intake
    })


@api_bp.route('/meal/<int:meal_id>', methods=['DELETE'])
@login_required
def delete_meal(meal_id):
    meal = Meal.query.get(meal_id)
    if not meal or meal.user_id != current_user.id:
        return {'error': 'Not authorized'}, 403
    
    db.session.delete(meal)
    db.session.commit()
    
    return {'success': True}


@api_bp.route('/meal-item/<int:item_id>', methods=['DELETE'])
@login_required
def delete_meal_item(item_id):
    item = MealItem.query.get(item_id)
    if not item or item.meal.user_id != current_user.id:
        return {'error': 'Not authorized'}, 403
    
    db.session.delete(item)
    db.session.commit()
    
    return {'success': True}
#############################################################
# AI ROUTES
#############################################################

@main_bp.route("/ai-chat")
@login_required
def ai_chat():

    return render_template("ai_chat.html")


@main_bp.route("/meal-planner")
@login_required
def meal_planner():

    return render_template("meal_planner.html")


@main_bp.route("/food-recommendation")
@login_required
def food_recommendation():

    return render_template("food_recommendation.html")


@main_bp.route("/calorie-analyzer")
@login_required
def calorie_analyzer():

    return render_template("calorie_analyzer.html")


@main_bp.route("/grocery-list")
@login_required
def grocery_list():

    return render_template("grocery_list.html")


@main_bp.route("/water-advisor")
@login_required
def water_advisor():

    return render_template("water_advisor.html")


@main_bp.route("/recipe-generator")
@login_required
def recipe_generator():

    return render_template("recipe_generator.html")


@main_bp.route("/weekly-report")
@login_required
def weekly_report():

    return render_template("weekly_report.html")


@main_bp.route("/daily-summary")
@login_required
def daily_summary():

    return render_template("daily_summary.html")
@api_bp.route("/ask-ai", methods=["POST"])
@login_required
def ask_ai():

    try:
        data = request.get_json()

        question = data.get("question")

        print("QUESTION:", question)

        prompt = f"""
        You are a professional nutritionist.

        User Age: {current_user.age}
        Weight: {current_user.weight}
        Height: {current_user.height}
        Goal: {current_user.goal}

        Question:
        {question}
        """

        answer = ask_groq(prompt)

        print("ANSWER:", answer)

        return jsonify({
            "answer": answer
        })

    except Exception as e:

        print("AI ERROR:", str(e))

        return jsonify({
            "answer": f"ERROR: {str(e)}"
        }), 500