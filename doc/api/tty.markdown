## TTY (Terminal)

Utilice `require('tty')` para acceder al módulo.

Ejemplo:

    var tty = require('tty');
    tty.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('keypress', function(char, key) {
      if (key && key.ctrl && key.name == 'c') {
        console.log('salida airosa');
        process.exit()
      }
    });



### tty.open(path, args=[])

Genera un nuevo proceso con el fichero ejecutable en la `ruta` como la sesión
actual a una nueva pseudo terminal.

Devuelve un array `[slaveFD, childProcess]`. `slaveFD` es el descriptor de fichero
esclavo de la pseudo terminal. `childProcess` es un proceso hijo de un 
objeto.


### tty.isatty(fd)

Devuelve `true` o `false` dependiendo si el `fd` es asociado con el
terminal.


### tty.setRawMode(mode)

`mode` debe ser `true` o `false`. Se establece las propiedades al proceso actual
de stdin fd para actuar ya sea como un dispositivo de modo sin formato o por omisión.


### tty.setWindowSize(fd, row, col)

`ioctl` ajusta la configuración de la ventana del descriptor de fichero.


### tty.getWindowSize(fd)

Devuelve `[row, col]` associado a la TTY con el descriptor de fichero.


