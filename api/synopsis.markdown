## Sinopsis

Un ejemplo de un [servidor web](http.html) escrito en Node que responde con 'Hola
mundo':

    var http = require('http');

    http.createServer(function (request, response) {
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Hola mundo\n');
    }).listen(8124);

    console.log('Servidor ejecutándose en http://127.0.0.1:8124/');

Para ejecutar el servidor, copie el código en un fichero llamado `example.js` y ejecútelo
con el programa node

    > node example.js
    Servidor ejecutándose en http://127.0.0.1:8124/

Todos los ejemplos en está documentación son ejecutados de manera similar.
