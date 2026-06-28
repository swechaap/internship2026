from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    age = db.Column(db.Integer)
    weight = db.Column(db.Float)  # in kg
    height = db.Column(db.Float)  # in cm
    gender = db.Column(db.String(10))
    activity_level = db.Column(db.String(20))  # sedentary, light, moderate, active
    goal = db.Column(db.String(50))  # weight_loss, weight_gain, maintain
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    meals = db.relationship('Meal', backref='user', lazy=True, cascade='all, delete-orphan')
    goals = db.relationship('UserGoal', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def calculate_bmi(self):
        if self.height and self.weight:
            height_m = self.height / 100
            return round(self.weight / (height_m ** 2), 2)
        return None

    def calculate_calorie_requirement(self):
        """Calculate daily calorie requirement using Harris-Benedict equation"""
        if not all([self.age, self.weight, self.height, self.gender]):
            return None
        
        if self.gender.lower() == 'male':
            bmr = 88.362 + (13.397 * self.weight) + (4.799 * self.height) - (5.677 * self.age)
        else:
            bmr = 447.593 + (9.247 * self.weight) + (3.098 * self.height) - (4.330 * self.age)
        
        activity_multipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725
        }
        
        multiplier = activity_multipliers.get(self.activity_level, 1.2)
        return round(bmr * multiplier)


class FoodItem(db.Model):
    __tablename__ = 'food_items'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, unique=True)
    calories = db.Column(db.Float, nullable=False)
    protein = db.Column(db.Float)  # grams
    carbs = db.Column(db.Float)  # grams
    fat = db.Column(db.Float)  # grams
    fiber = db.Column(db.Float)  # grams
    category = db.Column(db.String(50))
    serving_size = db.Column(db.String(50))
    meal_items = db.relationship('MealItem', backref='food', lazy=True)


class Meal(db.Model):
    __tablename__ = 'meals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    meal_type = db.Column(db.String(20), nullable=False)  # breakfast, lunch, dinner, snack
    date = db.Column(db.Date, nullable=False, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    items = db.relationship('MealItem', backref='meal', lazy=True, cascade='all, delete-orphan')

    def get_totals(self):
        totals = {
            'calories': 0,
            'protein': 0,
            'carbs': 0,
            'fat': 0,
            'fiber': 0
        }
        for item in self.items:
            totals['calories'] += item.calories
            totals['protein'] += item.protein or 0
            totals['carbs'] += item.carbs or 0
            totals['fat'] += item.fat or 0
            totals['fiber'] += item.fiber or 0
        return totals


class MealItem(db.Model):
    __tablename__ = 'meal_items'
    id = db.Column(db.Integer, primary_key=True)
    meal_id = db.Column(db.Integer, db.ForeignKey('meals.id'), nullable=False)
    food_id = db.Column(db.Integer, db.ForeignKey('food_items.id'), nullable=False)
    quantity = db.Column(db.Float, nullable=False)  # quantity in serving units
    calories = db.Column(db.Float)
    protein = db.Column(db.Float)
    carbs = db.Column(db.Float)
    fat = db.Column(db.Float)
    fiber = db.Column(db.Float)

    def calculate_nutrition(self):
        food = self.food
        self.calories = (food.calories * self.quantity) if food.calories else 0
        self.protein = (food.protein * self.quantity) if food.protein else 0
        self.carbs = (food.carbs * self.quantity) if food.carbs else 0
        self.fat = (food.fat * self.quantity) if food.fat else 0
        self.fiber = (food.fiber * self.quantity) if food.fiber else 0


class UserGoal(db.Model):
    __tablename__ = 'user_goals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    goal_type = db.Column(db.String(50), nullable=False)  # weight_loss, weight_gain, fitness
    target_value = db.Column(db.Float)
    current_value = db.Column(db.Float)
    target_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    progress = db.relationship('GoalProgress', backref='goal', lazy=True, cascade='all, delete-orphan')


class GoalProgress(db.Model):
    __tablename__ = 'goal_progress'
    id = db.Column(db.Integer, primary_key=True)
    goal_id = db.Column(db.Integer, db.ForeignKey('user_goals.id'), nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow)
    value = db.Column(db.Float)
    notes = db.Column(db.Text)


class DailyNutrition(db.Model):
    __tablename__ = 'daily_nutrition'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False, unique=False)
    total_calories = db.Column(db.Float, default=0)
    total_protein = db.Column(db.Float, default=0)
    total_carbs = db.Column(db.Float, default=0)
    total_fat = db.Column(db.Float, default=0)
    total_fiber = db.Column(db.Float, default=0)
    water_intake = db.Column(db.Float, default=0)  # in liters
    created_at = db.Column(db.DateTime, default=datetime.utcnow)