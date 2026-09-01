function WeatherCard({ weather }) {
  return (
    <div className="weather-card">
      <h2>{weather.city}</h2>

      <div className="weather-icon">
        {weather.weather === "Rain"
          ? "🌧️"
          : weather.weather === "Clouds"
          ? "☁️"
          : weather.weather === "Clear"
          ? "☀️"
          : weather.weather === "Snow"
          ? "❄️"
          : "🌤️"}
      </div>

      <h1>{weather.temperature}°C</h1>

      <h3>{weather.weather}</h3>

      <p>{weather.description}</p>

      <div className="weather-details">
        <div className="detail">
          <span>🌡️</span>
          <p>Feels Like</p>
          <strong>{weather.feelsLike}°C</strong>
        </div>

        <div className="detail">
          <span>💧</span>
          <p>Humidity</p>
          <strong>{weather.humidity}%</strong>
        </div>

        <div className="detail">
          <span>💨</span>
          <p>Wind</p>
          <strong>{weather.windSpeed} m/s</strong>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;