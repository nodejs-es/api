# Objetos Globales

<!-- type=misc -->

Estos objectos estan disponibles en todos los módulos. Algunos de estos
objetos no están en el ámbito global pero si a nivel módulo - Tómelo en cuenta.

## global

<!-- type=global -->

* {Object} El namespace del objeto global.

En los navegadores, el ambito del nivel superior es el ambito global. Esto significa
que en los navegadores si tu estas en el ambito global `var something` definirá una variable.
En Node esto es diferente. El ambito del nivel superior no es el ambito global; 
`var something` dentro de un módulo de node será local para este módulo.

### process

<!-- type=global -->

* {Object}

El objeto process. Véase la sección [objeto process](process.html#process).

### console

<!-- type=global -->

* {Object}

Usado para la salida de pantalla de stdout y stderr. Véase la sección [stdio](stdio.html)

## Class: Buffer

<!-- type=global -->

* {Function}

Used to handle binary data. See the [buffer section](buffer.html).

## require()

<!-- type=var -->

* {Function}

Para requerir módulos. Véase la sección [Módules](modules.html#modules).
`require` no es global sino más bien local para cada módulo.

### require.resolve()

Usa el mecanismo interno de `require()` para buscar la localización de un módulo,
pero en lugar de cargar el módulo, solo devuelve el nombre del fichero que lo contine.

### require.cache

* {Object}

Modules are cached in this object when they are required. By deleting a key
value from this object, the next `require` will reload the module.

### __filename

<!-- type=var -->

* {String}

El nombre del fichero que contiene al script que esta siendo ejecutado. 
Este esta definido como ruta absoluta, y no es necesariamente el mismo nombre
del fichero pasado como argumento en la linea de comando. El valor dentro
del módulo es la ruta al mismo.

Ejemplo: Ejecutando `node example.js` desde `/User/mjr`

    console.log(__filename);
    // /Users/mjr/example.js

`__filename` isn't actually a global but rather local to each module.

## __dirname

<!-- type=var -->

* {String}

El nombre del directorio del script que esta siendo ejecutado.

Ejemplo:Ejecutando `node example.js` desde `/User/mjr`

    console.log(__dirname);
    // /Users/mjr

`__dirname` isn't actually a global but rather local to each module.


## module

<!-- type=var -->

* {Object}

Una referencia al actual módulo. En particular 
`module.exports` es igual al objeto `exports`.
`module` isn't actually a global but rather local to each module.

Véase [la documentación del sistema de módulos](modules.html) para más
información.

## exports

<!-- type=var -->

An object which is shared between all instances of the current module and
made accessible through `require()`.
`exports` is the same as the `module.exports` object.
`exports` isn't actually a global but rather local to each module.

See the [module system documentation](modules.html) for more
information.

See the [module section](modules.html) for more information.

## setTimeout(cb, ms)
## clearTimeout(t)
## setInterval(cb, ms)
## clearInterval(t)

<!--type=global-->

The timer functions are global variables. See the [timers](timers.html) section.