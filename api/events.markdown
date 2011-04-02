## Eventos

Muchos objetos en Node emiten eventos: un `net.Server` emite un evento cada vez que se establece una conexión, un `fs.readStream` emite un evento cuando se abre un fichero. Todos los objectos que emiten eventos son instancias de `events.EventEmitter`.
Puedes usar este módulo haciendo `require("events");`

Normalmente, los nombres de los eventos se representan mediante la notación camello, sin embargo, no hay ninguna restricción en este aspecto y cualquier cadena será aceptada.

Se pueden adjuntar funciones a objetos, para que sean ejecutadas cuando se emita un evento. Estas funciones reciben el nombre de _listeners_. 

### events.EventEmitter
Para usar la clase EventEmitter, haz de importarla
haciendo `require('events').EventEmiter`.

Cuando una instancia de la clase EventEmitter se encuentra con un error, la acción típica
es emitir un evento de error. Los eventos de error son tratados como un caso especial en node.
Si no tiene un listener asociado la acción por defecto será imprimir la traza de la pila y salir
del programa

Todos los EventEmitters emite el evento `'newListener'` cuando se añaden nuevos listeners.

#### emitter.addListener(event, listener)
#### emitter.on(event, listener)

Añade un listener al final del array de listeners para el evento espeficicado

    server.on('connection', function (stream) {
      console.log('someone connected!');
    });

#### emitter.once(event, listener)

Añade un listener al evento. El listener se invocará sólo la primera vez que se dispara el evento.
luego se elimina. 

    server.once('connection', function (stream) {
      console.log('Ah, we have our first user!');
    });

#### emitter.removeListener(event, listener)

Elimina un listener del array de listeners asociado al evento especificado
**Ojo**: modifica el indice del array de listeners 

    var callback = function(stream) {
      console.log('someone connected!');
    };
    server.on('connection', callback);
    // ...
    server.removeListener('connection', callback);


#### emitter.removeAllListeners(event)

Elimina todos los listeners del array de listeners asociado al evento especificado

#### emitter.setMaxListeners(n)

Por defecto los EventEmitters imprimirán un warning si se le añaden más de 10 listeners.
Este comportamiento por defecto ayuda a encontrar memory leaks. Obviamente no todos los EventEmitters
deberían limitarse a 10. Esta función permite incrementar este valor. Use cero para establecer un valor ilimitado.


#### emitter.listeners(event)

Devuelve un array de listeners asociado al evento especificado. Este array puede ser manipulado, por ejemplo, eliminando un listener.

    server.on('connection', function (stream) {
      console.log('someone connected!');
    });
    console.log(util.inspect(server.listeners('connection')); // [ [Function] ]

#### emitter.emit(event, [arg1], [arg2], [...])

Llama a cada uno de los listeners en el orden en el que fueron pasados por parámetros

#### Event: 'newListener'

`function (event, listener) { }`

Este evento es emitido cada vez que alguien añade un nuevo listener.
