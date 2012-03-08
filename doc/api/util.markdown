## util

Estas funciones estan en el módulo `'util'`. Usa `require('util')` para acceder a ellas.

### util.debug(string)

Una función de salida síncrona. Bloquerá el proceso y pondrá `string` inmediatamente en `stderr`.

    require('util').debug('mensaje en stderr');

### util.log(string)

Salida con timestamp en `stdout`.

    require('util').log('Mensaje con marca de tiempo.');

### util.inspect(object, showHidden=false, depth=2)

Devuelve la cadena que representa a `object`, lo cual es útil para corregir fallos.

Si `showHidden` es `true`, entonces las propiedades no-enumerables del objeto serán mostradas también.

Si `depth` es proporcionado, le dice a `inspect` cuantas veces tiene que recurrir mientras formatea el objeto. Esto es útil para objetos muy largos y complejos.

Por defecto solo se recurre un par de veces. Para hacer que recurra indefinidamente pasa `null` a `depth`.

Ejemplo de inspeccionar todas las propiedades del objeto `util`:

    var util = require('util');

    console.log(util.inspect(util, true, null));

### util.pump(readableStream, writableStream, [callback])

Experimental

Lee los datos desde `readableStream` y los envia al `writableStream`. Cuando `writableStream.write(data)` devuelve `false` `readableStream` será pausado hasta que ocurra el evento `drain` sobre `writableStream`. `callback` tiene un error como único argumento y es llamada cuando `writableStream` es cerrado o cuando ocurre un error.

### util.inherits(constructor, superConstructor)

Hereda los métodos del prototype desde un [constructor](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/constructor) dentro de otro. El prototype del `constructor` será configurado a un nuevo objecto creado desde `superConstructor`.

Como mejora adicional, `superConstructor`será accesible atravez de la propiedad `constructor.super_`

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
