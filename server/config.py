from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_jwt_extended import JWTManager

app = Flask(__name__)
app.config['SECRET_KEY'] = '6641f45a9ceac5d1336991cdfccf2c456c0d9102c75872c83d40b0659c4d22ac'
app.config['JWT_SECRET_KEY'] = '6641f45a9ceac5d1336991cdfccf2c456c0d9102c75872c83d40b0659c4d22ac'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
db.init_app(app)
migrate = Migrate(app, db)


bcrypt = Bcrypt(app)
jwt = JWTManager(app)

api = Api(app)