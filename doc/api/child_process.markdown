# Child Process

    Stability: 3 - Stable

Node proporciona un `popen(3)` tri-direccional a través del
módulo `ChildProcess`.

Es posible pasar un stream de datos a través del `stdin`, `stdout`, y
`stderr` del proceso hijo (child) de manera totalmente sin bloqueo.

Para crear un proceso hijo utilice `require('child_process').spawn()` o
`require('child_process').fork()`.  La semántica de cada uno son un poco
diferente, y se explica a continuación.

## Class: ChildProcess

`ChildProcess` es `EventEmitter`.

Los procesos hijo siempre tienen tres streams asociados a ellos. `child.stdin`,
`child.stdout`, y `child.stderr`.  These may be shared with the stdio
streams of the parent process, or they may be separate stream objects
which can be piped to and from.

The ChildProcess class is not intended to be used directly.  Use the
`spawn()` or `fork()` methods to create a Child Process instance.

### Evento:  'exit'

* `code` {Number} the exit code, if it exited normally.
* `signal` {String} the signal passed to kill the child process, if it
  was killed by the parent.

Este evento es emitido después de termine el proceso hijo. Si el proceso terminó
de manera normal, `code` es el código de salida final, en caso contrario `null`. Si
el proceso terminó debido al recibo de una señal, `signal` es el nombre string de
la señal, en caso contrario `null`.

Véase `waitpid(2)`.

### Event: 'disconnect'

This event is emitted after using the `.disconnect()` method in the parent or
in the child. After disconnecting it is no longer possible to send messages.
An alternative way to check if you can send messages is to see if the
`child.connected` property is `true`.

### child.stdin

* {Stream object}

Un `Stream de Escritura` que representa el `stdin` del proceso hijo.
Cerrar este stream vía `end()` a menudo causa que termine el proceso hijo.

If the child stdio streams are shared with the parent, then this will
not be set.

### child.stdout

* {Stream object}

Un `Stream de Lectura` que representa el `stdout` del proceso hijo.

If the child stdio streams are shared with the parent, then this will
not be set.

### child.stderr

* {Stream object}

Un `Stream de Lectura` que representa el `stderr` del proceso hijo.

If the child stdio streams are shared with the parent, then this will
not be set.

### child.pid

* {Integer}

El PID del proceso hijo.

Ejemplo:

    var spawn = require('child_process').spawn,
        grep  = spawn('grep', ['ssh']);

    console.log('Spawned child pid: ' + grep.pid);
    grep.stdin.end();

### child.kill([signal])

* `signal` {String}

Manda una señal al proceso hijo. Si ningún argumento es dado, el proceso 
enviará `'SIGTERM'`. Véase `signal(7)` para una lista de señales disponibles.

    var spawn = require('child_process').spawn,
        grep  = spawn('grep', ['ssh']);

    grep.on('exit', function (code, signal) {
      console.log('child process terminated due to receipt of signal '+signal);
    });

    // send SIGHUP to process
    grep.kill('SIGHUP');

Observa que mientras la función se llama `kill`, la señal entregada al proceso hijo
puede o no terminarlo.  `kill` realmente solo manda una señal a un proceso.

Véase `kill(2)`


### child.send(message, [sendHandle])

* `message` {Object}
* `sendHandle` {Handle object}

Send a message (and, optionally, a handle object) to a child process.

See `child_process.fork()` for details.

## child_process.spawn(command, [args], [options])

* `command` {String} The command to run
* `args` {Array} List of string arguments
* `options` {Object}
  * `cwd` {String} Current working directory of the child process
  * `customFds` {Array} **Deprecated** File descriptors for the child to use
    for stdio.  (See below)
  * `env` {Object} Environment key-value pairs
  * `setsid` {Boolean}
* return: {ChildProcess object}

Inicia un nuevo proceso con el `command` proporcionado, con argumentos de linea de comandos `args`.
Si es omitido, `args` por defecto sera un Array vacío.

El tercer argumento es usado para especificar opciones adicionales, que por defecto serán:

    { cwd: undefined,
      env: process.env
    }

`cwd` te deja especificar el directorio actual de trabajo del cual es iniciado el proceso.
Usa `env` para especificar variables de entorno que serán visibles al nuevo proceso.

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

Note that if spawn receives an empty options object, it will result in
spawning the process with an empty environment rather than using
`process.env`. This due to backwards compatibility issues with a deprecated
API.

