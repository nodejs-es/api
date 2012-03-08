# process

El objeto `process` es un objeto global y puede ser accedido desde cualquier parte.
Es una instancia de `EventEmitter`.


## Evento: 'exit'

`function () {}`

Emitido cuando el proceso está apunto de salir. Es un buen hook para realizar 
un control del tiempo constante del estado del módulo (por ejemplo para tests unitarios).  
El bucle del evento principal no seguirá ejecutándose después de finalizar el callback 'exit', 
por lo tanto los timers no pueden ser programados.

Ejemplo escuchando a `exit`:

    process.on('exit', function () {
      process.nextTick(function () {
       console.log('Esto no se ejecutará');
      });
      console.log('Apunto de salir.');
    });


## Evento: 'uncaughtException'

`function (err) { }`

Emitido cuando una excepción es devuelta hacia el bucle de evento. Si se
ha añadido un listener a esta excepción, no se producirá la acción por defecto 
(imprimir una traza del stack y salir).

Ejemplo escuchando a `uncaughtException`:

    process.on('uncaughtException', function (err) {
      console.log('Excepción recogida: ' + err);
    });

    setTimeout(function () {
      console.log('Esto seguirá ejecutándose.');
    }, 500);

    // Se fuerza una excepción, pero no se recoge.
    nonexistentFunc();
    console.log('Esto no se ejecutará.');

Nótese que `uncaughtException` es un mecanismo muy básico para 
manejar excepciones.  Usando try / catch en tu programa te dará más control sobre
el flujo de tu programa. Especialmente para aplicaciones de servidor que están diseñados para
ejecutarse eternamente, `uncaughtException` puede ser un mecanismo muy útil de seguridad.


## Eventos de señal

`function () {}`

Emitido cuando los procesos reciben una señal. Mirar sigaction(2) para una lista de 
nombres de señal estándard POSIX como SIGINT, SIGUSR1, etc.

Ejemplo escuchando a `SIGINT`:

    // Empieza leyendo de stdin para evitar salir.
    process.stdin.resume();

    process.on('SIGINT', function () {
      console.log('Recibido SIGINT.  Haz Control-D para salir.');
    });

Una manera sencilla de enviar la señal `SIGINT` es con `Control-C` en la mayoria 
de aplicaciones de terminal.


## process.stdout

Un `Stream de Escritura` para `stdout`.

Ejemplo: la definición de `console.log`

    console.log = function (d) {
      process.stdout.write(d + '\n');
    };


### process.stderr

Un stream de escritura para stderr. Las escrituras en este stream son bloqueantes.


### process.stdin

Un `Stream de Lectura` para stdin. El stream stdin se detiene por defecto, así que 
se tiene que llamar a `process.stdin.resume()` para leer de él.

Ejemplo de como abir la entrada estándard (stdin) y escuchar a ambos eventos:

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function (chunk) {
      process.stdout.write('data: ' + chunk);
    });

    process.stdin.on('end', function () {
      process.stdout.write('end');
    });


### process.argv

Un array que contiene los argumentos de la línea de comandos. El primer elemento será
'node', el segundo elemento será el nombre del fichero JavaScript. Los
siguientes elementos serán argumentos adicionales de la línea de comandos.

    // imprimir process.argv
    process.argv.forEach(function (val, index, array) {
      console.log(index + ': ' + val);
    });

Generará:

    $ node process-2.js one two=three four
    0: node
    1: /Users/mjr/work/node/process-2.js
    2: one
    3: two=three
    4: four


### process.execPath

Es la ruta absoluta del ejecutable que inició el proceso.

Ejemplo:

    /usr/local/bin/node


## process.chdir(directory)

Cambia el directorio actual de trabajo del proceso o lanza una excepción si falla.

    console.log('Directorio inicial: ' + process.cwd());
    try {
      process.chdir('/tmp');
      console.log('Directorio nuevo: ' + process.cwd());
    }
    catch (err) {
      console.log('chdir: ' + err);
    }



## process.cwd()

Devuelve el directorio actual de trabajo del proceso.

    console.log('Directorio actual: ' + process.cwd());


### process.env

Un objeto que contiene el entorno del usuario. Mirar environ(7).


### process.exit(code=0)

