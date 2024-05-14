# Weather API

This project provides a simple API for retrieving weather data for a given city using the OpenWeatherMap API.

## Installation

To install the package, use npm:

## Usage

To use the API, make a GET request to the `/weather` endpoint with the `city` parameter specifying the country name for which you want to retrieve weather data.

Example:

`GET /weather?city=New%20York`

Response:

```json
{
  "temperature": 25,
  "humidity": 70,
  "description": "Partly cloudy"
}
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
