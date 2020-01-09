'use strict';

const express = require('express');
const helmet = require('helmet');
const request = require('request');


const app = express();
const host = '0.0.0.0';
const port = process.env.PORT || '5000';

app.use(helmet());

app.get('/', (req, res, next) => {
  const url = req.query.u;
  const origin = req.get('origin');

  if ((!url || url.length < 6) || !origin) {
    const error = new Error('Invalid request.');
    next(error);
  } else {
    const allowedHeaders = req.header('access-control-request-headers') || '';
    // Set cors headers.
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', allowedHeaders);

    if (req.method === 'OPTIONS') {
      // Preflight.
      res.send();
    } else {
      const response = request(url);
      response.pipe(res);
    }
  }
});

app.get('/healthz', (_, res) => {
  res.send('Ok.');
});

// Error handler.
app.use((err, _, res, next) => {
  // console.log();
  res.status(403).send('Forbidden!');
});

app.listen(port, host, () => {
  console.log(`Server running at "${host}:${port}".`);
});

// Ctrl-C Handler.
process.on('SIGINT', () => {
  console.log('\n[SIGINT] Gracefully shutting down server (Ctrl-C).');
  process.exit(1);
});
