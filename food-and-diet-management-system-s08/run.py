from app import create_app, db
from app.models import FoodItem

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db}

def init_db():
    """Initialize database with sample food items"""
    with app.app_context():
        db.create_all()
        
        # Check if food items already exist
        if FoodItem.query.first() is not None:
            return
        
        # Add sample food items
        sample_foods = [
            # Breakfast items
            FoodItem(name='Oatmeal (1 cup)', calories=150, protein=5, carbs=27, fat=3, fiber=4, category='breakfast', serving_size='1 cup'),
            FoodItem(name='Eggs (2 large)', calories=155, protein=13, carbs=1.1, fat=11, fiber=0, category='breakfast', serving_size='2 eggs'),
            FoodItem(name='Whole Wheat Toast (1 slice)', calories=80, protein=4, carbs=14, fat=1, fiber=2, category='breakfast', serving_size='1 slice'),
            FoodItem(name='Banana (1 medium)', calories=105, protein=1.3, carbs=27, fat=0.3, fiber=3, category='fruits', serving_size='1 fruit'),
            FoodItem(name='Milk (1 cup)', calories=149, protein=8, carbs=12, fat=8, fiber=0, category='dairy', serving_size='1 cup'),
            
            # Lunch items
            FoodItem(name='Grilled Chicken Breast (100g)', calories=165, protein=31, carbs=0, fat=3.6, fiber=0, category='protein', serving_size='100g'),
            FoodItem(name='Brown Rice (1 cup cooked)', calories=215, protein=5, carbs=45, fat=2, fiber=4, category='grains', serving_size='1 cup'),
            FoodItem(name='Broccoli (1 cup)', calories=55, protein=3.7, carbs=11, fat=0.6, fiber=2.4, category='vegetables', serving_size='1 cup'),
            FoodItem(name='Salmon (100g)', calories=208, protein=20, carbs=0, fat=13, fiber=0, category='protein', serving_size='100g'),
            FoodItem(name='Sweet Potato (1 medium)', calories=103, protein=2, carbs=24, fat=0.1, fiber=3.9, category='vegetables', serving_size='1 medium'),
            
            # Dinner items
            FoodItem(name='Lean Beef (100g)', calories=250, protein=26, carbs=0, fat=15, fiber=0, category='protein', serving_size='100g'),
            FoodItem(name='Pasta (1 cup cooked)', calories=220, protein=8, carbs=43, fat=1.1, fiber=2.5, category='grains', serving_size='1 cup'),
            FoodItem(name='Olive Oil (1 tbsp)', calories=120, protein=0, carbs=0, fat=14, fiber=0, category='oils', serving_size='1 tbsp'),
            FoodItem(name='Spinach Salad (2 cups)', calories=14, protein=1.9, carbs=2.2, fat=0.4, fiber=1.3, category='vegetables', serving_size='2 cups'),
            
            # Snacks
            FoodItem(name='Almonds (1 oz)', calories=164, protein=6, carbs=6, fat=14, fiber=3.5, category='snacks', serving_size='1 oz'),
            FoodItem(name='Apple (1 medium)', calories=95, protein=0.5, carbs=25, fat=0.3, fiber=4.4, category='fruits', serving_size='1 fruit'),
            FoodItem(name='Yogurt (1 cup)', calories=100, protein=10, carbs=7, fat=0.4, fiber=0, category='dairy', serving_size='1 cup'),
            FoodItem(name='Peanut Butter (2 tbsp)', calories=188, protein=8, carbs=7, fat=16, fiber=2, category='snacks', serving_size='2 tbsp'),
            
            # Beverages
            FoodItem(name='Water (1 liter)', calories=0, protein=0, carbs=0, fat=0, fiber=0, category='beverages', serving_size='1 liter'),
            FoodItem(name='Black Coffee (1 cup)', calories=2, protein=0.3, carbs=0, fat=0, fiber=0, category='beverages', serving_size='1 cup'),
            FoodItem(name='Green Tea (1 cup)', calories=25, protein=0, carbs=4, fat=0, fiber=0, category='beverages', serving_size='1 cup'),
            FoodItem(name='Orange Juice (1 cup)', calories=112, protein=2, carbs=26, fat=0.5, fiber=0, category='beverages', serving_size='1 cup'),
        ]
        
        for food in sample_foods:
            db.session.add(food)
        
        db.session.commit()
        print("Database initialized with sample food items!")

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)