Termina el proceso con el `code` especificado.  Si se omite, `exit` usa el código 
de 'éxito' `0`.

Para salir con un código de 'fallo':

    process.exit(1);

El shell que ha ejecutado node debería ver 1 como código de salida.


## process.getgid()

Obtiene la identidad de grupo del proceso.  (Mirar getgid(2).)
Es el id de grupo numérico, no el nombre del grupo.

    console.log('Actual gid: ' + process.getgid());


### process.setgid(id)

Establece la identidad de grupo del proceso. (Mirar setgid(2).)  Acepta tanto 
un ID numérico como una cadena de texto con el nombre del grupo. 
Si se especifica el nombre del grupo, el método se bloquea mientras lo 
resuelve a un ID numérico.

    console.log('Actual gid: ' + process.getgid());
    try {
      process.setgid(501);
      console.log('Nuevo gid: ' + process.getgid());
    }
    catch (err) {
      console.log('Fallo al cambiar el gid: ' + err);
    }


## process.getuid()

Obtiene la identidad de usuario del proceso. (Mirar getuid(2).)
Es la id de usuario númerica, no el nombre de usuario.

    console.log('Actual uid: ' + process.getuid());


### process.setuid(id)

Establece la identidad de usuario del proceso. (Mirar setuid(2).)  Acepta tanto 
un ID numérico como una cadena de texto con el nombre de usuario.  Si se especifica 
el nombre de usuario, el método se bloquea mientras lo resuelve a un ID numérico.

    console.log('Actual uid: ' + process.getuid());
    try {
      process.setuid(501);
      console.log('Nuevo uid: ' + process.getuid());
    }
    catch (err) {
      console.log('Fallo al establecer uid: ' + err);
    }


## process.version

Una propiedad dentro del compilado que expone `NODE_VERSION`.

    console.log('Versión: ' + process.version);


## process.installPrefix

Una propiedad dentro del compilado que expone `NODE_PREFIX`.

    console.log('Prefijo: ' + process.installPrefix);


## process.kill(pid, signal='SIGTERM')

Envia una señal a un proceso. `pid` es la id de proceso y `signal` es la cadena de 
texto que describe la señal a enviar.  Los nombres de señales son cadenas de texto
 como 'SIGINT' o 'SIGUSR1'.  Si se omite, la señal será 'SIGTERM'.
Mirar kill(2) para más información.

Notar que ya que el nombre de la función es `process.kill`, se trata solo de 
un emisor de señales, como la llamada a sistema `kill`. La señal enviada
puede hacer algo más que matar el proceso escogido.

Ejemplo de como enviarse una señal a uno mismo:

    process.on('SIGHUP', function () {
      console.log('Recibida señal SIGHUP.');
    });

    setTimeout(function () {
      console.log('Saliendo.');
      process.exit(0);
    }, 100);

    process.kill(process.pid, 'SIGHUP');


## process.pid

El PID del proceso.

    console.log('El pid de este proceso es  ' + process.pid);

### process.title

Getter/setter para establecer lo que mostrará 'ps'.


## process.platform

En que plataforma se está ejecutando. `'linux2'`, `'darwin'`, etc.

    console.log('La plataforma es ' + process.platform);


### process.memoryUsage()

Devuelve un objeto describiendo el uso de la memoria del proceso Node.

    var util = require('util');

    console.log(util.inspect(process.memoryUsage()));

Generará:

    { rss: 4935680,
      vsize: 41893888,
      heapTotal: 1826816,
      heapUsed: 650472 }

`heapTotal` y `heapUsed` se refieren al uso de la memoria de V8.


### process.nextTick(callback)

En la siguiente iteración del bucle del evento se llama a callback.
No es simplemente un alias para `setTimeout(fn, 0)` , es mucho
más eficiente.

    process.nextTick(function () {
      console.log('nextTick callback');
    });


### process.umask([mask])

Establece o lee la máscara del modo de creación del fichero del proceso. Los procesos 
hijos heredan la máscara del proceso padre. Devuelve la antigua máscara si se pasa el argumento 
`mask`, si no devuelve la máscara actual. 

    var oldmask, newmask = 0644;

    oldmask = process.umask(newmask);
    console.log('Cambiada umask de: ' + oldmask.toString(8) +
                ' a ' + newmask.toString(8));

