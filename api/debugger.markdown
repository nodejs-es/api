## Depurador

V8 viene con con el complemento depurador (debugger), el cual puede ser accedido desde fuera 
del proceso vía el [protocolo TCP](http://code.google.com/p/v8/wiki/DebuggerProtocol).
Node posee un cliente incorporado para el depurador. Para usarlo, inicie Node con el argumento
`debug`; y aparecerá:


    % node debug myscript.js
    debug>

At this point `myscript.js` is not yet running. To start the script, enter
the command `run`. If everything works okay, the output should look like
this:

En este punto `myscript.js` no está ejecutándose. Para iniciar el script, ingrese
el comando `run`. Si todo funciona bien, la salida debe ser algo similar a:

    % node debug myscript.js
    debug> run
    debugger listening on port 5858
    connecting...ok

El cliente depurador de Node no soporta toda una gama de comandos, pero
para cosas sencillas y tareas de inspección es posible su uso. Al poner la declaración `debugger;`
en el código fuente del script, permitirá un punto de interrupción.

Por ejemplo, supongamos que `myscript.js` era así:

    // myscript.js
    x = 5;
    setTimeout(function () {
      debugger;
      console.log("mundo");
    }, 1000);
    console.log("hola");

Entonces una vez que el depurador se ejecute, esto generará un break en la línea 4

    % ./node debug myscript.js
    debug> run
    debugger listening on port 5858
    connecting...ok
    hola
    break in #<an Object>._onTimeout(), myscript.js:4
      debugger;
      ^
    debug> next
    break in #<an Object>._onTimeout(), myscript.js:5
      console.log("mundo");
      ^
    debug> print x
    5
    debug> print 2+2
    4
    debug> next
    world
    break in #<an Object>._onTimeout() returning undefined, myscript.js:6
    }, 1000);
    ^
    debug> quit
    A debugging session is active. Quit anyway? (y or n) y
    %


El comando `print` permite evaluar las variables. El comando `next` continúa
la siguiente línea. Hay otros comandos disponibles y algunos más por venir de
tipo ayuda. Escriba `help` para ver otros comandos.

### Uso avanzado

El depurador V8 puede ser habilitado y accedido ya sea al iniciar Node con el 
comando `--debug` o al señalar un proceso en Node existente con `SIGUSR1`.

