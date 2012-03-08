## REPL

Read-Eval-Print-Loop (REPL) está disponible como un programa independiente y fácilmente
puede incluirse en otros programas.  REPL proporciona una forma de ejecutar interactiva de ejecutar
JavaScript y ver los resultados.  Puede ser utilizado para la depuración, pruebas, o
simplemente para probar cosas.

Debe ejectuarlo en `node` sin singún argumento desde la línea de comandos, debe posicionarse 
dentro de REPL. Posee la edición simple de líneas de emacs.

    mjr:~$ node
    Type '.help' for options.
    > a = [ 1, 2, 3];
    [ 1, 2, 3 ]
    > a.forEach(function (v) {
    ...   console.log(v);
    ...   });
    1
    2
    3

Para editores avanzados, inice node con la variable de entorno `NODE_NO_READLINE=1`.
Esto iniciará la configuración de REPL en la terminal y que le permitirá utilizarlo como `rlwrap`.

Por ejemplo, puede añadir a continuación a su fichero bashrc:

    alias node="env NODE_NO_READLINE=1 rlwrap node"


### repl.start(prompt='> ', stream=process.stdin)

Inicia REPL con el `prompt` como el prompt y  el `stream` para todo los procesos de I/O (Entrada/Salida). 
`prompt` es opcional y por omisión es `> `.  `stream` es opcional y por omisión es 
`process.stdin`.


Multiples REPLs pueden iniciar con una misma instancia de node.  Cada
uno de ellos comparten el objeto global, perotendrán un único proceso de I/O.

Here is an example that starts a REPL on stdin, a Unix socket, and a TCP socket:
Aquí está un ejemplo que inicia REPL en stdin, un socket en Unix, y un socket en TCP:

    var net = require("net"),
        repl = require("repl");

    connections = 0;

    repl.start("node via stdin> ");

    net.createServer(function (socket) {
      connections += 1;
      repl.start("node via Unix socket> ", socket);
    }).listen("/tmp/node-repl-sock");

    net.createServer(function (socket) {
      connections += 1;
      repl.start("node via TCP socket> ", socket);
    }).listen(5001);

Ejecutando el programa desde la línea de comando iniciará REPL en stdin.  Otros
clientes REPL pueden conectarse a través de un socket Unix o TCP. `telnet` es útil
para la conexión de sockets TCP, y `socat` puede ser conectar ambos sockets Unix y
TCP.

Al iniciar REPL desde un socket Unix basado en una instancia de stdin, puede 
conectarse a un  proceso en ejecución de node sin reiniciar el mismo.

### Características de REPL

Dentro de REPL, presione Control+D para salir.  Expresiones de varias líneas pueden ser
ingresadas.

La variable especial `_` (underscore) contiene el resultado de la última expresión.

    > [ "a", "b", "c" ]
    [ 'a', 'b', 'c' ]
    > _.length
    3
    > _ += 1
    4

REPL proporciona acceso a cualquier variable en el ámbito global.
Puede exponer una variable a REPL explícitamente y asignarle a un contexto de objeto asociado 
con cada `REPLServer`.  Por ejemplo:

    // repl_test.js
    var repl = require("repl"),
        msg = "message";

    repl.start().context.m = msg;

Las cosas en el objeto `context` aparecen como local en REPL:

    mjr:~$ node repl_test.js
    > m
    'message'

Hay algunos comandos especiales de REPL:

  - `.break` - Si  bien ingresar expresiones en varias líneas, a veces, pueden perderse
    o simplemente no son tomados en cuenta. `.break` comenzará de nuevo.
  - `.clear` - Restablece el objeto `context` a un objeto vacío y borra cualquier
    expresión de varias líneas.
  - `.exit` - Cierra los stream de I/O, que hará que REPL termine.
  - `.help` - Muestra la lista de comandos especiales.

Lo siguinete son cominaciones del teclado para el uso especial de REPL:

  - `<ctrl>C` - Similar a la tecla `break`. Termina el comando
    actual. Presione dos veces en la línea para forzar la salida.
  - `<ctrl>D` - Similar a la tecla `.exit`.
