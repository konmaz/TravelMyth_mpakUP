from flask import Flask, jsonify, request
from flask_cors import CORS

import foo

# Create the Flask application
app = Flask(__name__)


# Define a route for the root URL '/'
@app.route('/')
def hello_world():
    return 'Hello, World!'
print("foo")

@app.route('/process_data', methods=['POST'])
def process_data():
    if request.is_json:
        # Get the JSON data from the request
        json_data = request.get_json()

        # Do something with the JSON data
        message = json_data.get('message', 'No message')
        numbers = json_data.get('numbers', [])

        cities = foo.suggest_cities(json_data)

        for city_data in cities['cities']:
            city_data['weather'] = foo.get_weather(city_data['city'] + ", " + city_data['country'], json_data['Days'])
            city_data['avg_price'], city_data['url'] = foo.get_hotel_avr_price(city_data['city'],city_data['country'], categories=city_data['hotel_stars'])

        print(cities)

        return jsonify(cities)
    else:
        return jsonify({'error': 'Request must contain JSON data'}), 400

@app.route('/process_data2', methods=['POST'])
def process_data():
    if request.is_json:
        # Get the JSON data from the request
        cities = request.get_json()

        for city_data in cities['cities']:
            city_data['weather'] = foo.get_weather(city_data['city'] + ", " + city_data['country'], json_data['Days'])
            city_data['avg_price'], city_data['url'] = foo.get_hotel_avr_price(city_data['city'],city_data['country'], categories=city_data['hotel_stars'])

        print(cities)

        return jsonify(cities)
    else:
        return jsonify({'error': 'Request must contain JSON data'}), 400
CORS(app)

# Run the application
if __name__ == '__main__':
    app.run()