There is a deprecated option called `customFds` which allows one to specify
specific file descriptors for the stdio of the child process. This API was
not portable to all platforms and therefore removed.
With `customFds` it was possible to hook up the new process' `[stdin, stdout,
stderr]` to existing streams; `-1` meant that a new stream should be created.
Use at your own risk.

There are several internal options. In particular `stdinStream`,
`stdoutStream`, `stderrStream`. They are for INTERNAL USE ONLY. As with all
undocumented APIs in Node, they should not be used.

Véase tambien: `child_process.exec()` y `child_process.fork()`

## child_process.exec(command, [options], callback)

* `command` {String} The command to run, with space-separated arguments
* `options` {Object}
  * `cwd` {String} Current working directory of the child process
  * `customFds` {Array} **Deprecated** File descriptors for the child to use
    for stdio.  (See below)
  * `env` {Object} Environment key-value pairs
  * `setsid` {Boolean}
  * `encoding` {String} (Default: 'utf8')
  * `timeout` {Number} (Default: 0)
  * `maxBuffer` {Number} (Default: 200*1024)
  * `killSignal` {String} (Default: 'SIGTERM')
* `callback` {Function} called with the output when process terminates
  * `code` {Integer} Exit code
  * `stdout` {Buffer}
  * `stderr` {Buffer}
* Return: ChildProcess object

Runs a command in a shell and buffers the output.

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

El callback recibe los argumentos `(error, stdout, stderr)`. Cuando termina
con éxito, `error` sera `null`.  Cuando termina con error, `error` sera una 
instancia de `Error` y `err.code` sera el código de salida del proceso hijo,
y `err.signal` sera la señal que terminó el proceso.

Hay un segundo argumento opcional para especificar varias opciones. Las 
opciones predeterminadas son

    { encoding: 'utf8',
      timeout: 0,
      maxBuffer: 200*1024,
      killSignal: 'SIGTERM',
      cwd: null,
      env: null }

Si `timeout` es mayor que 0, entonces detendrá el proceso hijo 
si este se ejecuta mas de `timeout` milisegundos. El proceso hijo se detiene con
`killSignal` (por defecto: `'SIGTERM'`). `maxBuffer` especifica la mayor cantidad
de datos permitidos en stdout o stderr - si este valor se excede el proceso hijo
sera terminado.


## child_process.execFile(file, args, options, callback)

* `file` {String} The filename of the program to run
* `args` {Array} List of string arguments
* `options` {Object}
  * `cwd` {String} Current working directory of the child process
  * `customFds` {Array} **Deprecated** File descriptors for the child to use
    for stdio.  (See below)
  * `env` {Object} Environment key-value pairs
  * `setsid` {Boolean}
  * `encoding` {String} (Default: 'utf8')
  * `timeout` {Number} (Default: 0)
  * `maxBuffer` {Number} (Default: 200*1024)
  * `killSignal` {String} (Default: 'SIGTERM')
* `callback` {Function} called with the output when process terminates
  * `code` {Integer} Exit code
  * `stdout` {Buffer}
  * `stderr` {Buffer}
* Return: ChildProcess object

This is similar to `child_process.exec()` except it does not execute a
subshell but rather the specified file directly. This makes it slightly
leaner than `child_process.exec`. It has the same options.


## child_process.fork(modulePath, [args], [options])

* `modulePath` {String} The module to run in the child
* `args` {Array} List of string arguments
* `options` {Object}
  * `cwd` {String} Current working directory of the child process
  * `customFds` {Array} **Deprecated** File descriptors for the child to use
    for stdio.  (See below)
  * `env` {Object} Environment key-value pairs
  * `setsid` {Boolean}
  * `encoding` {String} (Default: 'utf8')
  * `timeout` {Number} (Default: 0)
* `callback` {Function} called with the output when process terminates
  * `code` {Integer} Exit code
  * `stdout` {Buffer}
  * `stderr` {Buffer}
* Return: ChildProcess object

This is a special case of the `spawn()` functionality for spawning Node
processes. In addition to having all the methods in a normal ChildProcess
instance, the returned object has a communication channel built-in. The
channel is written to with `child.send(message, [sendHandle])` and messages
are received by a `'message'` event on the child.

For example:

    var cp = require('child_process');

    var n = cp.fork(__dirname + '/sub.js');

    n.on('message', function(m) {
      console.log('PARENT got message:', m);
    });

    n.send({ hello: 'world' });

And then the child script, `'sub.js'` might look like this:

    process.on('message', function(m) {
      console.log('CHILD got message:', m);
    });

    process.send({ foo: 'bar' });

In the child the `process` object will have a `send()` method, and `process`
will emit objects each time it receives a message on its channel.

There is a special case when sending a `{cmd: 'NODE_foo'}` message. All messages
containing a `NODE_` prefix in its `cmd` property will not be emitted in
the `message` event, since they are internal messages used by node core.
Messages containing the prefix are emitted in the `internalMessage` event, you
should by all means avoid using this feature, it may change without warranty.

By default the spawned Node process will have the stdout, stderr associated
with the parent's. To change this behavior set the `silent` property in the
`options` object to `true`.

These child Nodes are still whole new instances of V8. Assume at least 30ms
startup and 10mb memory for each new Node. That is, you cannot create many
thousands of them.

The `sendHandle` option to `child.send()` is for sending a handle object to
another process. Child will receive the handle as as second argument to the
`message` event. Here is an example of sending a handle:

    var server = require('net').createServer();
    var child = require('child_process').fork(__dirname + '/child.js');
    // Open up the server object and send the handle.
    server.listen(1337, function() {
      child.send({ server: true }, server._handle);
    });

Here is an example of receiving the server handle and sharing it between
processes:

    process.on('message', function(m, serverHandle) {
      if (serverHandle) {
        var server = require('net').createServer();
        server.listen(serverHandle);
      }
    });

To close the IPC connection between parent and child use the
`child.disconnect()` method. This allows the child to exit gracefully since
there is no IPC channel keeping it alive. When calling this method the
`disconnect` event will be emitted in both parent and child, and the
`connected` flag will be set to `false`. Please note that you can also call
`process.disconnect()` in the child process.