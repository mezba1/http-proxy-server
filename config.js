const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('.env')) {
  dotenv.config();
}

const defaults = {
  PORT: '3000',
};

// ensure that process.env has all values in defaults, but prefer the process.env value
Object.keys(defaults).forEach((key) => {
  process.env[key] = key in process.env ? process.env[key] : defaults[key];
});

module.exports = process.env;
