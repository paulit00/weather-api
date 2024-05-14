require("dotenv").config();
const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const { getWeatherRecommendation, getWeatherCondition } = require("./weather");
const app = express();

const PORT = process.env.PORT || 3000;

// Define rate limit middleware
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // Max 1000 requests per hour
  message: "Too many requests from this IP, please try again later.",
});

// Apply rate limit middleware to all routes
app.use(limiter);

/**
 * @api {get} /weather Get Weather Data
 * @apiName GetWeather
 * @apiGroup Weather
 *
 * @apiParam {String} city City name for which weather data is requested.
 *
 * @apiSuccess {Object} weatherData Object containing weather information.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *    {
 *      "temperature": 25,
 *      "humidity": 70,
 *      "description": "Partly cloudy"
 *    }
 *
 * @apiError (400) BadRequest City parameter is required.
 * @apiError (500) InternalServerError Internal server error.
 */
app.get("/weather", async (req, res) => {
  try {
    const city = req.query.city;

    if (!city) {
      return res.status(400).json({
        error: "City parameter is required.",
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`
    );

    const weatherData = {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
    };

    res.json(weatherData);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get weather recommendation based on user's current location
app.get("/weather-recommendation", async (req, res) => {
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const isLocalhost =
    req.hostname === "localhost" || req.hostname === "127.0.0.1";

  try {
    if (isLocalhost) {
      return res.status(403).json({
        error: "Access to weather recommendation is restricted on localhost.",
      });
    }

    // Fetch user's location based on IP address using an IP Geolocation service
    const locationResponse = await axios.get(
      `http://ip-api.com/json/${ipAddress}`
    );
    const { lat, lon } = locationResponse.data;

    // Fetch weather data for the user's location using OpenWeatherMap API
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    );
    const weatherData = weatherResponse.data.weather;

    // Determine the weather condition based on the weather data
    const weatherCondition = getWeatherCondition(weatherData);

    // Generate recommendation based on the weather condition
    const recommendation = getWeatherRecommendation(weatherCondition);

    // Send recommendation as JSON response
    res.json({ recommendation });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
module.exports = app;
