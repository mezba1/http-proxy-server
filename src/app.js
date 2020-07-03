const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const request = require('request');
const yup = require('yup');
const helpers = require('./helpers');

const { pickExcept } = helpers;
const app = express();

app.use(helmet());
app.use(bodyParser.json());

const bodySchema = yup.object().shape({
  url: yup.string().url().required(),
  method: yup.string().default('get').oneOf(['get', 'post']),
  params: yup.object(),
  body: yup.object(),
  headers: yup.object(),
  cors: yup.boolean().default(false),
  hideClientHeaders: yup.boolean().default(false),
});

// Check server health.
app.get('/health', (_, res) => {
  res.send('Alive');
});

// Core handler.
app.post('/proxy', (req, res, next) => {
  bodySchema
    .validate(req.body)
    .then((value) => {
      const body = value.body;
      const cors = value.cors;
      const headers = value.headers;
      const hideClientHeaders = value.hideClientHeaders;
      const method = value.method;
      const origin = req.get('origin');
      const params = value.params;
      /**
       * @type request.CoreOptions
       */
      const requestOptions = {
        method,
        rejectUnauthorized: false,
      };
      const url = value.url;
      if (params) {
        requestOptions.qs = params;
      }
      if (body) {
        requestOptions.body = body;
      }
      if (headers) {
        requestOptions.headers = headers;
      }
      if (!hideClientHeaders) {
        requestOptions.headers = {
          ...requestOptions.headers,
          ...pickExcept(req.headers, ['content-type', 'content-length', 'host']),
        };
      }
      if (cors) {
        // const allowedHeaders = req.header('access-control-request-headers') || '';
        // Set cors headers.
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        // res.header('Access-Control-Allow-Headers', allowedHeaders);
      }

      if (req.method === 'OPTIONS') {
        // Preflight.
        res.send();
      } else {
        const response = request(url, requestOptions);
        response.pipe(res);
      }
    })
    .catch((err) => {
      console.log(err);
      const error = new Error('Invalid request.');
      next(error);
    });
});

// Error handler.
app.use((err, _, res) => {
  // console.log();
  res.status(403).send('Forbidden!');
});

module.exports = app;
