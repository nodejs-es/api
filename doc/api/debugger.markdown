# Depurador

    Stability: 3 - Stable

<!-- type=misc -->

V8 viene con el complemento depurador (debugger), el cual puede ser accedido desde fuera 
del proceso vía el [protocolo TCP](http://code.google.com/p/v8/wiki/DebuggerProtocol).
Node posee un cliente incorporado para el depurador. Para usarlo, inicie Node con el argumento
`debug`; y aparecerá:

    % node debug myscript.js
    < debugger listening on port 5858
    connecting... ok
    break in /home/indutny/Code/git/indutny/myscript.js:1
      1 x = 5;
      2 setTimeout(function () {
      3   debugger;
    debug>

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

Entonces una vez que el depurador se ejecute, se generará un break en la línea 4.

    % node debug myscript.js
    < debugger listening on port 5858
    connecting... ok
    break in /home/indutny/Code/git/indutny/myscript.js:1
      1 x = 5;
      2 setTimeout(function () {
      3   debugger;
    debug> cont
    < hello
    break in /home/indutny/Code/git/indutny/myscript.js:3
      1 x = 5;
      2 setTimeout(function () {
      3   debugger;
      4   console.log("world");
      5 }, 1000);
    debug> next
    break in /home/indutny/Code/git/indutny/myscript.js:4
      2 setTimeout(function () {
      3   debugger;
      4   console.log("world");
      5 }, 1000);
      6 console.log("hello");
    debug> repl
    Press Ctrl + C to leave debug repl
    > x
    5
    > 2+2
    4
    debug> next
    < world
    break in /home/indutny/Code/git/indutny/myscript.js:5
      3   debugger;
      4   console.log("world");
      5 }, 1000);
      6 console.log("hello");
      7
    debug> quit
    %


El comando `repl` te permite evaluar el código remotamente. El comando `next` 
continúa la siguiente línea. Hay otros comandos disponibles y algunos más por venir de
tipo ayuda. Escriba `help` para ver otros comandos.

## Watchers

You can watch expression and variable values while debugging your code.
On every breakpoint each expression from the watchers list will be evaluated
in the current context and displayed just before the breakpoint's source code
listing.

To start watching an expression, type `watch("my_expression")`. `watchers`
prints the active watchers. To remove a watcher, type
`unwatch("my_expression")`.

## Commands reference

### Stepping

* `cont`, `c` - Continue execution
* `next`, `n` - Step next
* `step`, `s` - Step in
* `out`, `o` - Step out
* `pause` - Pause running code (like pause button in Developer TOols)

### Breakpoints

* `setBreakpoint()`, `sb()` - Set breakpoint on current line
* `setBreakpoint(line)`, `sb(line)` - Set breakpoint on specific line
* `setBreakpoint('fn()')`, `sb(...)` - Set breakpoint on a first statement in
functions body
* `setBreakpoint('script.js', 1)`, `sb(...)` - Set breakpoint on first line of
script.js
* `clearBreakpoint`, `cb(...)` - Clear breakpoint

### Info

* `backtrace`, `bt` - Print backtrace of current execution frame
* `list(5)` - List scripts source code with 5 line context (5 lines before and
after)
* `watch(expr)` - Add expression to watch list
* `unwatch(expr)` - Remove expression from watch list
* `watchers` - List all watchers and their values (automatically listed on each
breakpoint)
* `repl` - Open debugger's repl for evaluation in debugging script's context

### Execution control

* `run` - Run script (automatically runs on debugger's start)
* `restart` - Restart script
* `kill` - Kill script

### Various

* `scripts` - List all loaded scripts
* `version` - Display v8's version

## Uso avanzado

El depurador V8 puede ser habilitado y accedido ya sea al iniciar Node con el 
comando `--debug` o al señalar un proceso en Node existente 
con `SIGUSR1`.