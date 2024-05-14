function getWeatherRecommendation(weatherCondition) {
  switch (weatherCondition) {
    case "Clear":
      return "Enjoy the sunshine! It's a perfect day for outdoor activities.";
    case "Clouds":
      return "It's a bit cloudy, but still a good time to go outside. Don't forget your sunglasses!";
    case "Rain":
      return "It's raining! Remember to bring your umbrella and wear waterproof clothing.";
    case "Snow":
      return "It's snowing! Bundle up in warm layers and wear boots for traction on slippery surfaces.";
    case "Extreme Heat":
      return "It's extremely hot today! Stay hydrated, seek shade, and avoid prolonged exposure to the sun.";
    default:
      return "No recommendation available for this weather condition.";
  }
}

function getWeatherCondition(weatherData) {
  if (!weatherData || !Array.isArray(weatherData) || weatherData.length === 0) {
    return "Unknown";
  }

  // Extract the main weather group from the first weather condition object
  const mainWeather = weatherData[0].main.toLowerCase();

  // Determine the weather condition based on the main weather group
  if (mainWeather.includes("clear")) {
    return "Clear";
  } else if (mainWeather.includes("cloud")) {
    return "Clouds";
  } else if (mainWeather.includes("rain")) {
    return "Rain";
  } else if (mainWeather.includes("snow")) {
    return "Snow";
  } else if (mainWeather.includes("thunderstorm")) {
    return "Thunderstorm";
  } else if (mainWeather.includes("drizzle")) {
    return "Drizzle";
  } else if (mainWeather.includes("mist") || mainWeather.includes("fog")) {
    return "Mist";
  } else if (mainWeather.includes("haze") || mainWeather.includes("smoke")) {
    return "Haze";
  } else {
    return "Unknown";
  }
}

module.exports = { getWeatherRecommendation, getWeatherCondition };
