/* =========================================================
   A TORRE DA TEMPESTADE
   Clima real + ciclo do dia + modo demonstração
========================================================= */

/* =========================================================
   ELEMENTOS
========================================================= */

const body = document.body;

/* Fundos */

const bgNoite = document.getElementById("bg-noite");
const bgAmanhecer = document.getElementById("bg-amanhecer");
const bgDia = document.getElementById("bg-dia");
const bgPordosol = document.getElementById("bg-pordosol");

/* Relógio */

const horaMinuto = document.getElementById("hora-minuto");
const segundo = document.getElementById("segundo");
const dataAtual = document.getElementById("data-atual");
const atmosphereMessage = document.getElementById("atmosphere-message");

/* Clima */

const locationName = document.getElementById("location-name");
const weatherIcon = document.getElementById("weather-icon");
const temperature = document.getElementById("temperature");

const weatherDescription = document.getElementById("weather-description");

const weatherExtra = document.getElementById("weather-extra");

/* Status */

const dayPeriod = document.getElementById("day-period");
const weatherStatus = document.getElementById("weather-status");
const locationStatus = document.getElementById("location-status");
const modeStatus = document.getElementById("mode-status");

/* Controles de horário */

const advance1hBtn = document.getElementById("advance1hBtn");
const advance6hBtn = document.getElementById("advance6hBtn");
const resetTimeBtn = document.getElementById("resetTimeBtn");

/* Demonstração */

const demoToggleBtn = document.getElementById("demoToggleBtn");
const demoPanel = document.getElementById("demoPanel");
const closeDemoBtn = document.getElementById("closeDemoBtn");

const returnRealWeatherBtn = document.getElementById("returnRealWeatherBtn");

const demoStatus = document.getElementById("demoStatus");

const demoWeatherButtons = document.querySelectorAll(".demo-weather-btn");

/* Nuvens */

const cloudContainer = document.getElementById("container-nuvens");

/* Chuva */

const rainLayer = document.getElementById("rain-layer");

/* Relâmpagos */

const lightningFlash = document.getElementById("lightning-flash");

const lightningSvg = document.getElementById("lightning-svg");

const lightningMain = document.getElementById("lightning-main");

const lightningBranch1 = document.getElementById("lightning-branch-1");

const lightningBranch2 = document.getElementById("lightning-branch-2");

/* =========================================================
   ESTADO DA APLICAÇÃO
========================================================= */

const state = {
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

  simulatedHours: 0,

  isDemoMode: false,

  realWeather: null,

  currentWeatherType: "cloudy",

  currentPeriod: null,

  latitude: null,

  longitude: null,

  lightningTimer: null,
};

/* =========================================================
   UTILIDADES
========================================================= */

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInteger(min, max) {
  return Math.floor(random(min, max + 1));
}

function pad(value) {
  return String(value).padStart(2, "0");
}

/* =========================================================
   DATA / HORA SIMULADA
========================================================= */

function getCurrentDate() {
  const now = new Date();

  return new Date(now.getTime() + state.simulatedHours * 60 * 60 * 1000);
}

/* =========================================================
   HORA NA TIMEZONE DO USUÁRIO
========================================================= */

function getTimeParts(date) {
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: state.timezone,

    hour: "2-digit",

    minute: "2-digit",

    second: "2-digit",

    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  const values = {};

  parts.forEach((part) => {
    values[part.type] = part.value;
  });

  return {
    hour: Number(values.hour),

    minute: Number(values.minute),

    second: Number(values.second),
  };
}

/* =========================================================
   RELÓGIO
========================================================= */

function updateClock() {
  const now = getCurrentDate();

  const time = getTimeParts(now);

  horaMinuto.textContent = `${pad(time.hour)}:${pad(time.minute)}`;

  segundo.textContent = pad(time.second);

  const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
    timeZone: state.timezone,

    weekday: "long",

    day: "2-digit",

    month: "long",

    year: "numeric",
  });

  const formattedDate = dateFormatter.format(now);

  dataAtual.textContent =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  updateDayPeriod(time.hour);
}

