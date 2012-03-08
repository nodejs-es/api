# net

    Stability: 3 - Stable

El módulo `net` te proporciona una envoltura asíncrona de la red. Contiene
métodos para crear servidores y clientes (llamados streams). Puedes incluir
este módulo con `require("net");`

## net.createServer([options], [connectionListener])

Crea un nuevo servidor TCP. El argumento es `connectionListener` se establece
automáticamente como listener del evento ['connection'](#event_connection_).


`options` is an object with the following defaults:

    { allowHalfOpen: false
    }

Si `allowHalfOpen` es `true`, entonces el socket no enviará automáticamente el paquete FIN 
cuando el otro extremo del socket envíe un paquete FIN. El socket se vuelve de no-lectura, pero 
conserva la escritura. Deberías llamar el método end() explícitamente.
Mirar el evento `'end'` para más información.

Aquí un ejemplo de un servidor simple que espera conecciones
en el puerto 8124:

    var net = require('net');
    var server = net.createServer(function(c) { //'connection' listener
      console.log('server connected');
      c.on('end', function() {
        console.log('server disconnected');
      });
      c.write('hello\r\n');
      c.pipe(c);
    });
    server.listen(8124, function() { //'listening' listener
      console.log('server bound');
    });

Pruebalo usando `telnet`:

    telnet localhost 8124

To listen on the socket `/tmp/echo.sock` the third line from the last would
just be changed to

    server.listen('/tmp/echo.sock', function() { //'listening' listener

Use `nc` to connect to a UNIX domain socket server:

    nc -U /tmp/echo.sock

## net.connect(options, [connectionListener])
## net.createConnection(options, [connectionListener])

Construye un nuevo objeto socket y abre un socket al sitio seleccionado. Cuando 
se establece el socket se emitirá el evento `'connect'`.

Los argumentos de este método cambian el tipo de conexión:

* `net.createConnection(port, [host])`

  Crea una conexión TCP al `port` de `host`. Si se omite `host`, 
  se asumirá `localhost`.

* `net.createConnection(path)`

  Crea una conexión socket de unix a `path`

---

## net.Server

Esta clase se usa para crear un servidor TCP o UNIX.

A continuación hay un ejemplo de un servidor echo que espera conexiones
por el puerto 8124:

    var net = require('net');
    var server = net.createServer(function (c) {
      c.write('hola\r\n');
      c.pipe(c);
    });
    server.listen(8124, 'localhost');

Pruébalo usando `telnet`:

    telnet localhost 8124

Para escuchar en el socket `/tmp/echo.sock` la última linea se tendría
que cambiar por

    server.listen('/tmp/echo.sock');

Utiliza `nc` para conectar con un servidor socket del dominio UNIX:	

    nc -U /tmp/echo.sock

`net.Server` es un `EventEmitter` con los siguientes eventos:


## server.listen(port, [host], [callback])

Empieza aceptando conexiones en el `port` y `host` especificados.  Si se 
omite el `host`, el servidor aceptará conexiones dirigidas a cualquier
dirección IPv4 (`INADDR_ANY`).

Esta función es asíncrona. Cuando el servidor haya sido enlazado se llamará 
el último parámetro `callback`.

Un problema que se encuentran los usuarios es recibir el error `EADDRINUSE`. Significa
que otro servidor ya se está ejecutando en el puerto seleccionado. Una de las maneras
de tratar esto sería esperar un segundo y volverlo a intentar. Esto se puede hacer con

    server.on('error', function (e) {
      if (e.code == 'EADDRINUSE') {
        console.log('Dirección en uso, reintentándolo...');
        setTimeout(function () {
          server.close();
          server.listen(PORT, HOST);
        }, 1000);
      }
    });

(Nota: Todos los sockets en Node están configurados con SO_REUSEADDR)


## server.listen(path, [callback])

Arranca un socket UNIX de servidor esperando conexiones a través de `path`

Esta función es asíncrona. Cuando el servidor haya sido enlazado se llamará 
el último parámetro `callback`.


## server.listenFD(fd)

Arranca un servidor esperando conexiones en el descriptor de fichero dado.

El descriptor de fichero ya tiene que haber invocado las llamadas de sistema 
`bind(2)` y `listen(2)`.


## server.close()

El servidor para de aceptar nuevas conexiones. Esta función es 
asíncrona, el servidor se cerrará definitivamente cuando el servidor 
emita el evento `'close'`.


## server.address()

Devuelve la dirección asociada al servidor según el sistema operativo.
Útil para encontrar que puerto se ha asignado cuando se ha optado por obtener una dirección asignada por el SO.

Ejemplo:

    var server = net.createServer(function (socket) {
      socket.end("adiós\n");
    });

    // obtener un puerto aleatorio.
    server.listen(function() {
      address = server.address();
      console.log("servidor abierto en %j", address);
    });


## server.maxConnections

Establecer esta propiedad para rechazar conexiones cuando el número de conexiones del servidor es elevado.


## server.connections

El número de conexiones concurrentes en el servidor.


## Evento: 'connection'

`function (socket) {}`

Emitido cuando se crea una nueva conexión. `socket` es una instancia de 
`net.Socket`.


## Evento: 'close'

`function () {}`

Emitido cuando se cierra el servidor.

---

## net.Socket

Este objeto es una abstracción de un socket TCP o UNIX. Las instancias 
de `net.Socket` implementan una interfaz duplex Stream.  Las pueden crear
los usuarios y pueden ser usadas como un cliente (con `connect()`) o pueden
crearse con Node y pasarlas al usuario a través del evento `'connection'` de
un servidor. 

Las instancias de `net.Socket` son EventEmitters con los siguientes eventos: 

## new net.Socket([options])

Construye un nuevo objeto socket.

`options` es un objeto que por defecto es:

    { fd: null
      type: null
      allowHalfOpen: false
    }

`fd` te permite especificar el descriptor de fichero actual del socket. `type` 
especifica el protocolo subyacente. Puede ser `'tcp4'`, `'tcp6'`, o `'unix'`.
Respecto a `allowHalfOpen`, se refiere a `createServer()` y el evento `'end'`. 

## socket.connect(port, [host], [callback])
## socket.connect(path, [callback])

Abre la conexión a un socket dado. Si se especifican `port` y `host`, 
entonces el socket se abrirá como un socket TCP, si se omite el `host`, 
se asume `localhost`. Si se expecifica un `path`, el socket se abrirá como
un socket de unix a esa ruta.

Normalmente no se necesita este método, ya que `net.createConnection` abre 
el socket. Úsalo sólo si estás implementando un Socket a medida o si un
Socket está cerrado y quieres reutilizarlo para conectar con otro servidor.

Esta función es asíncrona. Se establece el socket cuando se emite el 
evento `'connect'`. Si hay algún problema conectando, no se emitirá el
evento `'connect'`, se emitirá el evento `'error'` con la excepción. 

El parámetro `callback` se añadirá como listener del evento 'connect'.


## socket.bufferSize

`net.Socket` tiene la propiedad de que `socket.write()` siempre funciona. Esto 
es para ayudar a los usuarios a ejecutarlo lo antes posible. La computadora no tiene
que mantener necesariamente todos los datos que se escriben en el socket - la conexión podría ser
demasiado lenta. Internamente, Node, encolará los datos escritos en el socket y los 
enviará por el cable cuando sea posible. (Internamente se va preguntando 
al descriptor de fichero del socket si se puede escribir).

La consecuencia de este buffering interno es que la memoria puede crecer. 
Esta propiedad muestra el número de carácteres almacenados esperando a ser escritos.
(El número de carácteres es aproximadamente igual al número de bytes a escribir, 
pero el buffer puede contener strings, y los strings se codifican perezosamente, 
por lo tanto el número exacto de bytes no es conocido.)

Los usuarios que experimenten grandes o crecidas de `bufferSize` deberían 
intentar "regular" el flujo de datos en sus programas con `pause()` y `resume()`.


## socket.setEncoding(encoding=null)

Establece la codificación (ya sea `'ascii'`, `'utf8'`, o `'base64'`) para 
los datos que se reciben.

## socket.setSecure()

Esta función se ha eliminado en v0.3. Se usaba para actualizar la conexión a
SSL/TLS. Mira TLS para la nueva API.


## socket.write(data, [encoding], [callback])

Envía los datos al socket. El segundo parámetro especifica la codificación 
si es un string--por defecto lo codifica a UTF8.

Devuelve `true` si se han traspasado completamente todos los datos al búfer del 
kernel. Devuelve `false` si todos o parte de los datos se ha encolado en la memoria
de usuario. Se emitirá `'drain'` cuando el búfer vuelva a estar libre.

El parámetro opcional `callback` se ejecutará se acabe de escribir - puede 
que no suceda inmediatamente.

## socket.write(data, [encoding], [fileDescriptor], [callback])

Para los sockets UNIX, es posible enviar descriptor de fichero a través 
del socket. Basta con añadir el argumento `fileDescriptor` y escuchar el 
evento `'fd'` en el otro extremo.


## socket.end([data], [encoding])

Cierra parcialmente el socket. I.E., envia un paquete FIN. Es posible 
que el servidor continue enviando algunos datos.

Si se especifica `data`, es equivalente a llamar a `socket.write(data, encoding)` 
seguido de `socket.end()`.

## socket.destroy()

Se asegura que no habrá más actividad de E/S en el socket. Sólo se necesita 
en caso de errores (errores de parse)

## socket.pause()

Pausa la lectura de los datos. Eso es, no se emitirán eventos `'data'`. 
Útil para moderar la velocidad de una subida.

## socket.resume()

Continua leyendo después de llamar a `pause()`.

## socket.setTimeout(timeout, [callback])

Pone el socket en timeout después de `timeout` milisegundos de inactividad en 
el socket. Por defecto `net.Socket`no tiene timeout.

Cuando se dispara un timeout en espera el socket recibirá un evento `'timeout'` 
pero la conexión no se cortará. El usuario tiene que invocar manualmente `end()` o 
`destroy()` en el socket.

Si `timeout` es 0, entonces el actual timeout en espera se desactiva.

El parametro opcional `callback` se añadirá como un listener de una sola vez del evento `'timeout'`.

## socket.setNoDelay(noDelay=true)

Deshabilita el algoritmo de Nagle. Por defecto las conexiones TCP utilizan 
el algoritmo de Nagle, almacenan los datos antes de enviarlos fuera. Activando 
`noDelay` enviará inmediatamente los datos cada vez que se llame a `socket.write()`.

## socket.setKeepAlive(enable=false, [initialDelay])

Activa/desactiva la funcionalidad keep-alive, y opcionalmente establece
el retardo inicial antes de que la primera prueba de keep-alive se envíe 
en un socket en espera. Establece `initialDelay` (en milisegundos) como el 
retardo entre el último paquete recibido y la primera prueba de keep-alive. 
Poniendo un 0 en initialDelay mantendrá el valor por defecto (o el previo).

## socket.remoteAddress

La representación en string de la dirección IP remota. Por ejemplo 
`'74.125.127.100'` o `'2001:4860:a005::68'`.

Este miembro sólo está presente en las conexiones del lado servidor.


## Evento: 'connect'

`function () { }`

Se emite cuando se establece con éxito una conexión socket.
Mirar `connect()`.

## Evento: 'data'

`function (data) { }`

Se emite cuando se reciben datos. El argumento `data` será un `Buffer` o un 
`String`.  La codificación de los datos se establece con `socket.setEncoding()`. 
(Mirar la sección de `Socket de Lectura` para más información.)

## Evento: 'end'

`function () { }`

Se emite cuando el otro extremo del socket envía un paquete FIN.

Por defecto (`allowHalfOpen == false`) el socket destruirá su propio descriptor 
de fichero una vez haya escrito lo que tiene pendiente en la cola de escritura. 
Sin embargo, si pones `allowHalfOpen == true` el socket no llamará a `end()` 
automáticamente en su lado permitiendo al usuario escribir cantidades arbitrarias 
de datos, con la advertencia de que el usuario debería llamar a `end()` en su 
lado de inmediato.


## Evento: 'timeout'

`function () { }`

Se emite si el socket agota el timeout por inactividad. Solo sirve para 
notificar que el socket estaba inactivo. El usuario tiene que cerrar la conexión 
manualmente.

Mirar también: `socket.setTimeout()`


## Evento: 'drain'

`function () { }`

Emitido cuando el búfer de escritura se vacía. Sirve para regular las subidas.

## Evento: 'error'

`function (exception) { }`

Se emite cuando se produce un error.  Seguidamente se llamará directamente 
al evento `'close'`.

## Evento: 'close'

`function (had_error) { }`

Se emite cuando se cierra completamente el socket. El argumento `had_error` es un 
boolean que advierte si el socket se ha cerrado debido a un error de transmisión.

---

## net.isIP

## net.isIP(input)

Comprueba si input es una dirección IP. Devuelve 0 para strings inválidos, 
devuelve 4 para direcciones IP de versión 4, y 6 para direcciones IP de versión 6.


## net.isIPv4(input)

Devuelve true si input es una dirección de versión 4, si no devuleve false.


## net.isIPv6(input)

Devuelve true si input es una dirección de versión 6, si no devuleve false.
