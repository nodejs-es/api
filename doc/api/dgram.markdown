## UDP / Sockets de Datagrama

Los sockets de datagrama están disponibles a través de `require('dgram')`.  Normalmente los datagramas 
se manejan como mensajes IP/UDP pero también se pueden usar a través de sockets de dominio Unix.

### Evento: 'message'

`function (msg, rinfo) { }`

Emitido cuando está disponible un nuevo datagrama en el socket.  `msg es un `Buffer` y `rinfo` es 
un objeto con la dirección de quien lo envía y el número de bytes que contiene el datagrama.

### Evento: 'listening'

`function () { }`

Emitido cuando un socket empieza a escuchar la llegada de datagramas.  Esto ocurre tan pronto como 
son creados los sockets UDP.  Los sockets de dominio Unix no empiezan a escuchar hasta que se llama 
implícitamente a `bind()`.

### Evento: 'close'

`function () { }`

Emitido cuando se cierra un socket con `close()`. No se emitirán nuevos `message`en este 
socket.

### dgram.createSocket(type, [callback])

Crea un socket de datagrama del tipo especificado.  Los tipos válidos son:
`udp4`, `udp6` y `unix_dgram`.

Recibe un callback opcional que se añade como listener de los eventos `message`.

### dgram.send(buf, offset, length, path, [callback])

Para los sockets de datagrama del dominio Unix, la dirección de destion es un nombre de ruta 
en sistema de ficheros. Se puede pasar un callback opcional que se invoca cuando se completa la llamada 
a `sendto` por parte del SO. No es seguro reutilizar `buf` hasta que se ha invocado el callback. Hay 
que tener en cuenta que a no ser que el socket este asociado a un nombre de ruta con `bind()` no hay manera 
de recibir mensajes en el socket.

Ejemplo de envío de un mensaje al syslogd en OSX via un socket de dominio Unix `/var/run/syslog`:

    var dgram = require('dgram');
    var message = new Buffer("Un mensaje de log.");
    var client = dgram.createSocket("unix_dgram");
    client.send(message, 0, message.length, "/var/run/syslog",
      function (err, bytes) {
        if (err) {
          throw err;
        }
        console.log("Se han escrito " + bytes + " bytes en el socket.");
    });

### dgram.send(buf, offset, length, port, address, [callback])

Para los sockets UDP, el puerto y la dirección IP de destino tienen que especificarse.  Se 
puede pasar un string al parámetro `address`, y se podrá resolver por DNS.  Se puede especificar 
un callback opcional para detectar cualquier error de DNS y cuando puede volverse a usar `buf`.  
Tener en cuenta que las búsquedas de DNS retrasarán el tiempo del envío, al menos hasta el siguiente 
tick.  La única manera de asegurarse de que se ha realizado un envío es mediante el callback.

Ejemplo de enviar un paquete UDP a un puerto aleatorio de `localhost`;

    var dgram = require('dgram');
    var message = new Buffer("Algunos bytes");
    var client = dgram.createSocket("udp4");
    client.send(message, 0, message.length, 41234, "localhost");
    client.close();


### dgram.bind(path)

Para los sockets de datagrama de dominio Unix, empezar a escuchar datagramas entrantes en 
el socket especificado por `path`. Notar que los clientes pueden hacer `send()` sin haber hecho `bind()`, 
pero no se recibirá ningún datagrama sin haber hecho un `bind()`.

Ejemplo de un servidor de datagramas de dominio Unix, que devuelve el eco de los mensajes que recibe:

    var dgram = require("dgram");
    var serverPath = "/tmp/dgram_server_sock";
    var server = dgram.createSocket("unix_dgram");

    server.on("message", function (msg, rinfo) {
      console.log("recibido: " + msg + " de " + rinfo.address);
      server.send(msg, 0, msg.length, rinfo.address);
    });

    server.on("listening", function () {
      console.log("servidor escuchando " + server.address().address);
    })

    server.bind(serverPath);

Ejemplo de un cliente de datagramas de dominio Unix que habla con el servidor:

    var dgram = require("dgram");
    var serverPath = "/tmp/dgram_server_sock";
    var clientPath = "/tmp/dgram_client_sock";

    var message = new Buffer("Un mensaje el " + (new Date()));

    var client = dgram.createSocket("unix_dgram");

    client.on("message", function (msg, rinfo) {
      console.log("recibido: " + msg + " de " + rinfo.address);
    });

    client.on("listening", function () {
      console.log("cliente escuchando " + client.address().address);
      client.send(message, 0, message.length, serverPath);
    });

    client.bind(clientPath);

### dgram.bind(port, [address])

Para los sockets UDP, hay que escuhar los datagramas en un `port` específico y en el `address` opcional.  Si 
no se especifica `address`, el SO intentará escuchar en todas las direcciones.

Ejemplo de un servidor UDP escuchando en el puerto 41234:

    var dgram = require("dgram");

    var server = dgram.createSocket("udp4");

    server.on("message", function (msg, rinfo) {
      console.log("el servidor ha recibido: " + msg + " de " +
        rinfo.address + ":" + rinfo.port);
    });

    server.on("listening", function () {
      var address = server.address();
      console.log("servidor escuchando " +
          address.address + ":" + address.port);
    });

    server.bind(41234);
    // server listening 0.0.0.0:41234


### dgram.close()

Cierra el socket subyacente y para de escuchar datos en él.  Los sockets UDP 
automáticamente se ponen a escuchar mensjaes, incluso si no han llamado a `bind()`.

### dgram.address()

Devuelve un objeto que contiene la información de la dirección de un socket.  Para los sockets 
UDP, este objeto contendrá la `address` y el `port`.  Para los sockets de dominio Unix, solo contendrá 
la `address`.

### dgram.setBroadcast(flag)

Establece o borra la opción del socket `SO_BROADCAST`.  Cuando se activa esta opción, los 
paquetes UDP se pueden enviar una dirección de broadcast de un interfaz local.

### dgram.setTTL(ttl)

Establece la opción de socket `IP_TTL`.  TTL significa "Time to Live", pero en este contexto 
especifica el número de saltos IP que se permite hacer al paquete.  Cada router o gateway que 
reenvíe un paquete decrementa el TTL.  Si un router decrementa el TTL a 0, no se reenviará.  
El cambio de los valores del TTL es un uso típico para probar la red o con multicasting.

El argumento que se le pasa a `setTTL()`es el número de saltos entre 1 y 255.  Por defecto 
en la mayoría de sistemas es 64.

### dgram.setMulticastTTL(ttl)

Establece la opción de socket `IP_MULTICAST_TTL`. TTL significa "Time to Live", pero en este contexto 
especifica el número de saltos IP que se permite hacer al paquete.  Cada router o gateway que 
reenvíe un paquete decrementa el TTL.  Si un router decrementa el TTL a 0, no se reenviará.  
 
El argumento que se le pasa a `setMulticastTTL()` es el número de saltos entre 0 y 255.  Por defecto 
en la mayoría de sistemas es 64.

### dgram.setMulticastLoopback(flag)

Establece o borra la opción de socket `IP_MULTICAST_LOOP`.  Cuand esta opción está activa,  
también se recibirán paquetes multicast en el interfaz local. 

### dgram.addMembership(multicastAddress, [multicastInterface])

Comunica al kernel la suscripción a un grupo multicast con la opción de socket `IP_ADD_MEMBERSHIP`. 

Si no se especifica `multicastAddress`, el SO intentará suscribir todos los interfaces válidos.

### dgram.dropMembership(multicastAddress, [multicastInterface])

El contrario de `addMembership` - comunica al kernel el abandono de un grupo multicast con 
la opción de socket `IP_DROP_MEMBERSHIP`. Este método se llama automáticamente por el kernel 
cuando se cierra el socket o el proceso termina, así que la mayoría de aplicaciones nunca tendrán 
que llamarlo. 

Si no se especifica `multicastAddress`, el SO intentará suscribir todos los interfaces válidos.