/* =========================================================
   PERÍODO DO DIA
========================================================= */

function getDayPeriod(hour) {
  if (hour >= 6 && hour < 10) {
    return "dawn";
  }

  if (hour >= 10 && hour < 17) {
    return "day";
  }

  if (hour >= 17 && hour < 20) {
    return "sunset";
  }

  return "night";
}

/* =========================================================
   ALTERAR CENÁRIO PELO HORÁRIO
========================================================= */

function updateDayPeriod(hour) {
  const period = getDayPeriod(hour);

  /*
    ESSA PARTE É IMPORTANTE.

    Antes o sistema reconfigurava o raio
    a cada segundo.

    Agora só fazemos toda a troca
    quando o período realmente muda.
  */

  if (state.currentPeriod === period) {
    return;
  }

  state.currentPeriod = period;

  body.classList.remove(
    "period-dawn",
    "period-day",
    "period-sunset",
    "period-night",
  );

  body.classList.add(`period-${period}`);

  [bgNoite, bgAmanhecer, bgDia, bgPordosol].forEach((background) => {
    background.classList.remove("visible");
  });

  switch (period) {
    case "dawn":
      bgAmanhecer.classList.add("visible");

      dayPeriod.textContent = "Amanhecer";

      break;

    case "day":
      bgDia.classList.add("visible");

      dayPeriod.textContent = "Dia";

      break;

    case "sunset":
      bgPordosol.classList.add("visible");

      dayPeriod.textContent = "Entardecer";

      break;

    default:
      bgNoite.classList.add("visible");

      dayPeriod.textContent = "Noite";

      break;
  }

  updateAtmosphereMessage(period);

  createClouds(state.currentWeatherType);

  configureLightning();
}

/* =========================================================
   MENSAGENS ATMOSFÉRICAS
========================================================= */

function updateAtmosphereMessage(period) {
  const weather = state.currentWeatherType;

  const messages = {
    clear: {
      dawn: "A primeira luz atravessa as muralhas da torre.",

      day: "O céu se abre sobre as antigas pedras.",

      sunset: "As últimas luzes desaparecem atrás das torres.",

      night: "A escuridão desperta algo sobre a torre.",
    },

    cloudy: {
      dawn: "Nuvens baixas atravessam o amanhecer.",

      day: "As nuvens cobrem lentamente o horizonte.",

      sunset: "O entardecer desaparece sob um céu pesado.",

      night: "Nuvens sombrias cercam a torre.",
    },

    rain: {
      dawn: "A chuva desperta junto com a torre.",

      day: "Relâmpagos iluminam a chuva sobre as muralhas.",

      sunset: "Clarões atravessam o céu sob a chuva.",

      night: "A chuva cai enquanto o céu se rompe em luz.",
    },

    storm: {
      dawn: "O amanhecer chega sob sinais de tempestade.",

      day: "A tempestade avança sobre a torre.",

      sunset: "A tempestade domina o horizonte.",

      night: "A torre enfrenta a fúria da tempestade.",
    },
  };

  const group = messages[weather] || messages.cloudy;

  atmosphereMessage.textContent = group[period];
}

/* =========================================================
   INTERPRETAR CÓDIGOS OPEN-METEO
========================================================= */

function interpretWeatherCode(code) {
  if (code === 0) {
    return {
      type: "clear",

      description: "Céu limpo",

      icon: "fa-sun",
    };
  }

  if (code === 1 || code === 2 || code === 3 || code === 45 || code === 48) {
    return {
      type: "cloudy",

      description: "Nublado",

      icon: "fa-cloud",
    };
  }

  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return {
      type: "rain",

      description: "Chuva",

      icon: "fa-cloud-rain",
    };
  }

  if (code === 95 || code === 96 || code === 99) {
    return {
      type: "storm",

      description: "Tempestade",

      icon: "fa-cloud-bolt",
    };
  }

  if (code >= 71 && code <= 77) {
    return {
      type: "cloudy",

      description: "Neve",

      icon: "fa-snowflake",
    };
  }

  return {
    type: "cloudy",

    description: "Tempo variável",

    icon: "fa-cloud",
  };
}

