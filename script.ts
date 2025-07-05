let isCelsius: boolean = true;

interface ForecastDay {
  date: string;
  code: number;
  max_c: number;
  min_c: number;
  max_f: string;
  min_f: string;
}

let forecast: ForecastDay[] = [];

function getIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "☁️";
  if ([61, 63, 80].includes(code)) return "🌧️";
  if ([71, 73].includes(code)) return "🌨️";
  if ([95, 96].includes(code)) return "⛈️";
  return "❓";
}

function showDay(index: number): void {
  const day = forecast[index];
  const tempHigh = isCelsius ? day.max_c : day.max_f;
  const tempLow = isCelsius ? day.min_c : day.min_f;
  const unit = isCelsius ? "°C" : "°F";
  const icon = getIcon(day.code);

  const main = document.getElementById("main-card");
  if (main) {
    main.innerHTML =
      `<h2>${day.date}</h2>` +
      `<div class="icon">${icon}</div>` +
      `<p>High: ${tempHigh}${unit}</p><p>Low: ${tempLow}${unit}</p>`;
  }
}

function toggleUnit(): void {
  isCelsius = !isCelsius;
  const toggleBtn = document.getElementById("toggleBtn");
  if (toggleBtn) {
    toggleBtn.innerText = isCelsius ? "Switch to °F" : "Switch to °C";
  }
  showDay(0);
  updateSmallCards();
}

function loadForecast(): void {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=51.0447&longitude=-114.0719&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=America/Edmonton";

  fetch(url)
    .then(res => res.json())
    .then((data) => {
      for (let i = 0; i < 7; i++) {
        forecast.push({
          date: data.daily.time[i],
          code: data.daily.weathercode[i],
          max_c: data.daily.temperature_2m_max[i],
          min_c: data.daily.temperature_2m_min[i],
          max_f: (data.daily.temperature_2m_max[i] * 9 / 5 + 32).toFixed(1),
          min_f: (data.daily.temperature_2m_min[i] * 9 / 5 + 32).toFixed(1),
        });
      }
      updateSmallCards();
      showDay(0);
    });
}

function updateSmallCards(): void {
  for (let i = 0; i < 7; i++) {
    const day = forecast[i];
    const icon = getIcon(day.code);
    const tempHigh = isCelsius ? day.max_c : day.max_f;
    const tempLow = isCelsius ? day.min_c : day.min_f;
    const unit = isCelsius ? "°C" : "°F";

    const label = document.getElementById(`card${i}`);
    if (label) {
      label.innerHTML =
        `<p>${day.date}</p>
         <div class="icon">${icon}</div>
         <p>${tempHigh}${unit} / ${tempLow}${unit}</p>`;
    }
  }
}

loadForecast();
