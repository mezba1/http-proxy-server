const http = require('http');
const app = require('./src');
const config = require('./config');

const PORT = parseInt(config.PORT, 10);
app.set('port', PORT);
const server = http.createServer(app);

const handleError = (err) => {
  // if (error.syscall !== 'listen') {
  //   throw error;
  // }

  // const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // // handle specific listen errors with friendly messages
  // switch (error.code) {
  //   case 'EACCES':
  //     console.error(bind + ' requires elevated privileges');
  //     throw error;
  //   case 'EADDRINUSE':
  //     console.error(bind + ' is already in use');
  //     throw error;
  //   default:
  //     throw error;
  // }
  console.log(err);
};

const handleListening = () => {
  const addr = server.address();
  let message;
  if (typeof addr === 'string') {
    message = `Server listening on ${addr}`;
  } else if (addr.family === 'IPv6') {
    message = `Server listening on [${addr.address}]:${addr.port}`;
  } else {
    message = `Server listening on ${addr.address}:${addr.port}`;
  }
  console.log(message);
};

server.listen(PORT);
server.on('error', handleError);
server.on('listening', handleListening);

const terminationSignals = ['SIGINT', 'SIGQUIT', 'SIGTERM'];

terminationSignals.forEach((signal) => {
  process.on(signal, () => {
    console.log(`Received ${signal}, trying to close server gracefully`);
    server.close((err) => {
      if (err) {
        throw err;
      }
      process.exit(0);
    });
    setTimeout(() => {
      throw new Error('Could not close server gracefully');
    }, 10000);
  });
});
