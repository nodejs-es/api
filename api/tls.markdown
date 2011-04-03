## TLS (SSL)

Usa `require('tls')` para acceder a este módulo.

El módulo `tls` utiliza OpenSSL para proveer seguridad en la Transport Layer Security y/o Secure Socket Layer: encriptacion de flujo de comunicaciones.

TLS/SSL es una infraestructura de clave publica/privada. Cada cliente y cada servidor deben tener una clave privada. Una clave privada se crea como sigue:

    openssl genrsa -out ryans-key.pem 1024

Todos los servidores y algunos clientes necesitan tener un certificado. Los certificados son claves públicas firmadas por una autoridad certificadora (CA) o por ellas mismas. El primer paso para obtener un certificado es crear un fichero de "Petición de firma de Certificado" (CSR). Esto se hace como sigue:

    openssl req -new -key ryans-key.pem -out ryans-csr.pem

Para crear un certificado auto firmado con el CSR, hay que hacer:

    openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem

De forma alternativa puedes enviar el CSR a la autoridad certificadora para firmarlo.

(TODO: documentos sobre la creación de una CA, por ahora los usuarios interesados deberían echar un vistazo a `test/fixtures/keys/Makefile` en el código fuente de Node)

### s = tls.connect(port, [host], [options], callback)

Crea una nueva conexión cliente al `port` y al `host` dados. (`host` por defecto es `localhost`.) `options` debe ser un objeto que especifique:

  - `key`: Una cadena o `Buffer` que contiene la llave privada del servidor en formato PEM. (Requerido)

  - `cert`: Una cadena o `Buffer` que contiene la clave del certificado del servidor en formato PEM.

  - `ca`: Un array de cadenas o `Buffer`s de certificados de confianza. Si esto es omitido, varias CAs "root" bien conocidas serán usadas, como VeriSign. Estas son usadas para autorizar conexiones.

`tls.connect()` devuelve un objeto `CryptoStream` en texto plano.

Después del TSL/SSL handshake el `callback` es invocado. El `callback` será invocado independientemente si el certificado del servidor fue autorizado o no. Es responsabilidad del usuario probar `s.authorized` para ver si el certificado del servidor estaba firmado por una de las CAs especificadas. Si `s.authorized === false` entonces el error puede encontrarse en `s.authorizationError`.

### tls.Server

Esta clase es una subclase de `net.Server` y tiene los mismos métodos.
En lugar de aceptar solo conexiones TCP en bruto, acepta conexiones encriptadas usando TLS o SSL.

Aquí hay un ejemplo simple de un servidor eco:

    var tls = require('tls');
    var fs = require('fs');

    var options = {
      key: fs.readFileSync('server-key.pem'),
      cert: fs.readFileSync('server-cert.pem')
    };

    tls.createServer(options, function (s) {
      s.write("welcome!\n");
      s.pipe(s);
    }).listen(8000);


Puedes probar este servidor conectándose a él con `openssl s_client`:

    openssl s_client -connect 127.0.0.1:8000


#### tls.createServer(options, secureConnectionListener)

Este es un constructor para la clase `tls.Server`. El objeto options puede contener:

  - `key`: Una cadena o `Buffer` que contiene la clave privada del servidor en formato PEM. (Requerido)

  - `cert`: Una cadena o `Buffer` que contiene el certificado del servidor en formato PEM. (Requerido)

  - `ca`: Un array de cadenas o `Buffer`s de certificados de confianza. Si esto es omitido, varias CAs "root" bien conocidas serán usadas, como VeriSign. Estas son usadas para autorizar conexiones.

  - `requestCert`: Si es `true` el servidor solicitará un certificado de todos los clientes que se conecten e intenten verificar ese certificado. Por defecto: `false`

  - `rejectUnauthorized`: Si es `true` el servidor rechazará cualquier conexión no autorizada por la lista de CAs suministradas. Esta opción solo tiene efecto si `requestCert` es `true`. Por defecto: `false`.

#### Event: 'secureConnection'

`function (cleartextStream) {}`

Este evento es emitido después de que una nueva conexión haya realizado con éxito el handshake. El argumento es una instancia ¿duplex? de `stream.Stream`. Tiene todos los métodos y eventos de stream.

`cleartextStream.authorized` es un valor buleano que indica si el cliente está verificado por una de las CA suministradas por el servidor. Si `cleartextStream.authorized` es false, entonces `cleartextStream.authorizationError` describle como falló la autorización. Relacionado pero merece mencionarse: dependiendo de la configuración del servidor TLS, tus autorizaciones de conexión pueden ser aceptadas.

#### server.listen(port, [host], [callback])

Empieza aceptando conexiones en el `port` y el `host` especificados. Si el `host` es omitido, el servidor aceptará conexiones dirigidas a cualquier dirección IPv4 (`INADDR_ANY`).

Esta función es asíncrona. El último parámetro `callback` se invocará cuando el servidor haya estado limitado¿?.

Mirar `net.Server` para más información.

#### server.close()

Para el servidor, dejando de aceptar conexiones. Esta función es asíncrona, el servidor finalmente se cierra cuando emite un evento `'close'`.

#### server.maxConnections

Establece esta propiedad para rechazar conexiones cuando el número de conexiones del servidor sea alta.

#### server.connections

Número de conexiones concurrentes en el servidor.
