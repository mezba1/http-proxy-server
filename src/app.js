const express = require('express');
const Joi = require('@hapi/joi');
const request = require('request');

const app = express();

const querySchema = Joi.object({
  url: Joi.string().uri().required(),
}).rename('u', 'url');

app.route('/').get((req, res) => {
  const validation = querySchema.validate(req.query);
  if (validation.error) {
    return res.status(400).send(validation.error.message);
  }
  const { url } = validation.value;
  const origin = req.get('origin');
  const allowedHeaders = req.header('access-control-request-headers') || '';
  // Set cors headers.
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', allowedHeaders);
  if (req.method === 'OPTIONS') {
    // Preflight.
    return res.send();
  }
  const response = request(url);
  return response.pipe(res);
});

app.route('/health').get((req, res) => res.send('ok'));

module.exports = app;