/* =========================================================
   APLICAR CLIMA
========================================================= */

function applyWeather(weatherType, data = null, isDemo = false) {
  state.currentWeatherType = weatherType;

  body.classList.remove(
    "weather-clear",
    "weather-cloudy",
    "weather-rain",
    "weather-storm",
  );

  body.classList.add(`weather-${weatherType}`);

  createClouds(weatherType);

  createRain(weatherType);

  if (isDemo) {
    updateDemoWeatherDisplay(weatherType);
  } else if (data) {
    updateRealWeatherDisplay(data);
  }

  const currentHour = getTimeParts(getCurrentDate()).hour;

  updateAtmosphereMessage(getDayPeriod(currentHour));

  configureLightning();

  /*
    NO MODO DEMONSTRAÇÃO
    O EFEITO ACONTECE NA HORA.
  */

  if (isDemo) {
    const period = getDayPeriod(currentHour);

    if (weatherType === "storm") {
      setTimeout(triggerFullLightning, 250);
    } else if (weatherType === "rain" && period !== "night") {
      setTimeout(triggerSkyFlash, 250);
    } else if (period === "night") {
      setTimeout(triggerFullLightning, 250);
    }
  }
}

/* =========================================================
   BUSCAR CLIMA REAL
========================================================= */

async function fetchWeather(latitude, longitude) {
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      "&current=" +
      [
        "temperature_2m",
        "apparent_temperature",
        "precipitation",
        "rain",
        "showers",
        "weather_code",
        "cloud_cover",
        "wind_speed_10m",
        "wind_gusts_10m",
      ].join(",") +
      "&daily=" +
      ["temperature_2m_max", "temperature_2m_min"].join(",") +
      "&timezone=auto" +
      "&forecast_days=1";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Não foi possível obter o clima.");
    }

    const data = await response.json();

    state.timezone = data.timezone || state.timezone;

    const interpreted = interpretWeatherCode(data.current.weather_code);

    const weatherData = {
      type: interpreted.type,

      description: interpreted.description,

      icon: interpreted.icon,

      temperature: Math.round(data.current.temperature_2m),

      apparentTemperature: Math.round(data.current.apparent_temperature),

      wind: Math.round(data.current.wind_speed_10m),

      gust: Math.round(data.current.wind_gusts_10m),

      cloudCover: Math.round(data.current.cloud_cover),

      precipitation: data.current.precipitation,

      max: Math.round(data.daily.temperature_2m_max[0]),

      min: Math.round(data.daily.temperature_2m_min[0]),
    };

    state.realWeather = weatherData;

    if (!state.isDemoMode) {
      applyWeather(weatherData.type, weatherData, false);
    }
  } catch (error) {
    console.error("Erro ao buscar clima:", error);

    weatherDescription.textContent = "Clima indisponível";

    weatherExtra.textContent = "Usando atmosfera padrão";

    if (!state.isDemoMode) {
      applyWeather("cloudy", null, false);
    }
  }
}

/* =========================================================
   MOSTRAR CLIMA REAL
========================================================= */

function updateRealWeatherDisplay(data) {
  weatherIcon.className = `fa-solid ${data.icon}`;

  temperature.textContent = `${data.temperature}°C`;

  weatherDescription.textContent = data.description;

  weatherExtra.textContent = `Máx ${data.max}° • Mín ${data.min}° • Vento ${data.wind} km/h`;

  weatherStatus.textContent = data.description;
}

/* =========================================================
   MOSTRAR CLIMA DEMONSTRAÇÃO
========================================================= */

