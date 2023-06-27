from flask import Flask, json, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cars.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Suppress warning
db = SQLAlchemy(app)

db.init_app(app)

class Listing(db.Model):
    __tablename__ = 'Listings'

    id = db.Column(db.Integer, primary_key=True)
    model_id = db.Column(db.Integer)
    year = db.Column(db.Integer)
    mileage = db.Column(db.Integer)
    transmission_id = db.Column(db.Integer)
    fuel_type = db.Column(db.String)
    engine = db.Column(db.String)
    body_type = db.Column(db.String)
    vehicle_title = db.Column(db.String)
    page_title = db.Column(db.String)
    price = db.Column(db.Float)
    sold_date = db.Column(db.DateTime)
    url = db.Column(db.String)

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
    
class Makes(db.Model):
    __tablename__ = "Makes"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    
class Models(db.Model):
    __tablename__ = "Models"
    
    id = db.Column(db.Integer, primary_key=True)
    make_id = db.Column(db.Integer, foreign_key=True)
    name = db.Column(db.String)
    
class Transmissions(db.Model):
    __tablename__ = "Transmissions"
    
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String)
    
@app.route('/listings', methods=['GET'])
def get_listings():
    listings = Listing.query.limit(5).all()  # Get the first 5 listings
    return jsonify([listing.to_dict() for listing in listings])

if __name__ == '__main__':
    app.run(debug=True)

    
@app.route('/')
def MainPage():
    return render_template('index.html')

@app.route('/api/models')
def ReturnModels():
    
    f = open('./python/data/info/models.json')
    
    models = json.load(f)
    
    f.close()
    
    response = jsonify(models)
    response.status_code = 200
    
    return response

@app.route('/api/makes')
def ReturnMakes():
    
    f = open('./python/data/info/makes.json')
    
    makes = json.load(f)
    
    f.close()
    
    response = jsonify(makes)
    response.status_code = 200
    
    return response

@app.route('./api/titles/<make><model>')
def get_titles(make, model):
    