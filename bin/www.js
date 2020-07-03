const http = require('http');
const debug = require('debug')('http');
const app = require('../src/app');

const port = process.env.PORT || '3000';
app.set('port', port);
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      throw error;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      throw error;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

server.listen(port, function () {
  debug('Express server listening on port ' + server.address().port);
});
server.on('error', onError);
server.on('listening', onListening);