function updateDemoWeatherDisplay(type) {
  const demoWeather = {
    clear: {
      description: "Céu limpo",

      icon: "fa-sun",

      temperature: "24°C",
    },

    cloudy: {
      description: "Nublado",

      icon: "fa-cloud",

      temperature: "18°C",
    },

    rain: {
      description: "Chuva",

      icon: "fa-cloud-rain",

      temperature: "15°C",
    },

    storm: {
      description: "Tempestade",

      icon: "fa-cloud-bolt",

      temperature: "12°C",
    },
  };

  const weather = demoWeather[type];

  weatherIcon.className = `fa-solid ${weather.icon}`;

  temperature.textContent = weather.temperature;

  weatherDescription.textContent = weather.description;

  weatherExtra.textContent = "Simulação atmosférica";

  weatherStatus.textContent = `${weather.description} • Demo`;

  demoStatus.textContent = `Simulando: ${weather.description}`;

  demoWeatherButtons.forEach((button) => {
    button.classList.toggle(
      "active",

      button.dataset.weather === type,
    );
  });
}

/* =========================================================
   LOCALIZAÇÃO
========================================================= */

function getLocation() {
  if (!navigator.geolocation) {
    useApproximateLocation();

    return;
  }

  locationStatus.textContent = "localizando dispositivo";

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      state.latitude = position.coords.latitude;

      state.longitude = position.coords.longitude;

      locationStatus.textContent = "localização do dispositivo";

      await reverseGeocode(state.latitude, state.longitude, true);

      fetchWeather(state.latitude, state.longitude);
    },

    () => {
      useApproximateLocation();
    },

    {
      enableHighAccuracy: false,

      timeout: 9000,

      maximumAge: 600000,
    },
  );
}

/* =========================================================
   LOCALIZAÇÃO APROXIMADA
========================================================= */

async function useApproximateLocation() {
  try {
    locationStatus.textContent = "localização aproximada";

    const response = await fetch(
      "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=pt",
    );

    if (!response.ok) {
      throw new Error("Localização aproximada indisponível.");
    }

    const data = await response.json();

    state.latitude = data.latitude;

    state.longitude = data.longitude;

    updateLocationName(data);

    fetchWeather(state.latitude, state.longitude);
  } catch (error) {
    console.error("Erro de localização:", error);

    locationName.textContent = "Localização indisponível";

    locationStatus.textContent = "origem desconhecida";

    if (!state.isDemoMode) {
      applyWeather("cloudy", null, false);
    }
  }
}

/* =========================================================
   GEOCODIFICAÇÃO REVERSA
========================================================= */

async function reverseGeocode(latitude, longitude, precise = false) {
  try {
    const url =
      "https://api.bigdatacloud.net/data/reverse-geocode-client" +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      "&localityLanguage=pt";

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Erro ao obter nome da região.");
    }

    const data = await response.json();

    updateLocationName(data);

    if (precise) {
      locationStatus.textContent = "localização do dispositivo";
    }
  } catch (error) {
    console.error("Erro de geocodificação:", error);

    locationName.textContent = "Sua região";
  }
}

/* =========================================================
   NOME DA LOCALIZAÇÃO
========================================================= */

function updateLocationName(data) {
  const city =
    data.city || data.locality || data.principalSubdivision || "Sua região";

  const country = data.countryName || "";

  locationName.textContent = country ? `${city}, ${country}` : city;
}

/* =========================================================
   NUVENS
========================================================= */

