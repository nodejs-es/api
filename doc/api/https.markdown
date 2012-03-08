# HTTPS

    Stability: 3 - Stable

HTTPS es el protocolo HTTP sobre TLS/SSL. En Node se implementa en un 
módulo separado.

## Class: https.Server

This class is a subclass of `tls.Server` and emits events same as
`http.Server`. See `http.Server` for more information.

## https.createServer(options, [requestListener])

Returns a new HTTPS web server object. The `options` is similar to
[tls.createServer()](tls.html#tls.createServer).  The `requestListener` is
a function which is automatically added to the `'request'` event.

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

- `host`: A domain name or IP address of the server to issue the request to.
  Defaults to `'localhost'`.
- `hostname`: To support `url.parse()` `hostname` is preferred over `host`
- `port`: Port of remote server. Defaults to 443.
- `method`: A string specifying the HTTP request method. Defaults to `'GET'`.
- `path`: Request path. Defaults to `'/'`. Should include query string if any.
  E.G. `'/index.html?page=12'`
- `headers`: An object containing request headers.
- `auth`: Basic authentication i.e. `'user:password'` to compute an
  Authorization header.
- `agent`: Controls [Agent](#https.Agent) behavior. When an Agent is
  used request will default to `Connection: keep-alive`. Possible values:
 - `undefined` (default): use [globalAgent](#https.globalAgent) for this
   host and port.
 - `Agent` object: explicitly use the passed in `Agent`.
 - `false`: opts out of connection pooling with an Agent, defaults request to
   `Connection: close`.

The following options from [tls.connect()](tls.html#tls.connect) can also be
specified. However, a [globalAgent](#https.globalAgent) silently ignores these.

- key: Clave privada a usar para SSL. Por defecto `null`.
- `passphrase`: A string of passphrase for the private key. Default `null`.
- cert: Certificado público x509 a usar. Por defecto `null`.
- ca: Un certificado de autoridad o un array de certificados de autoridad para comprobar
 contra el host remoto.
- `ciphers`: A string describing the ciphers to use or exclude. Consult
  <http://www.openssl.org/docs/apps/ciphers.html#CIPHER_LIST_FORMAT> for
  details on the format.
- `rejectUnauthorized`: If `true`, the server certificate is verified against
  the list of supplied CAs. An `'error'` event is emitted if verification
  fails. Verification happens at the connection level, *before* the HTTP
  request is sent. Default `false`. 

.

In order to specify these options, use a custom `Agent`.

Example:

    var options = {
      host: 'encrypted.google.com',
      port: 443,
      path: '/',
      method: 'GET',
      key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
      cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem')
    };
    options.agent = new https.Agent(options);

    var req = https.request(options, function(res) {
      ...
    }

Or does not use an `Agent`.

Example:

    var options = {
      host: 'encrypted.google.com',
      port: 443,
      path: '/',
      method: 'GET',
      key: fs.readFileSync('test/fixtures/keys/agent2-key.pem'),
      cert: fs.readFileSync('test/fixtures/keys/agent2-cert.pem'),
      agent: false
    };

    var req = https.request(options, function(res) {
      ...
    }

## https.get(options, callback)

Con `http.get()` pero para HTTPS.

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


## Class: https.Agent

An Agent object for HTTPS similar to [http.Agent](http.html#http.Agent).
See [https.request()](#https.request) for more information.


## https.globalAgent

Global instance of [https.Agent](#https.Agent) which is used as the default
for all HTTPS client requests.