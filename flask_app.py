from flask import Flask, json, jsonify
from flask_sqlalchemy import SQLAlchemy
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///cars.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Suppress warning
db = SQLAlchemy(app)

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
    
@app.route('/listings', methods=['GET'])
def get_listings():
    listings = Listing.query.limit(5).all()  # Get the first 5 listings
    return jsonify([listing.to_dict() for listing in listings])

if __name__ == '__main__':
    app.run(debug=True)

    
@app.route('/')
def MainPage():
    html = '''
        <!DOCTYPE html>
        <html lang="en">
        
        <body>
        <ul>
            <li><a href="http://127.0.0.1:5000/api/test">Test</a></li>
        </ul>
        </body>
    '''
    
    return html

@app.route('/api/models')
def ReturnModels():
    
    models = ['Model T', "Model 3", "F-Type", "RC 350"]
    
    response = jsonify(models)
    response.status_code = 200
    
    return response