function createClouds(weatherType) {
  cloudContainer.innerHTML = "";

  let config;

  switch (weatherType) {
    case "clear":
      config = {
        count: 2,

        types: ["light"],

        minDuration: 70,

        maxDuration: 105,

        minScale: 0.7,

        maxScale: 1.05,
      };

      break;

    case "cloudy":
      config = {
        count: 5,

        types: ["light", "heavy"],

        minDuration: 48,

        maxDuration: 80,

        minScale: 0.8,

        maxScale: 1.25,
      };

      break;

    case "rain":
      config = {
        count: 7,

        types: ["heavy", "storm"],

        minDuration: 34,

        maxDuration: 58,

        minScale: 0.9,

        maxScale: 1.4,
      };

      break;

    case "storm":
      config = {
        count: 9,

        types: ["heavy", "storm"],

        minDuration: 25,

        maxDuration: 44,

        minScale: 1,

        maxScale: 1.55,
      };

      break;

    default:
      config = {
        count: 3,

        types: ["light"],

        minDuration: 60,

        maxDuration: 90,

        minScale: 0.8,

        maxScale: 1.15,
      };
  }

  /*
    À NOITE SEMPRE EXISTEM
    NUVENS MAIS SOMBRIAS.
  */

  if (state.currentPeriod === "night" && weatherType === "clear") {
    config.count = 4;

    config.types = ["light", "heavy"];
  }

  for (let index = 0; index < config.count; index++) {
    createCloud(config);
  }
}

/* =========================================================
   CRIAR UMA NUVEM
========================================================= */

function createCloud(config) {
  const cloud = document.createElement("div");

  const type = config.types[randomInteger(0, config.types.length - 1)];

  cloud.className = `cloud ${type}`;

  const top = random(-7, 62);

  const duration = random(config.minDuration, config.maxDuration);

  const delay = -random(0, duration);

  const scale = random(config.minScale, config.maxScale);

  cloud.style.top = `${top}%`;

  cloud.style.animationDuration = `${duration}s`;

  cloud.style.animationDelay = `${delay}s`;

  cloud.style.setProperty("--scale", scale);

  cloud.style.width = `${random(32, 52)}vw`;

  cloudContainer.appendChild(cloud);
}

/* =========================================================
   CHUVA
========================================================= */

function createRain(weatherType) {
  rainLayer.innerHTML = "";

  if (weatherType !== "rain" && weatherType !== "storm") {
    return;
  }

  const dropCount = weatherType === "storm" ? 135 : 85;

  for (let index = 0; index < dropCount; index++) {
    const drop = document.createElement("span");

    drop.className = "raindrop";

    drop.style.left = `${random(0, 110)}%`;

    drop.style.setProperty("--rain-size", `${random(9, 20)}vh`);

    drop.style.setProperty("--rain-speed", `${random(0.45, 0.9)}s`);

    drop.style.setProperty("--rain-delay", `${-random(0, 2)}s`);

    drop.style.setProperty(
      "--rain-opacity",

      weatherType === "storm" ? random(0.3, 0.7) : random(0.18, 0.48),
    );

    rainLayer.appendChild(drop);
  }
}

/* =========================================================
   SISTEMA DE RELÂMPAGOS
========================================================= */

/*
  REGRA:

  DIA + LIMPO
  sem efeito

  DIA + NUBLADO
  sem efeito

  DIA + CHUVA
  somente clarão

  DIA + TEMPESTADE
  clarão + raio visível

  NOITE
  clarão + raio visível
  independentemente do clima
*/

function configureLightning() {
  clearTimeout(state.lightningTimer);

  const period = state.currentPeriod;

  const weather = state.currentWeatherType;

  /*
    REGRA GÓTICA:
    NOITE TEM RAIO.
  */

  if (period === "night") {
    scheduleLightning(
      "full",
      state.isDemoMode ? 3500 : 6500,
      state.isDemoMode ? 7500 : 16000,
    );

    return;
  }

  /*
    TEMPESTADE:
    RAIO VISÍVEL + CLARÃO.
  */

  if (weather === "storm") {
    scheduleLightning(
      "full",
      state.isDemoMode ? 2500 : 4000,
      state.isDemoMode ? 6000 : 10000,
    );

    return;
  }

  /*
    CHUVA:
    SOMENTE RELÂMPAGO / CLARÃO.
  */

  if (weather === "rain") {
    scheduleLightning(
      "flash",
      state.isDemoMode ? 2200 : 5000,
      state.isDemoMode ? 5500 : 13000,
    );

    return;
  }
}

