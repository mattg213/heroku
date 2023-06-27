from flask import Flask, json, jsonify
import json

app = Flask(__name__)

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