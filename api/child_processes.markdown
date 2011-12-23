## Child Processes

Node proporciona un `popen(3)` tri-direccional a través de la clase `ChildProcess`.

Es posible pasar un stream de datos a través del `stdin`, `stdout`, y `stderr` del proceso hijo (child) de manera totalmente sin bloqueo.

Para crear un proceso hijo usa `require('child_process').spawn()`.

Los procesos hijo siempre tienen tres streams asociados a ellos. `child.stdin`, `child.stdout`, y `child.stderr`.

`ChildProcess` es un `EventEmitter`.

### Evento:  'exit'

`function (code, signal) {}`

Este evento es emitido después de termine el proceso hijo. Si el proceso terminó de manera normal, `code` es el código de salida final, en caso contrario `null`. Si el proceso terminó debido al recibo de una señal, `signal` es el nombre string de la señal, en caso contrario `null`.

Véase `waitpid(2)`.

### child.stdin

Un `Stream de Escritura` que representa el `stdin` del proceso hijo. Cerrar este stream vía `end()` a menudo causa que termine el proceso hijo.

### child.stdout

Un `Stream de Lectura` que representa el `stdout` del proceso hijo.

### child.stderr

Un `Stream de Lectura` que representa el `stderr` del proceso hijo.

### child.pid

El PID del proceso hijo.

Ejemplo:

    var spawn = require('child_process').spawn,
        grep  = spawn('grep', ['ssh']);

    console.log('Spawned child pid: ' + grep.pid);
    grep.stdin.end();


### child_process.spawn(command, args=[], [options])

Inicia un nuevo proceso con el `command` proporcionado, con argumentos de linea de comandos `args`. Si es omitido, `args` por defecto sera un Array vacío.

El tercer argumento es usado para especificar opciones adicionales, que por defecto serán:

    { cwd: undefined,
      env: process.env,
      customFds: [-1, -1, -1],
      setsid: false
    }

`cwd` te deja especificar el directorio actual de trabajo del cual es iniciado el proceso hijo. Usa `env` para especificar variables de entorno que serán visibles al nuevo proceso. Con `customFds` es posible enganchar los [stdin, stout, stderr] de nuevos procesos a streams ya existentes; `-1` significa que un nuevo stream debe ser creado. `setsid`, si puesto en true, causara que el subproceso sea ejecutado en una nueva sesión.

Ejemplo ejecutando `ls -lh /usr`, capturando `stdout`, `stderr`, y el codigo de salida:

    var util  = require('util'),
        spawn = require('child_process').spawn,
        ls    = spawn('ls', ['-lh', '/usr']);

    ls.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    ls.on('exit', function (code) {
      console.log('child process exited with code ' + code);
    });


Ejemplo: Una manera muy elaborada de ejecutar 'ps ax | grep ssh'

    var util  = require('util'),
        spawn = require('child_process').spawn,
        ps    = spawn('ps', ['ax']),
        grep  = spawn('grep', ['ssh']);

    ps.stdout.on('data', function (data) {
      grep.stdin.write(data);
    });

    ps.stderr.on('data', function (data) {
      console.log('ps stderr: ' + data);
    });

    ps.on('exit', function (code) {
      if (code !== 0) {
        console.log('ps process exited with code ' + code);
      }
      grep.stdin.end();
    });

    grep.stdout.on('data', function (data) {
      console.log(data);
    });

    grep.stderr.on('data', function (data) {
      console.log('grep stderr: ' + data);
    });

    grep.on('exit', function (code) {
      if (code !== 0) {
        console.log('grep process exited with code ' + code);
      }
    });


Ejemplo de comprobar por ejecución fallida:

    var spawn = require('child_process').spawn,
        child = spawn('bad_command');

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
      if (/^execvp\(\)/.test(data)) {
        console.log('Failed to start child process.');
      }
    });


Véase tambien: `child_process.exec()`

### child_process.exec(command, [options], callback)

Manera “alto-nivel” de ejecutar un comando en un proceso hijo, buffer la salida, y devolverlo todo en un callback.

    var util = require('util'),
        exec = require('child_process').exec,
        child;

    child = exec('cat *.js bad_file | wc -l',
      function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
    });

El callback recibe los argumentos `(error, stdout, stderr)`. Cuando termina con éxito, `error` sera `null`.  Cuando termina con error, `error` sera una instancia de `Error` y `err.code` sera el código de salida del proceso hijo, y `err.signal` sera la señal que terminó el proceso.

Hay un segundo argumento opcional para especificar varias opciones. Las opciones predeterminadas son

    { encoding: 'utf8',
      timeout: 0,
      maxBuffer: 200*1024,
      killSignal: 'SIGTERM',
      cwd: null,
      env: null }

Si `timeout` es mayor que 0, entonces detendrá el proceso hijo si este se ejecuta mas de `timeout` milisegundos. El proceso hijo se detiene con `killSignal` (por defecto: `'SIGTERM'`). `maxBuffer` especifica la mayor cantidad de datos permitidos en stdout o stderr - si este valor se excede el proceso hijo sera terminado.

### child.kill(signal='SIGTERM')

Manda una señal al proceso hijo. Si ningún argumento es dado, al proceso se le mandara `'SIGTERM'`. Véase `signal(7)` para una lista de señales disponibles.

    var spawn = require('child_process').spawn,
        grep  = spawn('grep', ['ssh']);

    grep.on('exit', function (code, signal) {
      console.log('child process terminated due to receipt of signal '+signal);
    });

    // send SIGHUP to process
    grep.kill('SIGHUP');

Observa que mientras la función se llama `kill`, la señal entregada al proceso hijo puede o no terminarlo.  `kill` realmente solo manda una señal a un proceso.

Véase `kill(2)`
