import json
from functools import cache

import requests
import statistics

import requests

weather_url = "http://api.openweathermap.org/data/2.5/forecast"
weather_api_key = "XXX"

open_ai_url = "https://api.openai.com/v1/chat/completions"
open_ai_headers = {"Content-Type": "application/json",
                   "Authorization": "Bearer XXX"}


# Returns the average price of hotels with the specified categories in a region please note if multiple regions
# exists it selects the one with
def get_hotel_avr_price(destination, country, categories, stop=False):
    url = "https://www.travelmyth.gr/api_chat_makeathon_multi.php?destination=amalfi&lang=en&categories=beachfront&apiKey=myTeam"
    params = {
        "destination": destination,
        "lang": "en",
        "categories": categories,
        "apiKey": "myTeam"
    }
    headers = {"content-type": "application/json"}

    response = requests.get(url, params=params, headers=headers)

    if response.status_code == 200:
        data = response.json()
    else:
        print("Error:", response.status_code)
    filtered_destinations = {key: value for key, value in data.items() if value["country_code"] == country}

    if not filtered_destinations:
        if stop:
            print("No destinations found with the specified country_code.")
            return 0
        return get_hotel_avr_price(destination, country, "", stop=True)
    else:
        # Find the destination with the most hotels in the filtered list
        destination_with_most_hotels = max(filtered_destinations.values(), key=lambda x: int(x["number_of_hotels"]))
        return [destination_with_most_hotels['average_price_EUR'],
                destination_with_most_hotels['url']
                ]


def find_city_life_cost(budget, cities):
    budget = 3000  # Example budget in USD
    cities = [city.strip() for city in input("enter destination cities: ").split(',')]

    data = {
        "model": "gpt-4-turbo",
        "temperature": 0,
        "top_p": 1,
        "max_tokens": 1200,
        "n": 1,
        "messages": [
            {"role": "user",
             "content": f"Please evaluate the suitability ${cities} for a tourist on a budget of ${budget}. List the cities sorted by their suitability based on the cost of living and vacation costs.i want to consider only the food,entairtainment,gifts buys and everyday small expenditures. I want to RETURN a text ONLY the CITY NAME and the AVERAGE COST PER DAY."}
        ]
    }

    response = requests.post(open_ai_url, headers=open_ai_headers, json=data)

    print(response.text)


def suggest_cities(user_json, number_of_results=3):
    budget = user_json.get('budget')
    data = {
        "model": "gpt-4-turbo",
        "temperature": 0,
        "top_p": 1,
        "max_tokens": 1200,
        "n": 1,
        "response_format": {"type": "json_object"},
        "messages": [
            {'role': "user",
             'content': f"For the following choices ${user_json}. "
                        "Take into consideration all the variables to suggest cities!"
                        "The `Weather` is what weather they prefer"
                        "The `Continent` is an array that contains a list of containment if empty it means they "
                        "don't have any specific preference."
                        "The `Activities` is an array that contains a list of activities the love doing."
                        f"Get me in a JSON response that would contain ${number_of_results} cities in this format "
                        f"exactly!"
                        f"The `cost_life` is a numeric value represneting how many money will be needed peer day,"
                        f"would be calculated for a tourist with daily ${budget} based on the cost of "
                        f"living and vacation costs consider only the food,entertainment,gifts buys and "
                        f"everyday small expenditures"
                        "Short description should be under 30 words a short description of the city"
                        "`top_3_act` should be the top3 activates that a visitor can do in that city"
                        "Country_code in ISO 3166"
                        "hotel_stars for each city give a guess by the provided user choices"
                        "user_prefers_sunny if user prefers sunny weather"
                        "user_prefers_snow if user prefers sunny weather"
                        "user_prefers_rain if user prefers sunny weather"
                        "`json { 'cities' : [{'city':'Athens','country':'GR', 'cost_life': Calculate daily dynamically "
                        "'short_description',"
                        "'average_flight_cost': the average flight oneway cost from source airport ATH, departure "
                        "date is today"
                        "'hotel_stars' : 'three_star' or 'four_star', or 'five_star'"
                        "'top_3_act' : ['', '', '']}], "
                        "'user_prefers_sunny' : true/false, 'user_prefers_snow' : true/false, 'user_prefers_rain' : "
                        "true/false}`"

                        "The only OUTPUT MUST be a JSON and nothing else"
             }
        ]
    }

    response = requests.post(open_ai_url, headers=open_ai_headers, json=data)

    print(response.text)

    print(response.json()['choices'][0]['message']['content'])
    return json.loads(response.json()['choices'][0]['message']['content'])
    # dec = json.loads(response.text)
    #
    # print(dec['choices'][0]['message']['content'])


def get_weather(city, days):
    params = {
        "q": city,  # city can have optionally the county code
        "appid": weather_api_key,
        "units": 'metric',
        "lang": 'en',
        "cnt": days
    }
    #response = requests.get(weather_url, params=params)
    #data = response.json()
    data = {}
    if 'list' in data:
        temperatures = []
        humidities = []
        wind_speeds = []
        wind_directions = []
        cloudinesses = []
        rains = []
        snows = []

        for forecast in data['list']:
            temperatures.append(forecast['main']['temp'])
            humidities.append(forecast['main']['humidity'])
            wind_speeds.append(forecast['wind']['speed'])
            wind_directions.append(forecast['wind']['deg'])
            cloudinesses.append(forecast['clouds']['all'])

            if 'rain' in forecast:
                rains.append(forecast['rain'].get('1h', 0))
            else:
                rains.append(0)

            if 'snow' in forecast:
                snows.append(forecast['snow'].get('1h', 0))
            else:
                snows.append(0)

        mean_temperature = statistics.mean(temperatures)
        mean_humidity = statistics.mean(humidities)
        mean_wind_speed = statistics.mean(wind_speeds)
        mean_wind_direction = statistics.mean(wind_directions)
        mean_cloudiness = statistics.mean(cloudinesses)
        mean_rain = statistics.mean(rains)
        mean_snow = statistics.mean(snows)

        return {
            "city": data['city']['name'],
            "country": data['city']['country'],
            "mean_temperature": round(mean_temperature, 1),
            "mean_humidity": round(mean_humidity, 1),
            "mean_wind_Speed": round(mean_wind_speed, 1),  # m/s
            "mean_wind_direction": round(mean_wind_direction, 1),  # degrees
            "mean_cloudiness": round(mean_cloudiness, 1),  # percentage
            "mean_rain": round(mean_rain, 1),  # mm/h
            "mean_Snow": round(mean_snow, 1)  # mm/h
        }
    else:
        return {
            "city": city,
            "country": "",
            "mean_temperature": 0,
            "mean_humidity": 0,
            "mean_wind_Speed": 0,  # m/s
            "mean_wind_direction": 0,  # degrees
            "mean_cloudiness": 0,  # percentage
            "mean_rain": 0,  # mm/h
            "mean_Snow": 0  # mm/h
        }
