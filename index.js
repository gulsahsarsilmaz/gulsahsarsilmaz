require('dotenv').config();
const fs = require('fs');
const Mustache = require('mustache');
const fetch = require('node-fetch')

const MUSTACHE_MAIN_DIR = './main.mustache';

let DATA = {
  name: 'Gulsah',
  refresh_date: new Date().toLocaleDateString('en-us', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'America/Toronto',
  }),
};

async function setWeatherInfo() {
  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${process.env.LOCATION_LAT}&lon=${process.env.LOCATION_LON}&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
  )
    .then(response => response.json())
    .then(response => {
      DATA.city_temperature = Math.round(response.main.temp);
      DATA.city_weather = response.weather[0].description;
      DATA.city_weather_icon = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
      DATA.sun_rise = new Date(response.sys.sunrise * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Toronto',
      });
      DATA.sun_set = new Date(response.sys.sunset * 1000).toLocaleString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Toronto',
      });
    });
}

async function generateReadMe() {
  await fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

async function action() {
  await generateReadMe();

  console.log('\x1b[32m\x1b[40m', '📄 README successfully generated!');
}

action();