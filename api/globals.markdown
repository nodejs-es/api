## Objetos Globales

Estos objectos estan disponibles en el espacio global y puedes ser accedidos desde cualquier parte.

### global

El namespace del objeto global.

En los navegadores, el espacio top-level es el espacio global. Esto significa que en los navegadores si tu estas en el espacio global `var something` definirá una variable. In Node esto es diferente. El espacio top-level no es el espacio global; `var something` dentro de un módulo de node será local para este módulo.

### process

El objeto process. Mira la sección 'objeto process'.

### require()

Para requerir módulos. Mira la sección 'Modulos'.

### require.resolve()

Usa el mecanismo interno de `require()` para buscar la localización de un módulo, pero en lugar de cargar el módulo, solo devuelve el nombre del fichero que lo contine.

### require.paths

Un array de busqueda de rutas para `require()`. Este array puede ser modificado para añadirle rutas modificadas.

Ejemplo: Añade una nueva ruta al comienzo de la lista de busqueda.

    require.paths.unshift('/usr/local/node');


### __filename

El nombre del fichero que contiene al script que esta siendo ejecutado. Este esta definido como ruta absoluta, y no es necesariamente el mismo nombre de fichero pasado como argumento en la linea de comando.

Ejemplo: Ejecutando `node example.js` desde `/User/mjr`

    console.log(__filename);
    // /Users/mjr/example.js

### __dirname

El nombre del directorio del script que esta siendo ejecutado.

Ejemplo:Ejecutando `node example.js` desde `/User/mjr`

    console.log(__dirname);
    // /Users/mjr


### module

Una referencia al actual módulo. En particular `module.exports` es igual al objeto `exports`. Mira `src/node.js` para más información.
