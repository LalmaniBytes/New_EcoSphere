const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));

export function calculateEnvironmentalHealth({
  aqi = 100,
  temperature = 25,
  humidity = 50,
  windSpeed = 3, // m/s
  congestionScore = 20,
  precipitationMm = 0,
  weights = { air: 0.5, noise: 0.25, weather: 0.25 },
}) {
  const estimatedDb = 50 + (congestionScore / 100) * 35; // 50–85 dB

  // 2️⃣ Subscores — stricter scaling
  const airScore = clamp(100 - (aqi / 400) * 100); 
  const noiseScore = clamp(100 - ((estimatedDb - 40) / 50) * 100);

  const tempScore = clamp(100 - (Math.abs(temperature - 23) / 15) * 100);
  const humidityScore = clamp(100 - (Math.abs(humidity - 45) / 40) * 100);
  const windScore = clamp(100 - (Math.abs(windSpeed - 3) / 5) * 100);

  let weatherScore = (tempScore * 0.5) + (humidityScore * 0.3) + (windScore * 0.2);

  let precipPenalty = 0;
  if (precipitationMm > 5) precipPenalty = 5;
  if (precipitationMm > 20) precipPenalty = 12;
  if (precipitationMm > 50) precipPenalty = 25;
  weatherScore = clamp(weatherScore - precipPenalty);

  // 5️⃣ Combine with weights
  const subScores = { air: airScore, noise: noiseScore, weather: weatherScore };
  const finalScore =
    subScores.air * weights.air +
    subScores.noise * weights.noise +
    subScores.weather * weights.weather;

  // 6️⃣ Output breakdown
  return {
    score: Math.round(finalScore),
    breakdown: {
      airScore: Math.round(airScore),
      noiseScore: Math.round(noiseScore),
      weatherScore: Math.round(weatherScore),
      estimatedDb: Math.round(estimatedDb),
    },
  };
}
