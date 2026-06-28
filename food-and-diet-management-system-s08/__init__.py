from flask import Flask
from flask_login import LoginManager
from .models import db, User
import os


def create_app():

    app = Flask(
        __name__,
        template_folder=os.path.join(os.path.dirname(__file__), "templates"),
        static_folder=os.path.join(os.path.dirname(__file__), "static")
    )

    app.config["SECRET_KEY"] = "your-secret-key-change-this"

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"sqlite:///{os.path.join(BASE_DIR, 'nutrition.db')}"
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Initialize database
    db.init_app(app)

    # Login Manager
    login_manager = LoginManager()
    login_manager.login_view = "auth.login"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    # Import Blueprints
    from .routes import auth_bp, main_bp, api_bp
    from .ai_routes import ai

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix="/api")
    app.register_blueprint(ai, url_prefix="/ai")

    with app.app_context():
        db.create_all()

    return app