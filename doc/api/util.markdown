# util

    Stability: 5 - Locked

Estas funciones estan en el módulo `'util'`. Usa `require('util')` para acceder 
a ellas.


## util.format()

Returns a formatted string using the first argument as a `printf`-like format.

The first argument is a string that contains zero or more *placeholders*.
Each placeholder is replaced with the converted value from its corresponding
argument. Supported placeholders are:

* `%s` - String.
* `%d` - Number (both integer and float).
* `%j` - JSON.
* `%%` - single percent sign (`'%'`). This does not consume an argument.

If the placeholder does not have a corresponding argument, the placeholder is
not replaced.

    util.format('%s:%s', 'foo'); // 'foo:%s'

If there are more arguments than placeholders, the extra arguments are
converted to strings with `util.inspect()` and these strings are concatenated,
delimited by a space.

    util.format('%s:%s', 'foo', 'bar', 'baz'); // 'foo:bar baz'

If the first argument is not a format string then `util.format()` returns
a string that is the concatenation of all its arguments separated by spaces.
Each argument is converted to a string with `util.inspect()`.

    util.format(1, 2, 3); // '1 2 3'


## util.debug(string)

Una función de salida síncrona. Bloquerá el proceso y pondrá 
`string` inmediatamente en `stderr`.

    require('util').debug('mensaje en stderr');


### util.log(string)

Salida con timestamp en `stdout`.

    require('util').log('Mensaje con marca de tiempo.');


### util.inspect(object, showHidden=false, depth=2)

Devuelve la cadena que representa a `object`, lo cual es útil para corregir fallos.

Si `showHidden` es `true`, entonces las propiedades no-enumerables del 
objeto serán mostradas también. Por omisión es `false`.

Si `depth` es proporcionado, le dice a `inspect` cuantas veces tiene que recurrir
mientras formatea el objeto. Esto es útil para objetos muy largos y complejos.

Por defecto solo se recurre un par de veces. Para hacer que recurra indefinidamente
pasa `null` a `depth`.

Si `colors` es `true`, entonces la salida mostrará los estilos con los código de colores en ANSI.
Por omisión es `false`.

Ejemplo de inspeccionar todas las propiedades del objeto `util`:

    var util = require('util');

    console.log(util.inspect(util, true, null));


## util.isArray(object)

Returns `true` if the given "object" is an `Array`. `false` otherwise.

    var util = require('util');

    util.isArray([])
      // true
    util.isArray(new Array)
      // true
    util.isArray({})
      // false


## util.isRegExp(object)

Returns `true` if the given "object" is a `RegExp`. `false` otherwise.

    var util = require('util');

    util.isRegExp(/some regexp/)
      // true
    util.isRegExp(new RegExp('another regexp'))
      // true
    util.isRegExp({})
      // false


## util.isDate(object)

Returns `true` if the given "object" is a `Date`. `false` otherwise.

    var util = require('util');

    util.isDate(new Date())
      // true
    util.isDate(Date())
      // false (without 'new' returns a String)
    util.isDate({})
      // false


## util.isError(object)

Returns `true` if the given "object" is an `Error`. `false` otherwise.

    var util = require('util');

    util.isError(new Error())
      // true
    util.isError(new TypeError())
      // true
    util.isError({ name: 'Error', message: 'an error occurred' })
      // false


## util.pump(readableStream, writableStream, [callback])

Experimental

Lee los datos desde `readableStream` y los envia al `writableStream`.
Cuando `writableStream.write(data)` devuelve `false` `readableStream` será
pausado hasta que ocurra el evento `drain` sobre `writableStream`. `callback`
tiene un error como único argumento y es llamada cuando `writableStream` es
cerrado o cuando ocurre un error.


### util.inherits(constructor, superConstructor)

Hereda los métodos del prototype desde un 
[constructor](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/constructor)
dentro de otro. El prototype del `constructor` será configurado a un nuevo
objecto creado desde `superConstructor`.

Como mejora adicional, `superConstructor`será accesible atravez de 
la propiedad `constructor.super_`.

    var util = require("util");
    var events = require("events");

    function MyStream() {
        events.EventEmitter.call(this);
    }

    util.inherits(MyStream, events.EventEmitter);

    MyStream.prototype.write = function(data) {
        this.emit("data", data);
    }

    var stream = new MyStream();

    console.log(stream instanceof events.EventEmitter); // true
    console.log(MyStream.super_ === events.EventEmitter); // true

    stream.on("data", function(data) {
        console.log('Received data: "' + data + '"');
    })
    stream.write("It works!"); // Received data: "It works!"