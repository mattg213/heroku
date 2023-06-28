from flask import Flask, json, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
import json
import os.path

app = Flask(__name__)

db = SQLAlchemy()

db_name = 'cars.db'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, db_name)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Suppress warning

db.init_app(app)

class Listing(db.Model):
    __tablename__ = "listings"

    id = db.Column(db.Integer, primary_key=True)
    model = db.Column(db.String)
    make = db.Column(db.String)
    year = db.Column(db.Integer)
    mileage = db.Column(db.Integer)
    transmission = db.Column(db.String)
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

@app.route('/api/titles/<make>/<model>')
def get_titles(make, model):
    counts = ()
    
    if make == 'all' and model == 'all':
        counts = (
            db.session.query(Listing.vehicle_title, db.func.count(Listing.vehicle_title))
            .group_by(Listing.vehicle_title)
            .all()
        )
    elif model == 'all':
        counts = (
            db.session.query(Listing.vehicle_title, db.func.count(Listing.vehicle_title))
            .group_by(Listing.vehicle_title)
            .where(Listing.make == make)
        )
    else:
        counts = (
            db.session.query(Listing.vehicle_title, db.func.count(Listing.vehicle_title))
            .group_by(Listing.vehicle_title)
            .filter(Listing.make == make, Listing.model == model)
        )
    
    my_dict = {}
    
    for type, count in counts:
        my_dict[type] = count
        print(type, count)
        
    response = jsonify(my_dict) 
    response.status_code = 200
    
    return response

@app.route('/api/years/<make>/<model>')
def get_years(make, model):
    counts = ()
    
    if make == 'all' and model == 'all':
        counts = (
            db.session.query(Listing.year, db.func.count(Listing.year))
            .group_by(Listing.year)
            .all()
        )
    elif model == 'all':
        counts = (
            db.session.query(Listing.year, db.func.count(Listing.year))
            .group_by(Listing.year)
            .where(Listing.make == make)
        )
    else:
        counts = (
            db.session.query(Listing.year, db.func.count(Listing.year))
            .group_by(Listing.year)
            .filter(Listing.make == make, Listing.model == model)
        )
    
    my_dict = {}
    
    for type, count in counts:
        my_dict[type] = count
        print(type, count)
        
    response = jsonify(my_dict) 
    response.status_code = 200
    
    return response

@app.route('/api/scatterdata/<make>/<model>')
def get_scatter_data(make, model):
    query = ()
    
    if make == 'all' and model == 'all':
        query = (
            db.session.query(Listing.make, Listing.model, Listing.mileage, Listing.price).distinct(Listing.price)
            .all()
        )
    elif model == 'all':
        query = (
            db.session.query(Listing.make, Listing.model, Listing.mileage, Listing.price).distinct(Listing.price)
            .where(Listing.make == make)
        )
    else:
        query = (
            db.session.query(Listing.make, Listing.model, Listing.mileage, Listing.price).distinct(Listing.price)
            .filter(Listing.make == make, Listing.model == model)
        )
    
    my_dict = {}
    
    for make, model, mileage, price in query:
        car = {
            "model" : model,
            "mileage" : mileage,
            "price" : price
        }
        if make in my_dict:
            my_dict[make].append(car)
        else:
            my_dict[make] = []
            my_dict[make].append(car)
        
        
        
    response = jsonify(my_dict) 
    response.status_code = 200
    
    return response

@app.route('/api/piedata/<make>/<model>')
def get_pie_data(make, model):
    query = ()
    
    if make == 'all' and model == 'all':
        query = (
            db.session.query(Listing.transmission, db.func.count(Listing.transmission))
            .group_by(Listing.transmission)
            .filter((Listing.transmission == 'Automatic') | (Listing.transmission == 'Manual'))
            .all()
        )
    elif model == 'all':
        query = (
            db.session.query(Listing.transmission, db.func.count(Listing.transmission))
            .group_by(Listing.transmission)
            .where(Listing.make == make)
            .filter((Listing.transmission == 'Automatic') | (Listing.transmission == 'Manual'))
        )
    else:
        query = (
            db.session.query(Listing.transmission, db.func.count(Listing.transmission))
            .group_by(Listing.transmission)
            .filter(Listing.make == make, Listing.model == model)
            .filter((Listing.transmission == 'Automatic') | (Listing.transmission == 'Manual'))
        )
    
    my_dict = {}
    
    for transmission, count in query:
        my_dict[transmission] = count
        
        
        
    response = jsonify(my_dict) 
    response.status_code = 200
    
    return response