## HTTPS

HTTPS es el protocolo HTTP sobre TLS/SSL. En Node se implementa en un 
módulo separado.

## https.Server
## https.createServer

Ejemplo:

    // curl -k https://localhost:8000/
    var https = require('https');
    var fs = require('fs');

    var options = {
      key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
      cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
    };

    https.createServer(options, function (req, res) {
      res.writeHead(200);
      res.end("hola mundo\n");
    }).listen(8000);


## https.request(options, callback)

Hace una petición a un servidor web seguro.
Opciones similares a `http.request()`.

Ejemplo:

    var https = require('https');

    var options = {
      host: 'encrypted.google.com',
      port: 443,
      path: '/',
      method: 'GET'
    };

    var req = https.request(options, function(res) {
      console.log("statusCode: ", res.statusCode);
      console.log("headers: ", res.headers);

      res.on('data', function(d) {
        process.stdout.write(d);
      });
    });
    req.end();

    req.on('error', function(e) {
      console.error(e);
    });

El argumento options tiene las siguientes opciones

- host: IP o dominio del host al que hacer la petición. Por defecto `'localhost'`.
- port: puerto del host al que hacer la petición. Por defecto 443.
- path: Ruta de la petición. Por defecto `'/'`.
- method: Método de la petición HTTP. Per defecto `'GET'`.
- key: Clave privada a usar para SSL. Por defecto `null`.
- cert: Certificado público x509 a usar. Por defecto `null`.
- ca: Un certificado de autoridad o un array de certificados de autoridad para comprobar contra el host remoto.


## https.get(options, callback)

Como `http.get()` pero para HTTPS.

Ejemplo:

    var https = require('https');

    https.get({ host: 'encrypted.google.com', path: '/' }, function(res) {
      console.log("statusCode: ", res.statusCode);
      console.log("headers: ", res.headers);

      res.on('data', function(d) {
        process.stdout.write(d);
      });

    }).on('error', function(e) {
      console.error(e);
    });