/* =========================================================
   AGENDAR EFEITO
========================================================= */

function scheduleLightning(effect, minDelay, maxDelay) {
  const delay = random(minDelay, maxDelay);

  state.lightningTimer = setTimeout(() => {
    if (effect === "full") {
      triggerFullLightning();
    } else {
      triggerSkyFlash();
    }

    configureLightning();
  }, delay);
}

/* =========================================================
   SOMENTE CLARÃO
========================================================= */

function triggerSkyFlash() {
  lightningFlash.classList.remove("flash");

  /*
    Força o navegador a reiniciar
    a animação CSS.
  */

  void lightningFlash.offsetWidth;

  lightningFlash.classList.add("flash");

  setTimeout(() => {
    lightningFlash.classList.remove("flash");
  }, 650);
}

/* =========================================================
   RAIO VISÍVEL + CLARÃO
========================================================= */

function triggerFullLightning() {
  generateLightningPath();

  lightningSvg.classList.remove("active");

  lightningFlash.classList.remove("flash");

  /*
    Reinicia as animações.
  */

  void lightningSvg.getBoundingClientRect();

  void lightningFlash.getBoundingClientRect();

  lightningSvg.classList.add("active");

  lightningFlash.classList.add("flash");

  /*
    Alguns raios ganham
    um segundo clarão menor.
  */

  if (Math.random() > 0.55) {
    setTimeout(
      () => {
        lightningFlash.classList.remove("flash");

        void lightningFlash.offsetWidth;

        lightningFlash.classList.add("flash");
      },
      random(180, 330),
    );
  }

  setTimeout(() => {
    lightningSvg.classList.remove("active");

    lightningFlash.classList.remove("flash");
  }, 800);
}

/* =========================================================
   DESENHAR RAIO PRINCIPAL
========================================================= */

function generateLightningPath() {
  /*
    O raio começa sempre
    na região superior da tela.
  */

  const startX = random(120, 880);

  const startY = random(-20, 30);

  /*
    Nem todo raio precisa
    atingir o chão.
  */

  const endY = random(430, 690);

  const segments = randomInteger(10, 15);

  const points = [];

  let currentX = startX;

  let currentY = startY;

  const verticalStep = (endY - startY) / segments;

  points.push({
    x: currentX,

    y: currentY,
  });

  for (let index = 1; index <= segments; index++) {
    currentX += random(-52, 52);

    /*
      Impede o raio de escapar
      completamente da tela.
    */

    currentX = Math.max(40, Math.min(960, currentX));

    currentY += verticalStep + random(-7, 10);

    points.push({
      x: currentX,

      y: currentY,
    });
  }

  lightningMain.setAttribute(
    "points",

    points.map((point) => `${point.x},${point.y}`).join(" "),
  );

  /*
    RAMO 1
  */

  createLightningBranch(
    lightningBranch1,

    points,

    randomInteger(3, Math.max(4, points.length - 5)),

    Math.random() > 0.5 ? random(90, 190) : random(-190, -90),
  );

  /*
    RAMO 2
  */

  createLightningBranch(
    lightningBranch2,

    points,

    randomInteger(4, Math.max(5, points.length - 4)),

    Math.random() > 0.5 ? random(70, 160) : random(-160, -70),
  );
}

/* =========================================================
   CRIAR RAMOS DO RAIO
========================================================= */

function createLightningBranch(
  element,
  mainPoints,
  startIndex,
  horizontalDirection,
) {
  const start = mainPoints[startIndex];

  if (!start) {
    element.setAttribute("points", "");

    return;
  }

  const branchPoints = [
    {
      x: start.x,

      y: start.y,
    },
  ];

  let x = start.x;

  let y = start.y;

  const segments = randomInteger(3, 5);

  for (let index = 0; index < segments; index++) {
    x += horizontalDirection / segments + random(-22, 22);

    y += random(28, 55);

    branchPoints.push({
      x,

      y,
    });
  }

  element.setAttribute(
    "points",

    branchPoints.map((point) => `${point.x},${point.y}`).join(" "),
  );
}

/* =========================================================
   PAINEL DEMONSTRAÇÃO
========================================================= */

function openDemoPanel() {
  demoPanel.hidden = false;

  demoToggleBtn.classList.add("active");

  demoToggleBtn.setAttribute("aria-expanded", "true");
}

function closeDemoPanel() {
  demoPanel.hidden = true;

  demoToggleBtn.classList.remove("active");

  demoToggleBtn.setAttribute("aria-expanded", "false");
}

/* =========================================================
   ENTRAR NO MODO DEMO
========================================================= */

function enterDemoMode(weatherType) {
  state.isDemoMode = true;

  body.classList.add("demo-mode");

  modeStatus.textContent = "Demonstração";

  applyWeather(weatherType, null, true);
}

/* =========================================================
   VOLTAR AO CLIMA REAL
========================================================= */

function returnToRealWeather() {
  state.isDemoMode = false;

  body.classList.remove("demo-mode");

  modeStatus.textContent = "Real";

  demoStatus.textContent = "Clima real ativo";

  demoWeatherButtons.forEach((button) => {
    button.classList.remove("active");
  });

  if (state.realWeather) {
    applyWeather(state.realWeather.type, state.realWeather, false);
  } else if (state.latitude !== null && state.longitude !== null) {
    fetchWeather(state.latitude, state.longitude);
  } else {
    applyWeather("cloudy", null, false);
  }
}

/* =========================================================
   CONTROLES DE HORÁRIO
========================================================= */

advance1hBtn.addEventListener("click", () => {
  state.simulatedHours += 1;

  /*
      Força atualização do período.
    */

  state.currentPeriod = null;

  updateClock();
});

advance6hBtn.addEventListener("click", () => {
  state.simulatedHours += 6;

  state.currentPeriod = null;

  updateClock();
});

resetTimeBtn.addEventListener("click", () => {
  state.simulatedHours = 0;

  state.currentPeriod = null;

  updateClock();
});

/* =========================================================
   BOTÃO DEMONSTRAÇÃO
========================================================= */

demoToggleBtn.addEventListener("click", () => {
  if (demoPanel.hidden) {
    openDemoPanel();
  } else {
    closeDemoPanel();
  }
});

/* =========================================================
   FECHAR DEMO
========================================================= */

closeDemoBtn.addEventListener("click", closeDemoPanel);

/* =========================================================
   BOTÕES DO CLIMA DEMO
========================================================= */

demoWeatherButtons.forEach((button) => {
  button.addEventListener("click", () => {
    enterDemoMode(button.dataset.weather);
  });
});

/* =========================================================
   VOLTAR AO CLIMA REAL
========================================================= */

returnRealWeatherBtn.addEventListener("click", () => {
  returnToRealWeather();

  closeDemoPanel();
});

/* =========================================================
   ESC FECHA PAINEL
========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !demoPanel.hidden) {
    closeDemoPanel();
  }
});

/* =========================================================
   ATUALIZAÇÃO DO CLIMA REAL
   A CADA 15 MINUTOS
========================================================= */

setInterval(
  () => {
    if (state.latitude !== null && state.longitude !== null) {
      fetchWeather(state.latitude, state.longitude);
    }
  },
  15 * 60 * 1000,
);

/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initialize() {
  /*
    Define o período antes
    de criar as nuvens.
  */

  state.currentPeriod = null;

  updateClock();

  /*
    Atmosfera temporária
    enquanto busca o clima real.
  */

  applyWeather("cloudy", null, false);

  getLocation();

  /*
    IMPORTANTE:
    O relógio continua atualizando
    a cada segundo.

    Mas o timer do raio NÃO é mais
    reiniciado a cada segundo.
  */

  setInterval(updateClock, 1000);
}

initialize();
